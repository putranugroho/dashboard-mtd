"use client";

import { useEffect, useMemo, useState } from "react";

import BprSelect from "@/components/shared/BprSelect";
import {
  deleteAccountingJournal,
  getAccountingJournalDetail,
  getAccountingJournalTcodes,
  getAccountingSubtree,
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
} from "./types";

const DEFAULT_USERLOGIN =
  process.env.NEXT_PUBLIC_DEFAULT_USERLOGIN || "admin";
const DEFAULT_TERM = process.env.NEXT_PUBLIC_DEFAULT_TERM || "web";
const DEFAULT_KD_KANTOR =
  process.env.NEXT_PUBLIC_DEFAULT_KD_KANTOR || "0000";

export default function SetupJournalAccountingPage() {
  const [activeBprId, setActiveBprId] = useState("");
  const [activeBprName, setActiveBprName] = useState("");

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

  const loadList = async (bprId: string) => {
    try {
      setLoadingList(true);
      const result = await getAccountingJournalTcodes(bprId);
      setTcodeList(result);

      if (result.length > 0) {
        setSelectedTcode(result[0].tcode);
        setSelectedSummary(result[0]);
      } else {
        setSelectedTcode(null);
        setSelectedSummary(null);
        setSelectedDetail(null);
      }
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
    } finally {
      setLoadingList(false);
    }
  };

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
    summary: JournalAccountingTcodeSummary
  ) => {
    try {
      setLoadingDetail(true);
      const result = await getAccountingJournalDetail({
        tcode: summary.tcode,
        bprId,
        userlogin: DEFAULT_USERLOGIN,
        term: DEFAULT_TERM,
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

  useEffect(() => {
    loadCoa();
  }, []);

  useEffect(() => {
    if (!selectedTcode || !activeBprId) return;

    const found = tcodeList.find((item) => item.tcode === selectedTcode);
    if (found) {
      setSelectedSummary(found);
      loadDetail(activeBprId, found);
    }
  }, [selectedTcode, tcodeList, activeBprId]);

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
    if (!activeBprId) {
      window.alert("Silakan pilih BPR terlebih dahulu.");
      return;
    }

    try {
      await saveAccountingJournalBulk({
        tcode: detail.tcode,
        bprId: activeBprId,
        kdKantor: DEFAULT_KD_KANTOR,
        userlogin: DEFAULT_USERLOGIN,
        term: DEFAULT_TERM,
        journals: detail.journals,
        isExistingSetup: detail.accounting_ready,
      });

      await loadList(activeBprId);

      const refreshed =
        tcodeList.find((item) => item.tcode === detail.tcode) || selectedSummary;

      if (refreshed) {
        await loadDetail(activeBprId, {
          ...refreshed,
          accounting_ready: true,
        });
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
    if (!activeBprId) {
      window.alert("Silakan pilih BPR terlebih dahulu.");
      return;
    }

    try {
      await deleteAccountingJournal({
        tcode,
        bprId: activeBprId,
        kdKantor: DEFAULT_KD_KANTOR,
        userlogin: DEFAULT_USERLOGIN,
        term: DEFAULT_TERM,
      });

      await loadList(activeBprId);

      const refreshed =
        tcodeList.find((item) => item.tcode === tcode) || selectedSummary;

      if (refreshed) {
        await loadDetail(activeBprId, {
          ...refreshed,
          accounting_ready: false,
          accounting_journal_count: 0,
        });
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

        <div className="mt-5 grid gap-4 md:grid-cols-[360px_1fr] md:items-end">
          <BprSelect
            value={activeBprId}
            label="BPR"
            placeholder="Pilih BPR"
            disabled={loadingList || loadingDetail}
            onChange={handleSelectBpr}
          />
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
        />
      </div>
    </div>
  );
}