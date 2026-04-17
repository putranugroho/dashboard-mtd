"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { sourceTypeOptions } from "./dummy";
import { JournalItem } from "./types-new";

type Props = {
  item: JournalItem;
  index: number;
  onChange: (index: number, patch: Partial<JournalItem>) => void;
  onRemove: (index: number) => void;
};

export default function JournalRowForm({
  item,
  index,
  onChange,
  onRemove,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Jurnal #{index + 1}
          </h3>
          <p className="text-xs text-gray-500">
            Atur debit, kredit, dan keterangan jurnal
          </p>
        </div>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="mr-1 size-4" />
          Hapus
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Journal No</Label>
          <Input
            type="number"
            min={0}
            value={item.journal_no}
            onChange={(e) =>
              onChange(index, {
                journal_no: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label>Status</Label>
          <div className="flex gap-2">
            <button
              type="button"
              className={`rounded-lg border px-3 py-2 text-sm ${
                item.is_active
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-600"
              }`}
              onClick={() => onChange(index, { is_active: true })}
            >
              Active
            </button>

            <button
              type="button"
              className={`rounded-lg border px-3 py-2 text-sm ${
                !item.is_active
                  ? "border-red-600 bg-red-50 text-red-700"
                  : "border-gray-200 text-gray-600"
              }`}
              onClick={() => onChange(index, { is_active: false })}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <Label>Keterangan Jurnal</Label>
        <Input
          value={item.keterangan_jurnal}
          onChange={(e) =>
            onChange(index, {
              keterangan_jurnal: e.target.value,
            })
          }
          placeholder="Contoh: Jurnal PPOB Utama"
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border bg-gray-50 p-4">
          <h4 className="mb-3 text-sm font-semibold">Debit</h4>

          <div className="grid gap-2">
            <Label>Source Type</Label>
            <Select
              value={String(item.debit_source_type)}
              onValueChange={(value) =>
                onChange(index, {
                  debit_source_type: Number(value),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih source debit" />
              </SelectTrigger>
              <SelectContent>
                {sourceTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 grid gap-2">
            <Label>Keterangan Debit</Label>
            <Textarea
              className="min-h-[110px]"
              value={item.debit_keterangan}
              onChange={(e) =>
                onChange(index, {
                  debit_keterangan: e.target.value,
                })
              }
              placeholder="Contoh: Menggunakan nomor rekening nasabah"
            />
          </div>
        </div>

        <div className="rounded-xl border bg-gray-50 p-4">
          <h4 className="mb-3 text-sm font-semibold">Kredit</h4>

          <div className="grid gap-2">
            <Label>Source Type</Label>
            <Select
              value={String(item.kredit_source_type)}
              onValueChange={(value) =>
                onChange(index, {
                  kredit_source_type: Number(value),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih source kredit" />
              </SelectTrigger>
              <SelectContent>
                {sourceTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 grid gap-2">
            <Label>Keterangan Kredit</Label>
            <Textarea
              className="min-h-[110px]"
              value={item.kredit_keterangan}
              onChange={(e) =>
                onChange(index, {
                  kredit_keterangan: e.target.value,
                })
              }
              placeholder="Contoh: Menggunakan nomor rekening MTD"
            />
          </div>
        </div>
      </div>
    </div>
  );
}