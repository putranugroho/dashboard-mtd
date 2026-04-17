"use client";

import { Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import JournalRowForm from "./JournalRowForm";
import SourceTypeBadge from "./SourceTypeBadge-new";
import { JournalDetail, JournalItem } from "./types-new";

type Props = {
  detail: JournalDetail | null;
  onSave?: (detail: JournalDetail) => void;
};

function createEmptyJournal(): JournalItem {
  return {
    id: Date.now(),
    journal_no: 0,
    keterangan_jurnal: "",
    debit_source_type: 1,
    debit_keterangan: "",
    kredit_source_type: 1,
    kredit_keterangan: "",
    is_active: true,
  };
}

export default function JournalEditor({ detail, onSave }: Props) {
  const [localDetail, setLocalDetail] = useState<JournalDetail | null>(detail);

  useEffect(() => {
    setLocalDetail(detail);
  }, [detail]);

  const handleAddRow = () => {
    if (!localDetail) return;

    const nextJournalNo =
      localDetail.journals.length > 0
        ? Math.max(...localDetail.journals.map((item) => item.journal_no)) + 1
        : 0;

    setLocalDetail({
      ...localDetail,
      journals: [
        ...localDetail.journals,
        {
          ...createEmptyJournal(),
          journal_no: nextJournalNo,
        },
      ],
    });
  };

  const handleRowChange = (index: number, patch: Partial<JournalItem>) => {
    if (!localDetail) return;

    const journals = [...localDetail.journals];
    journals[index] = {
      ...journals[index],
      ...patch,
    };

    setLocalDetail({
      ...localDetail,
      journals,
    });
  };

  const handleRemoveRow = (index: number) => {
    if (!localDetail) return;

    const journals = localDetail.journals.filter((_, i) => i !== index);
    setLocalDetail({
      ...localDetail,
      journals,
    });
  };

  const handleSave = () => {
    if (!localDetail) return;
    onSave?.(localDetail);
    window.alert("Setup jurnal berhasil disimpan (dummy mode).");
  };

  if (!localDetail) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
        Pilih TCode di panel kiri untuk melihat detail setup jurnal.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge>{localDetail.tcode}</Badge>
              <h2 className="text-lg font-semibold">{localDetail.keterangan}</h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Atur jurnal accounting untuk transaksi {localDetail.tcode}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={handleAddRow}>
              <Plus className="mr-1 size-4" />
              Tambah Jurnal
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-1 size-4" />
              Simpan Setup Jurnal
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Total Jurnal</p>
            <p className="mt-1 text-2xl font-semibold">
              {localDetail.journals.length}
            </p>
          </div>

          <div className="rounded-xl border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Source Type Debit</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[...new Set(localDetail.journals.map((j) => j.debit_source_type))].map(
                (value) => (
                  <SourceTypeBadge key={`debit-${value}`} value={value} />
                )
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Source Type Kredit</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[...new Set(localDetail.journals.map((j) => j.kredit_source_type))].map(
                (value) => (
                  <SourceTypeBadge key={`kredit-${value}`} value={value} />
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {localDetail.journals.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          Belum ada row jurnal untuk TCode ini.
        </div>
      ) : (
        localDetail.journals.map((item, index) => (
          <JournalRowForm
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            onChange={handleRowChange}
            onRemove={handleRemoveRow}
          />
        ))
      )}
    </div>
  );
}