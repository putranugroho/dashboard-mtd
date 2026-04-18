"use client";

import { useEffect, useMemo, useState } from "react";

import JournalEditor from "./JournalEditor";
import JournalTcodeList from "./JournalTcodeList";
import { JournalDetail, JournalTcodeSummary } from "./types-new";
import {
  getJournalDetail,
  getJournalTcodes,
  saveJournalBulk,
} from "@/lib/api/journal";

export default function SetupJurnalPage() {
  const [query, setQuery] = useState("");
  const [tcodeList, setTcodeList] = useState<JournalTcodeSummary[]>([]);
  const [selectedTcode, setSelectedTcode] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<JournalDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadList = async () => {
    try {
      setLoadingList(true);
      const result = await getJournalTcodes();
      setTcodeList(result);

      if (result.length > 0 && !selectedTcode) {
        setSelectedTcode(result[0].tcode);
      }
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal memuat daftar jurnal"
      );
    } finally {
      setLoadingList(false);
    }
  };

  const loadDetail = async (tcode: string) => {
    try {
      setLoadingDetail(true);
      const result = await getJournalDetail(tcode);
      setSelectedDetail(result);
    } catch (error) {
      console.error(error);
      setSelectedDetail(null);
      window.alert(
        error instanceof Error ? error.message : "Gagal memuat detail jurnal"
      );
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  useEffect(() => {
    if (selectedTcode) {
      loadDetail(selectedTcode);
    }
  }, [selectedTcode]);

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

  const handleSelect = (item: JournalTcodeSummary) => {
    setSelectedTcode(item.tcode);
  };

  const handleSave = async (detail: JournalDetail) => {
    try {
      await saveJournalBulk({
        tcode: detail.tcode,
        journals: detail.journals,
      });

      await loadList();
      await loadDetail(detail.tcode);
      window.alert("Setup jurnal berhasil disimpan.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal menyimpan setup jurnal"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Setup Jurnal</h1>
        <p className="mt-1 text-sm text-gray-500">
          Kelola jurnal accounting per TCode, termasuk debit, kredit, dan source
          type transaksi.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        {loadingList ? (
          <div className="rounded-2xl border bg-white p-6 text-sm text-gray-500 shadow-sm">
            Memuat daftar TCode...
          </div>
        ) : (
          <JournalTcodeList
            data={filteredList}
            query={query}
            onQueryChange={setQuery}
            selectedTcode={selectedTcode}
            onSelect={handleSelect}
          />
        )}

        {loadingDetail ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
            Memuat detail jurnal...
          </div>
        ) : (
          <JournalEditor detail={selectedDetail} onSave={handleSave} />
        )}
      </div>
    </div>
  );
}