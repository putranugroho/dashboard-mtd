"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RelasiRow, SBBOption } from "./types";

type Props = {
  rows: RelasiRow[];
  options: SBBOption[];
  loading: boolean;
  onSelectSBB: (index: number, option: SBBOption | null) => void;
};

function SBBSelect({
  value,
  options,
  disabled,
  onChange,
}: {
  value: string;
  options: SBBOption[];
  disabled?: boolean;
  onChange: (option: SBBOption | null) => void;
}) {
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => options.find((item) => item.sbb_code === value),
    [options, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          disabled={disabled}
          className="h-10 w-full justify-between text-left font-normal"
        >
          <span className="truncate">
            {selected ? selected.label : "Pilih BB -> SBB"}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[420px] p-0">
        <Command>
          <CommandInput placeholder="Cari BB / SBB..." />
          <CommandList>
            <CommandEmpty>Tidak ada data.</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.sbb_code}
                value={`${option.bb_name} ${option.sbb_name} ${option.sbb_code}`}
                onSelect={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-medium">{option.label}</span>
                  <span className="text-xs text-gray-500">
                    {option.sbb_code}
                  </span>
                </div>
                {selected?.sbb_code === option.sbb_code && (
                  <Check className="ml-2 size-4" />
                )}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function RelasiTable({
  rows,
  options,
  loading,
  onSelectSBB,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Setup Relasi Rekonsiliasi
        </h2>
        <p className="text-sm text-gray-500">
          Pilih relasi target accounting dengan format tampilan BB -&gt; SBB.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Jenis</TableHead>
            <TableHead className="text-center">Kode</TableHead>
            <TableHead className="text-center">Nama Rekening / GL</TableHead>
            <TableHead className="text-center">Relasi BB -&gt; SBB</TableHead>
            <TableHead className="text-center">Kode SBB</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!loading && rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-gray-500">
                Belum ada data. Masukkan BPR ID lalu klik Relasi.
              </TableCell>
            </TableRow>
          ) : null}

          {rows.map((row, index) => (
            <TableRow key={`${row.source_type}-${row.source_code}`}>
              <TableCell className="text-center">
                <Badge variant={row.source_type === "GL" ? "secondary" : "default"}>
                  {row.source_type}
                </Badge>
              </TableCell>

              <TableCell className="text-center font-medium">
                {row.source_code}
              </TableCell>

              <TableCell className="max-w-[280px] whitespace-normal">
                {row.source_name}
              </TableCell>

              <TableCell className="min-w-[320px]">
                <div className="flex items-center gap-2">
                  <SBBSelect
                    value={row.selected_sbb_code}
                    options={options}
                    disabled={loading}
                    onChange={(option) => onSelectSBB(index, option)}
                  />

                  {row.selected_sbb_code ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectSBB(index, null)}
                    >
                      <X className="size-4" />
                    </Button>
                  ) : null}
                </div>
              </TableCell>

              <TableCell className="text-center">
                {row.selected_sbb_code || "-"}
              </TableCell>

              <TableCell className="text-center">
                {row.selected_sbb_code ? (
                  <Badge variant="default">Sudah Relasi</Badge>
                ) : (
                  <Badge variant="outline">Belum Relasi</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}