"use client";

import { ArrowLeft, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { RekonsiliasiRow, RekonTransactionDiffResult } from "./types";
import { formatCurrency } from "./utils";

type Props = {
  row: RekonsiliasiRow;
  onBack: () => void;
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function buildDummyDiff(): RekonTransactionDiffResult {
  return {
    missingInAccounting: [
      {
        tgl_trans: "2026-05-01",
        no_dok: "CORE-TRX-0002",
        rrn: "RRN0002",
        keterangan: "Transfer Out Nasabah",
        nominal: 50000,
      },
      {
        tgl_trans: "2026-05-01",
        no_dok: "CORE-TRX-0007",
        rrn: "RRN0007",
        keterangan: "Biaya Admin Transfer",
        nominal: 12500,
      },
    ],
    missingInCore: [
      {
        tgl_trans: "2026-05-01",
        no_dok: "ACC-TRX-0006",
        rrn: "RRN0006",
        keterangan: "Journal Accounting Manual",
        nominal: 25000,
      },
    ],
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

      <div className="grid grid-cols-[130px_160px_160px_1fr_150px] gap-2 text-sm font-semibold text-gray-600">
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
              key={`${item.no_dok}-${index}`}
              className="grid grid-cols-[130px_160px_160px_1fr_150px] gap-2 rounded-lg border bg-gray-50 p-3 text-sm"
            >
              <div>{item.tgl_trans}</div>
              <div>{item.no_dok}</div>
              <div>{item.rrn}</div>
              <div>{item.keterangan}</div>
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

export default function RekonsiliasiDetailPage({ row, onBack }: Props) {
  const [dateFrom, setDateFrom] = useState(getToday());
  const [dateTo, setDateTo] = useState(getToday());
  const [searched, setSearched] = useState(false);

  const result = useMemo(() => buildDummyDiff(), []);

  const handleSearch = () => {
    if (!dateFrom || !dateTo) {
      window.alert("Range tanggal wajib diisi.");
      return;
    }

    setSearched(true);
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
              Inquiry dummy transaksi Core Banking vs Accounting berdasarkan range tanggal.
            </p>
          </div>

          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 size-4" />
            Kembali
          </Button>
        </div>

        <div className="grid gap-3 rounded-xl border bg-gray-50 p-4 md:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">Rek / GL</p>
            <p className="font-semibold">{row.source_type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Nama Rek / GL</p>
            <p className="font-semibold">{row.source_name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Saldo BPR</p>
            <p className="font-semibold">{formatCurrency(row.saldo_bpr)}</p>
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

          <Button onClick={handleSearch} className="h-11 px-4">
            <Search className="mr-2 size-4" />
            Proses
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
          Pilih range tanggal lalu klik Proses untuk melihat detail selisih transaksi.
        </div>
      )}
    </div>
  );
}