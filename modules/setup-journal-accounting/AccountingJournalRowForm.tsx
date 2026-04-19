"use client";

import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import AccountingCoaSelect from "./AccountingCoaSelect";
import {
  AccountingCoaOption,
  JournalAccountingItem,
  JournalAccountingRowErrors,
} from "./types";

type Props = {
  index: number;
  item: JournalAccountingItem;
  coaOptions: AccountingCoaOption[];
  onChange: (index: number, patch: Partial<JournalAccountingItem>) => void;
  onRemoveLast?: () => void;
  canRemove: boolean;
  errors?: JournalAccountingRowErrors;
};

function patchDebitFromOption(
  option: AccountingCoaOption | null
): Partial<JournalAccountingItem> {
  if (!option) {
    return {
      debit_source_type: "BB",
      debit_gol_acc: "",
      debit_nobb: "",
      debit_nama_bb: "",
      debit_nosbb: "",
      debit_nama_sbb: "",
      debit_type_posting: "",
      debit_akun_perantara: "",
      debit_hutang: "",
      debit_piutang: "",
    };
  }

  return {
    debit_source_type: "BB",
    debit_gol_acc: option.gol_acc,
    debit_nobb: option.nobb,
    debit_nama_bb: option.nama_bb,
    debit_nosbb: option.nosbb,
    debit_nama_sbb: option.nama_sbb,
    debit_type_posting: option.type_posting,
    debit_akun_perantara: option.akun_perantara,
    debit_hutang: option.hutang,
    debit_piutang: option.piutang,
  };
}

function patchKreditFromOption(
  option: AccountingCoaOption | null
): Partial<JournalAccountingItem> {
  if (!option) {
    return {
      kredit_source_type: "BB",
      kredit_gol_acc: "",
      kredit_nobb: "",
      kredit_nama_bb: "",
      kredit_nosbb: "",
      kredit_nama_sbb: "",
      kredit_type_posting: "",
      kredit_akun_perantara: "",
      kredit_hutang: "",
      kredit_piutang: "",
    };
  }

  return {
    kredit_source_type: "BB",
    kredit_gol_acc: option.gol_acc,
    kredit_nobb: option.nobb,
    kredit_nama_bb: option.nama_bb,
    kredit_nosbb: option.nosbb,
    kredit_nama_sbb: option.nama_sbb,
    kredit_type_posting: option.type_posting,
    kredit_akun_perantara: option.akun_perantara,
    kredit_hutang: option.hutang,
    kredit_piutang: option.piutang,
  };
}

export default function AccountingJournalRowForm({
  index,
  item,
  coaOptions,
  onChange,
  onRemoveLast,
  canRemove,
  errors,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Badge>Jurnal {item.journal_no}</Badge>
          <Badge
            className={
              item.status_journal
                ? "bg-green-100 text-green-700 hover:bg-green-100"
                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
            }
          >
            {item.status_journal ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Status</label>
          <Select
            value={item.status_journal ? "true" : "false"}
            onValueChange={(val) =>
              onChange(index, { status_journal: val === "true" })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {canRemove ? (
            <Button
              type="button"
              variant="outline"
              onClick={onRemoveLast}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Keterangan Journal
        </label>
        <Input
          value={item.keterangan_journal}
          onChange={(e) =>
            onChange(index, { keterangan_journal: e.target.value })
          }
          placeholder="Masukkan keterangan journal"
        />
        {errors?.keterangan_journal ? (
          <p className="text-xs text-red-600">{errors.keterangan_journal}</p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="space-y-4 rounded-2xl border bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Debit</h3>
            <Badge variant="outline">BB / SBB</Badge>
          </div>

          <AccountingCoaSelect
            valueNoBB={item.debit_nobb}
            valueNoSBB={item.debit_nosbb}
            options={coaOptions}
            onSelect={(option) => onChange(index, patchDebitFromOption(option))}
          />

          {errors?.debit_account ? (
            <p className="text-xs text-red-600">{errors.debit_account}</p>
          ) : null}
        </div>

        <div className="space-y-4 rounded-2xl border bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Kredit</h3>
            <Badge variant="outline">BB / SBB</Badge>
          </div>

          <AccountingCoaSelect
            valueNoBB={item.kredit_nobb}
            valueNoSBB={item.kredit_nosbb}
            options={coaOptions}
            onSelect={(option) => onChange(index, patchKreditFromOption(option))}
          />

          {errors?.kredit_account ? (
            <p className="text-xs text-red-600">{errors.kredit_account}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}