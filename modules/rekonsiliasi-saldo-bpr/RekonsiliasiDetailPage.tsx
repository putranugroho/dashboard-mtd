"use client";

import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getAccountingHistory } from "@/lib/api/accounting-history";
import { CoreHistoryTrxItem, getCoreHistoryTrx } from "@/lib/api/history-trx";
import { RekonsiliasiRow, RekonTransactionDiffResult } from "./types";
import { formatCurrency } from "./utils";

type Props = {
  row: RekonsiliasiRow;
  bprId?: string;
  onBack: () => void;
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function toCoreDate(value: string) {
  return String(value || "").replaceAll("-", "");
}

function normalizeCompareDate(value: string) {
  return String(value || "").replaceAll("-", "").slice(0, 8);
}

function cleanAccountingRrn(value: string) {
  return String(value || "").replace(/-\d+$/, "");
}

function getCoreDokumen(item: CoreHistoryTrxItem) {
  return String(item.dokumen ?? item.dokument ?? "");
}

function toNumber(value: unknown) {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function buildCoreKey(item: CoreHistoryTrxItem) {
  const dokumen = getCoreDokumen(item);
  const tgltrn = normalizeCompareDate(String(item.tgltrn ?? ""));

  return `${dokumen}::${tgltrn}`;
}

function buildAccountingKey(item: {
  rrn?: string;
  tgl_val?: string;
}) {
  const rrn = cleanAccountingRrn(String(item.rrn ?? ""));
  const tglVal = normalizeCompareDate(String(item.tgl_val ?? ""));

  return `${rrn}::${tglVal}`;
}

function buildTransactionDiff(params: {
  coreItems: CoreHistoryTrxItem[];
  accountingItems: Awaited<ReturnType<typeof getAccountingHistory>>;
}): RekonTransactionDiffResult {
  type AccountingItem = Awaited<ReturnType<typeof getAccountingHistory>>[number];

  const coreGroupMap = new Map<string, CoreHistoryTrxItem[]>();
  const accountingGroupMap = new Map<string, AccountingItem[]>();

  function getCoreGroupKey(item: CoreHistoryTrxItem) {
    const dokumen = getCoreDokumen(item);
    const tgltrn = normalizeCompareDate(String(item.tgltrn ?? ""));
    return `${dokumen}::${tgltrn}`;
  }

  function getAccountingGroupKey(item: AccountingItem) {
    const rrn = cleanAccountingRrn(String(item.rrn ?? ""));
    const tglVal = normalizeCompareDate(String(item.tgl_val ?? ""));
    return `${rrn}::${tglVal}`;
  }

  for (const item of params.coreItems) {
    const key = getCoreGroupKey(item);
    if (key === "::") continue;

    const list = coreGroupMap.get(key) ?? [];
    list.push(item);
    coreGroupMap.set(key, list);
  }

  for (const item of params.accountingItems) {
    const key = getAccountingGroupKey(item);
    if (key === "::") continue;

    const list = accountingGroupMap.get(key) ?? [];
    list.push(item);
    accountingGroupMap.set(key, list);
  }

  const missingInAccounting: RekonTransactionDiffResult["missingInAccounting"] = [];
  const missingInCore: RekonTransactionDiffResult["missingInCore"] = [];
  const nominalMismatch: RekonTransactionDiffResult["nominalMismatch"] = [];

  const allKeys = new Set<string>([
    ...Array.from(coreGroupMap.keys()),
    ...Array.from(accountingGroupMap.keys()),
  ]);

  for (const key of allKeys) {
    const coreList = [...(coreGroupMap.get(key) ?? [])];
    const accountingList = [...(accountingGroupMap.get(key) ?? [])];

    if (coreList.length > 0 && accountingList.length === 0) {
      for (const coreItem of coreList) {
        const dokumen = getCoreDokumen(coreItem);

        missingInAccounting.push({
          tgl_trans: String(coreItem.tgltrn ?? ""),
          no_dok: dokumen,
          rrn: dokumen,
          keterangan: String(coreItem.keterangan ?? ""),
          nominal: toNumber(coreItem.nominal),
        });
      }

      continue;
    }

    if (coreList.length === 0 && accountingList.length > 0) {
      for (const accountingItem of accountingList) {
        missingInCore.push({
          tgl_trans: String(accountingItem.tgl_val ?? accountingItem.tgl_trans ?? ""),
          no_dok: String(accountingItem.nomor_dok ?? ""),
          rrn: String(accountingItem.rrn ?? ""),
          keterangan: String(accountingItem.keterangan ?? ""),
          nominal: toNumber(accountingItem.nominal),
        });
      }

      continue;
    }

    const matchedCoreIndexes = new Set<number>();
    const matchedAccountingIndexes = new Set<number>();

    // Step 1: match exact nominal dalam grup dokumen/RRN + tanggal.
    accountingList.forEach((accountingItem, accountingIndex) => {
      const accountingNominal = toNumber(accountingItem.nominal);

      const coreIndex = coreList.findIndex((coreItem, index) => {
        if (matchedCoreIndexes.has(index)) return false;
        return toNumber(coreItem.nominal) === accountingNominal;
      });

      if (coreIndex >= 0) {
        matchedCoreIndexes.add(coreIndex);
        matchedAccountingIndexes.add(accountingIndex);
      }
    });

    const unmatchedCore = coreList
      .map((item, index) => ({ item, index }))
      .filter(({ index }) => !matchedCoreIndexes.has(index));

    const unmatchedAccounting = accountingList
      .map((item, index) => ({ item, index }))
      .filter(({ index }) => !matchedAccountingIndexes.has(index));

    // Step 2: kalau masih ada pasangan dalam grup yang sama,
    // berarti dokumen/RRN dan tanggal cocok, tapi nominal berbeda.
    const pairCount = Math.min(unmatchedCore.length, unmatchedAccounting.length);

    for (let i = 0; i < pairCount; i += 1) {
      const coreItem = unmatchedCore[i].item;
      const accountingItem = unmatchedAccounting[i].item;
      const dokumen = getCoreDokumen(coreItem);

      const coreNominal = toNumber(coreItem.nominal);
      const accountingNominal = toNumber(accountingItem.nominal);

      nominalMismatch.push({
        tgl_trans: String(coreItem.tgltrn ?? ""),
        no_dok: dokumen,
        rrn: String(accountingItem.rrn ?? ""),
        keterangan_core: String(coreItem.keterangan ?? ""),
        keterangan_accounting: String(accountingItem.keterangan ?? ""),
        nominal_core: coreNominal,
        nominal_accounting: accountingNominal,
        selisih_nominal: accountingNominal - coreNominal,
      });
    }

    // Step 3: sisa core yang tidak punya pasangan accounting.
    for (let i = pairCount; i < unmatchedCore.length; i += 1) {
      const coreItem = unmatchedCore[i].item;
      const dokumen = getCoreDokumen(coreItem);

      missingInAccounting.push({
        tgl_trans: String(coreItem.tgltrn ?? ""),
        no_dok: dokumen,
        rrn: dokumen,
        keterangan: String(coreItem.keterangan ?? ""),
        nominal: toNumber(coreItem.nominal),
      });
    }

    // Step 4: sisa accounting yang tidak punya pasangan core.
    for (let i = pairCount; i < unmatchedAccounting.length; i += 1) {
      const accountingItem = unmatchedAccounting[i].item;

      missingInCore.push({
        tgl_trans: String(accountingItem.tgl_val ?? accountingItem.tgl_trans ?? ""),
        no_dok: String(accountingItem.nomor_dok ?? ""),
        rrn: String(accountingItem.rrn ?? ""),
        keterangan: String(accountingItem.keterangan ?? ""),
        nominal: toNumber(accountingItem.nominal),
      });
    }
  }

  return {
    missingInAccounting,
    missingInCore,
    nominalMismatch,
  };
}

function TransactionTable({
  title,
  subtitle,
  badge,
  rows,
}: {
  title: string;
  subtitle: string;
  badge: string;
  rows: RekonTransactionDiffResult["missingInAccounting"];
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

        <span className="inline-flex w-fit rounded-lg border border-amber-500 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          {badge}: {rows.length}
        </span>
      </div>

      <div className="grid grid-cols-[130px_180px_180px_1fr_150px] gap-2 text-sm font-semibold text-gray-600">
        <div>Tgl Trans</div>
        <div>No Dok</div>
        <div>RRN</div>
        <div>Keterangan</div>
        <div className="text-right">Nominal</div>
      </div>

      <div className="mt-2 space-y-2">
        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
            Tidak ada selisih transaksi.
          </div>
        ) : (
          rows.map((item, index) => (
            <div
              key={`${item.no_dok}-${item.rrn}-${index}`}
              className="grid grid-cols-[130px_180px_180px_1fr_150px] gap-2 rounded-lg border bg-gray-50 p-3 text-sm"
            >
              <div>{item.tgl_trans || "-"}</div>
              <div className="break-all">{item.no_dok || "-"}</div>
              <div className="break-all">{item.rrn || "-"}</div>
              <div>{item.keterangan || "-"}</div>
              <div className="text-right font-semibold">
                {formatCurrency(item.nominal)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function RekonsiliasiDetailPage({ row, bprId, onBack }: Props) {
  const [dateFrom, setDateFrom] = useState(getToday());
  const [dateTo, setDateTo] = useState(getToday());
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RekonTransactionDiffResult>({
  missingInAccounting: [],
  missingInCore: [],
  nominalMismatch: [],
});

  const handleSearch = async () => {
    if (!dateFrom || !dateTo) {
      window.alert("Range tanggal wajib diisi.");
      return;
    }

    if (!bprId) {
      window.alert("BPR ID tidak ditemukan.");
      return;
    }

    if (!row.source_code) {
      window.alert("Nomor rekening / GL tidak ditemukan.");
      return;
    }

    if (!row.sbb_code) {
      window.alert("No SBB accounting tidak ditemukan.");
      return;
    }

    try {
      setLoading(true);
      setSearched(false);

      const [coreItems, accountingItems] = await Promise.all([
        getCoreHistoryTrx({
          bprId,
          noRek: row.source_code,
          jnsRek: row.source_type === "GL" ? "1" : "2",
          tglAwal: toCoreDate(dateFrom),
          tglAkhir: toCoreDate(dateTo),
        }),
        getAccountingHistory({
          nosbb: row.sbb_code,
          dateFrom,
          dateTo,
        }),
      ]);

      const diff = buildTransactionDiff({
        coreItems,
        accountingItems,
      });

      setResult(diff);
      setSearched(true);
    } catch (error) {
      console.error(error);
      setResult({
  missingInAccounting: [],
  missingInCore: [],
  nominalMismatch: [],
});

      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memproses detail selisih transaksi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Detail Selisih Transaksi
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Mencocokkan history transaksi Core Banking dan Accounting
              berdasarkan dokumen/RRN serta tanggal transaksi.
            </p>
          </div>

          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 size-4" />
            Kembali
          </Button>
        </div>

        <div className="grid gap-3 rounded-xl border bg-gray-50 p-4 md:grid-cols-5">
          <div>
            <p className="text-xs text-gray-500">Rek / GL</p>
            <p className="font-semibold">{row.source_type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">No Rek / GL</p>
            <p className="font-semibold">{row.source_code || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">No SBB</p>
            <p className="font-semibold">{row.sbb_code || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Nama Rek / GL</p>
            <p className="font-semibold">{row.source_name || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Selisih</p>
            <p className="font-semibold text-red-600">
              {formatCurrency(row.selisih)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Tgl Trans Dari
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-11 rounded-md border px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Tgl Trans Sampai
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-11 rounded-md border px-3 text-sm"
            />
          </div>

          <Button onClick={handleSearch} disabled={loading} className="h-11 px-4">
            <Search className="mr-2 size-4" />
            {loading ? "Memproses..." : "Proses"}
          </Button>
        </div>
      </div>

      {searched ? (
        <>
          <TransactionTable
            title="Core Sebagai Main"
            subtitle="Transaksi yang ada di Core Banking tetapi tidak ditemukan di Accounting."
            badge="Tidak Ada di Accounting"
            rows={result.missingInAccounting}
          />

          <TransactionTable
            title="Accounting Sebagai Main"
            subtitle="Transaksi yang ada di Accounting tetapi tidak ditemukan di Core Banking."
            badge="Tidak Ada di Core"
            rows={result.missingInCore}
          />
        </>
      ) : (
        <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-sm text-gray-500">
          Pilih range tanggal lalu klik Proses untuk melihat detail selisih
          transaksi.
        </div>
      )}
    </div>
  );
}