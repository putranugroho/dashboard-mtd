"use client";

import { useEffect, useMemo, useState } from "react";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BprSelect from "@/components/shared/BprSelect";
import {
  deleteAccountingJournal,
  getAccountingJournalCountsByPaymentGateway,
  getAccountingJournalDetail,
  getAccountingJournalTcodes,
  getAccountingSubtree,
  getMasterPaymentGateways,
  saveAccountingJournalBulk,
} from "@/lib/api/journal-accounting";
import { ListBprItem } from "@/lib/api/bpr";

import AccountingJournalEditor from "./AccountingJournalEditor";
import AccountingJournalTcodeList from "./AccountingJournalTcodeList";
import { flattenAccountingSubtree } from "./coa-utils";
import {
  AccountingCoaOption,
  JournalAccountingDetail,
  JournalAccountingTcodeSummary,
  MasterPaymentGatewayItem,
} from "./types";

const DEFAULT_USERLOGIN =
  process.env.NEXT_PUBLIC_DEFAULT_USERLOGIN || "admin";
const DEFAULT_TERM = process.env.NEXT_PUBLIC_DEFAULT_TERM || "web";
const DEFAULT_KD_KANTOR =
  process.env.NEXT_PUBLIC_DEFAULT_KD_KANTOR || "0000";

export default function SetupJournalAccountingPage() {
  const [activeBprId, setActiveBprId] = useState("");
  const [activeBprName, setActiveBprName] = useState("");
  const [paymentGateways, setPaymentGateways] = useState<MasterPaymentGatewayItem[]>([]);
  const [selectedPaymentGatewayCode, setSelectedPaymentGatewayCode] = useState("MOTION_PAY");
  const [loadingPaymentGateway, setLoadingPaymentGateway] = useState(false);

  const [query, setQuery] = useState("");
  const [tcodeList, setTcodeList] = useState<JournalAccountingTcodeSummary[]>([]);
  const [selectedTcode, setSelectedTcode] = useState<string | null>(null);
  const [selectedSummary, setSelectedSummary] =
    useState<JournalAccountingTcodeSummary | null>(null);
  const [selectedDetail, setSelectedDetail] =
    useState<JournalAccountingDetail | null>(null);
  const [coaOptions, setCoaOptions] = useState<AccountingCoaOption[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const { can } = useSession();
  const canSave = can(PERMISSIONS.SETUP_JOURNAL_ACCOUNTING_SAVE);
  const canDelete = can(PERMISSIONS.SETUP_JOURNAL_ACCOUNTING_DELETE);

  const loadList = async (bprId: string) => {
    try {
      setLoadingList(true);

      const rawResult = await getAccountingJournalTcodes(bprId);
      const result = await applyPgCountsToList(
        bprId,
        selectedPaymentGatewayCode,
        rawResult
      );

      setTcodeList(result);

      if (result.length > 0) {
        setSelectedTcode((prev) => prev || result[0].tcode);

        const selected =
          result.find((item) => item.tcode === selectedTcode) || result[0];

        setSelectedSummary(selected);
        return result;
      }

      setSelectedTcode(null);
      setSelectedSummary(null);
      setSelectedDetail(null);
      return [];
    } catch (error) {
      console.error(error);
      setTcodeList([]);
      setSelectedTcode(null);
      setSelectedSummary(null);
      setSelectedDetail(null);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat daftar setup journal accounting"
      );
      return [];
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (!activeBprId || !selectedPaymentGatewayCode) return;

    loadList(activeBprId);
  }, [selectedPaymentGatewayCode]);

  const loadCoa = async () => {
    try {
      const tree = await getAccountingSubtree();
      const options = flattenAccountingSubtree(tree);
      setCoaOptions(options);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat data chart of account"
      );
    }
  };

  const loadDetail = async (
    bprId: string,
    summary: JournalAccountingTcodeSummary,
    paymentGatewayCode: string
  ) => {
    try {
      setLoadingDetail(true);
      const result = await getAccountingJournalDetail({
        tcode: summary.tcode,
        bprId,
        userlogin: DEFAULT_USERLOGIN,
        term: DEFAULT_TERM,
        paymentGatewayCode,
        keterangan: summary.keterangan,
        journalReady: summary.journal_ready,
        accountingReady: summary.accounting_ready,
      });
      setSelectedDetail(result);
    } catch (error) {
      console.error(error);
      setSelectedDetail(null);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat detail setup journal accounting"
      );
    } finally {
      setLoadingDetail(false);
    }
  };

  const loadPaymentGateways = async () => {
    try {
      setLoadingPaymentGateway(true);

      const result = await getMasterPaymentGateways();
      setPaymentGateways(result);

      if (result.length > 0) {
        setSelectedPaymentGatewayCode((prev) => {
          if (prev && result.some((item) => item.kode === prev)) return prev;
          return result[0].kode;
        });
      }
    } catch (error) {
      console.error(error);
      setPaymentGateways([]);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat master payment gateway"
      );
    } finally {
      setLoadingPaymentGateway(false);
    }
  };

  useEffect(() => {
    loadCoa();
    loadPaymentGateways();
  }, []);

  useEffect(() => {
    if (!selectedTcode || !activeBprId || !selectedPaymentGatewayCode) return;

    const found = tcodeList.find((item) => item.tcode === selectedTcode);
    if (found) {
      setSelectedSummary(found);
      loadDetail(activeBprId, found, selectedPaymentGatewayCode);
    }
  }, [selectedTcode, tcodeList, activeBprId, selectedPaymentGatewayCode]);

  const filteredList = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return tcodeList;

    return tcodeList.filter((item) => {
      return (
        item.tcode.toLowerCase().includes(keyword) ||
        item.keterangan.toLowerCase().includes(keyword)
      );
    });
  }, [query, tcodeList]);

  const handleSelectBpr = async (bprId: string, item?: ListBprItem) => {
    setActiveBprId(bprId);
    setActiveBprName(item?.nama_bpr || "");
    setQuery("");
    setTcodeList([]);
    setSelectedTcode(null);
    setSelectedSummary(null);
    setSelectedDetail(null);

    if (!bprId) {
      return;
    }

    await loadList(bprId);
  };

  const handleSelect = (item: JournalAccountingTcodeSummary) => {
    setSelectedTcode(item.tcode);
    setSelectedSummary(item);
  };

  const handleSave = async (detail: JournalAccountingDetail) => {
    if (!canSave) {
      window.alert("Anda tidak memiliki akses menyimpan journal accounting.");
      return;
    }

    if (!activeBprId) {
      window.alert("Silakan pilih BPR terlebih dahulu.");
      return;
    }

    if (!selectedPaymentGatewayCode) {
      window.alert("Silakan pilih payment gateway terlebih dahulu.");
      return;
    }

    try {
      await saveAccountingJournalBulk({
        tcode: detail.tcode,
        bprId: activeBprId,
        kdKantor: DEFAULT_KD_KANTOR,
        userlogin: DEFAULT_USERLOGIN,
        term: DEFAULT_TERM,
        paymentGatewayCode: selectedPaymentGatewayCode,
        journals: detail.journals,
        isExistingSetup: true,
      });

      const latestList = await loadList(activeBprId);
      const refreshed =
        latestList.find((item) => item.tcode === detail.tcode) ||
        selectedSummary;

      if (refreshed) {
        await loadDetail(
          activeBprId,
          refreshed,
          selectedPaymentGatewayCode
        );
      }

      window.alert("Setup journal accounting berhasil disimpan.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan setup journal accounting"
      );
    }
  };

  const handleDelete = async (tcode: string) => {
    if (!canDelete) {
      window.alert("Anda tidak memiliki akses hapus journal accounting.");
      return;
    }

    if (!activeBprId) {
      window.alert("Silakan pilih BPR terlebih dahulu.");
      return;
    }

    if (!selectedPaymentGatewayCode) {
      window.alert("Silakan pilih payment gateway terlebih dahulu.");
      return;
    }

    try {
      await deleteAccountingJournal({
        tcode,
        bprId: activeBprId,
        kdKantor: DEFAULT_KD_KANTOR,
        userlogin: DEFAULT_USERLOGIN,
        term: DEFAULT_TERM,
        paymentGatewayCode: selectedPaymentGatewayCode,
      });

      const latestList = await loadList(activeBprId);
      const refreshed =
        latestList.find((item) => item.tcode === tcode) ||
        selectedSummary;

      if (refreshed) {
        await loadDetail(
          activeBprId,
          {
            ...refreshed,
            accounting_ready: false,
            accounting_journal_count: 0,
          },
          selectedPaymentGatewayCode
        );
      } else {
        setSelectedDetail(null);
      }

      window.alert("Setup journal accounting berhasil dihapus.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus setup journal accounting"
      );
    }
  };

  const applyPgCountsToList = async (
    bprId: string,
    paymentGatewayCode: string,
    sourceList: JournalAccountingTcodeSummary[]
  ) => {
    if (!bprId || !paymentGatewayCode || sourceList.length === 0) {
      return sourceList;
    }

    const countMap = await getAccountingJournalCountsByPaymentGateway({
      bprId,
      userlogin: DEFAULT_USERLOGIN,
      term: DEFAULT_TERM,
      paymentGatewayCode,
      tcodes: sourceList,
    });

    return sourceList.map((item) => {
      const count = countMap[item.tcode] ?? 0;

      return {
        ...item,
        accounting_journal_count: count,
        accounting_ready: count > 0,
        journal_ready: count > 0,
      };
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          Setup Journal Accounting
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Kelola setup journal accounting per TCode dengan pilihan Buku Besar dan
          Sub Buku Besar.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-[360px_360px_1fr] md:items-end">
          <div className="space-y-2">
            <BprSelect
              value={activeBprId}
              label="BPR"
              placeholder="Pilih BPR"
              disabled={loadingList || loadingDetail}
              onChange={handleSelectBpr}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Payment Gateway
            </label>

            <select
              value={selectedPaymentGatewayCode}
              disabled={
                loadingPaymentGateway ||
                loadingList ||
                loadingDetail ||
                paymentGateways.length === 0
              }
              onChange={(event) => {
                setSelectedPaymentGatewayCode(event.target.value);
                setSelectedDetail(null);
              }}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-900/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
            >
              {paymentGateways.length === 0 ? (
                <option value="">Tidak ada payment gateway</option>
              ) : null}

              {paymentGateways.map((item) => (
                <option key={item.kode} value={item.kode}>
                  {item.nama} ({item.kode})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        {loadingList ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500 shadow-sm">
            Memuat daftar TCode...
          </div>
        ) : (
          <AccountingJournalTcodeList
            data={filteredList}
            query={query}
            onQueryChange={setQuery}
            selectedTcode={selectedTcode}
            onSelect={handleSelect}
          />
        )}

        <AccountingJournalEditor
          detail={selectedDetail}
          coaOptions={coaOptions}
          loading={loadingDetail}
          onChange={setSelectedDetail}
          onSave={handleSave}
          onDelete={handleDelete}
          canSave={canSave}
          canDelete={canDelete}
        />
      </div>
    </div>
  );
}