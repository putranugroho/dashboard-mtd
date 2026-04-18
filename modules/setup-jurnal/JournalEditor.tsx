"use client";

import { Plus, Save } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import JournalRowForm from "./JournalRowForm";
import SourceTypeBadge from "./SourceTypeBadge-new";
import {
  JournalDetail,
  JournalItem,
  JournalRowErrors,
} from "./types-new";

type Props = {
  detail: JournalDetail | null;
  onSave?: (detail: JournalDetail) => void;
};

function createEmptyJournal(nextIndex: number): JournalItem {
  return {
    id: Date.now() + nextIndex,
    journal_no: nextIndex,
    keterangan_jurnal: "",
    debit_source_type: 1,
    debit_keterangan: "",
    kredit_source_type: 1,
    kredit_keterangan: "",
    is_active: true,
  };
}

function normalizeJournals(journals: JournalItem[]): JournalItem[] {
  return journals.map((item, index) => ({
    ...item,
    journal_no: index,
  }));
}

function validateJournal(item: JournalItem): JournalRowErrors {
  const errors: JournalRowErrors = {};

  if (!item.keterangan_jurnal.trim()) {
    errors.keterangan_jurnal = "Keterangan jurnal wajib diisi.";
  }

  if (![1, 2, 3].includes(item.debit_source_type)) {
    errors.debit_source_type = "Source type debit wajib dipilih.";
  }

  if (!item.debit_keterangan.trim()) {
    errors.debit_keterangan = "Keterangan debit wajib diisi.";
  }

  if (![1, 2, 3].includes(item.kredit_source_type)) {
    errors.kredit_source_type = "Source type kredit wajib dipilih.";
  }

  if (!item.kredit_keterangan.trim()) {
    errors.kredit_keterangan = "Keterangan kredit wajib diisi.";
  }

  return errors;
}

export default function JournalEditor({ detail, onSave }: Props) {
  const [localDetail, setLocalDetail] = useState<JournalDetail | null>(detail);
  const [rowErrors, setRowErrors] = useState<Record<number, JournalRowErrors>>({});
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLocalDetail(
      detail
        ? {
            ...detail,
            journals: normalizeJournals(detail.journals ?? []),
          }
        : null
    );
    setRowErrors({});

    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [detail?.tcode]);

  const normalizedDetail = useMemo(() => {
    if (!localDetail) return null;

    return {
      ...localDetail,
      journals: normalizeJournals(localDetail.journals),
    };
  }, [localDetail]);

  const handleAddRow = () => {
    if (!normalizedDetail) return;

    const nextIndex = normalizedDetail.journals.length;

    setLocalDetail({
      ...normalizedDetail,
      journals: [...normalizedDetail.journals, createEmptyJournal(nextIndex)],
    });
  };

  const handleRowChange = (index: number, patch: Partial<JournalItem>) => {
    if (!normalizedDetail) return;

    const journals = [...normalizedDetail.journals];
    journals[index] = {
      ...journals[index],
      ...patch,
    };

    setLocalDetail({
      ...normalizedDetail,
      journals: normalizeJournals(journals),
    });

    setRowErrors((prev) => {
      const next = { ...prev };
      if (next[index]) {
        next[index] = validateJournal({
          ...journals[index],
          ...patch,
        } as JournalItem);

        if (Object.keys(next[index]).length === 0) {
          delete next[index];
        }
      }
      return next;
    });
  };

  const handleRemoveRow = (index: number) => {
    if (!normalizedDetail) return;
    if (index !== normalizedDetail.journals.length - 1) return;

    const journals = normalizedDetail.journals.filter((_, i) => i !== index);

    setLocalDetail({
      ...normalizedDetail,
      journals: normalizeJournals(journals),
    });

    setRowErrors((prev) => {
      const next: Record<number, JournalRowErrors> = {};
      normalizeJournals(journals).forEach((_, idx) => {
        if (prev[idx]) {
          next[idx] = prev[idx];
        }
      });
      return next;
    });
  };

  const handleSave = () => {
    if (!normalizedDetail) return;

    if (normalizedDetail.journals.length === 0) {
      window.alert("Minimal harus ada 1 jurnal sebelum disimpan.");
      return;
    }

    const validationMap: Record<number, JournalRowErrors> = {};
    normalizedDetail.journals.forEach((item, index) => {
      const errors = validateJournal(item);
      if (Object.keys(errors).length > 0) {
        validationMap[index] = errors;
      }
    });

    setRowErrors(validationMap);

    if (Object.keys(validationMap).length > 0) {
      window.alert(
        "Masih ada form jurnal yang belum lengkap. Silakan periksa kembali field yang ditandai."
      );
      return;
    }

    onSave?.({
      ...normalizedDetail,
      journals: normalizeJournals(normalizedDetail.journals),
    });
  };

  if (!normalizedDetail) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
        Pilih TCode di panel kiri untuk melihat detail setup jurnal.
      </div>
    );
  }

  return (
    <div ref={topRef} className="space-y-4">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge>{normalizedDetail.tcode}</Badge>
              <h2 className="text-lg font-semibold">
                {normalizedDetail.keterangan}
              </h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Atur jurnal accounting untuk transaksi {normalizedDetail.tcode}.
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
              {normalizedDetail.journals.length}
            </p>
          </div>

          <div className="rounded-xl border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Source Type Debit</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[...new Set(normalizedDetail.journals.map((j) => j.debit_source_type))].map(
                (value) => (
                  <SourceTypeBadge key={`debit-${value}`} value={value} />
                )
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Source Type Kredit</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[...new Set(normalizedDetail.journals.map((j) => j.kredit_source_type))].map(
                (value) => (
                  <SourceTypeBadge key={`kredit-${value}`} value={value} />
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {normalizedDetail.journals.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          Belum ada row jurnal untuk TCode ini.
        </div>
      ) : (
        normalizedDetail.journals.map((item, index) => (
          <JournalRowForm
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            canRemove={index === normalizedDetail.journals.length - 1}
            errors={rowErrors[index]}
            onChange={handleRowChange}
            onRemove={handleRemoveRow}
          />
        ))
      )}
    </div>
  );
}