"use client";

import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { createEmptyAccountingJournalItem } from "./dummy";
import AccountingJournalRowForm from "./AccountingJournalRowForm";
import { validateAccountingJournalDetail } from "./validator";
import {
  AccountingCoaOption,
  JournalAccountingDetail,
  JournalAccountingItem,
  JournalAccountingRowErrors,
} from "./types";

type Props = {
  detail: JournalAccountingDetail | null;
  coaOptions: AccountingCoaOption[];
  loading: boolean;
  onChange?: (next: JournalAccountingDetail) => void;
  onSave?: (detail: JournalAccountingDetail) => Promise<void>;
  onDelete?: (tcode: string) => Promise<void>;
};

function normalizeJournals(
  journals: JournalAccountingItem[]
): JournalAccountingItem[] {
  return journals.map((item, index) => ({
    ...item,
    journal_no: index + 1,
  }));
}

function normalizeJournalCoaValues(
  journals: JournalAccountingItem[],
  coaOptions: AccountingCoaOption[]
): JournalAccountingItem[] {
  return journals.map((item) => {
    const debitOption = coaOptions.find(
      (option) => option.nosbb === item.debit_nosbb
    );

    const kreditOption = coaOptions.find(
      (option) => option.nosbb === item.kredit_nosbb
    );

    return {
      ...item,

      debit_nobb: debitOption?.nobb || item.debit_nobb,
      debit_nama_bb: debitOption?.nama_bb || item.debit_nama_bb,
      debit_gol_acc: debitOption?.gol_acc || item.debit_gol_acc,

      kredit_nobb: kreditOption?.nobb || item.kredit_nobb,
      kredit_nama_bb: kreditOption?.nama_bb || item.kredit_nama_bb,
      kredit_gol_acc: kreditOption?.gol_acc || item.kredit_gol_acc,
    };
  });
}

export default function AccountingJournalEditor({
  detail,
  coaOptions,
  loading,
  onChange,
  onSave,
  onDelete,
}: Props) {
  const [localDetail, setLocalDetail] = useState<JournalAccountingDetail | null>(
    detail
  );
  const [rowErrors, setRowErrors] = useState<
    Record<number, JournalAccountingRowErrors>
  >({});
  const [submitting, setSubmitting] = useState(false);

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
  }, [detail?.tcode]);

  const normalizedDetail = useMemo(() => {
    if (!localDetail) return null;

    return {
      ...localDetail,
      journals: normalizeJournals(
        normalizeJournalCoaValues(localDetail.journals, coaOptions)
      ),
    };
  }, [localDetail, coaOptions]);

  const updateDetail = (next: JournalAccountingDetail) => {
    setLocalDetail(next);
    onChange?.(next);
  };

  const handleAddRow = () => {
    if (!normalizedDetail) return;

    const nextNo = normalizedDetail.journals.length + 1;
    updateDetail({
      ...normalizedDetail,
      journals: [...normalizedDetail.journals, createEmptyAccountingJournalItem(nextNo)],
    });
  };

  const handleRowChange = (index: number, patch: Partial<JournalAccountingItem>) => {
    if (!normalizedDetail) return;

    const journals = [...normalizedDetail.journals];
    journals[index] = {
      ...journals[index],
      ...patch,
    };

    updateDetail({
      ...normalizedDetail,
      journals: normalizeJournals(journals),
    });

    setRowErrors((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const handleRemoveLastRow = (index: number) => {
    if (!normalizedDetail) return;
    if (normalizedDetail.journals.length <= 1) return;
    if (index !== normalizedDetail.journals.length - 1) return;

    const journals = normalizedDetail.journals.slice(0, -1);
    updateDetail({
      ...normalizedDetail,
      journals: normalizeJournals(journals),
    });
  };

  const handleSave = async () => {
    if (!normalizedDetail) return;

    if (normalizedDetail.journals.length === 0) {
      window.alert("Minimal harus ada 1 journal sebelum disimpan.");
      return;
    }

    const validationMap = validateAccountingJournalDetail(normalizedDetail);
    setRowErrors(validationMap);

    if (Object.keys(validationMap).length > 0) {
      window.alert("Masih ada form journal accounting yang belum lengkap.");
      return;
    }

    try {
      setSubmitting(true);
      await onSave?.(normalizedDetail);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!normalizedDetail) return;
    if (!window.confirm(`Hapus setup accounting untuk TCode ${normalizedDetail.tcode}?`)) {
      return;
    }

    try {
      setSubmitting(true);
      await onDelete?.(normalizedDetail.tcode);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
        Memuat detail journal accounting...
      </div>
    );
  }

  if (!normalizedDetail) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
        Pilih TCode di panel kiri untuk melihat detail setup journal accounting.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{normalizedDetail.tcode}</Badge>
              <h2 className="text-lg font-semibold text-gray-900">
                {normalizedDetail.keterangan}
              </h2>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Atur journal accounting untuk transaksi {normalizedDetail.tcode}.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {normalizedDetail.journals.length} journal
            </Badge>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={handleAddRow}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Journal
          </Button>

          <Button type="button" onClick={handleSave} disabled={submitting}>
            <Save className="mr-2 h-4 w-4" />
            Simpan Setup Journal
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={submitting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus Setup
          </Button>
        </div>
      </div>

      {normalizedDetail.journals.map((item, index) => (
        <AccountingJournalRowForm
          key={`${normalizedDetail.tcode}-${item.journal_no}`}
          index={index}
          item={item}
          coaOptions={coaOptions}
          onChange={handleRowChange}
          canRemove={index === normalizedDetail.journals.length - 1 && normalizedDetail.journals.length > 1}
          onRemoveLast={() => handleRemoveLastRow(index)}
          errors={rowErrors[index]}
        />
      ))}
    </div>
  );
}