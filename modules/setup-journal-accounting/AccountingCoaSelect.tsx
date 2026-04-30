"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getSbbByBB, getUniqueBB } from "./coa-utils";
import { AccountingCoaOption } from "./types";

type Props = {
  valueNoBB: string;
  valueNoSBB: string;
  options: AccountingCoaOption[];
  onSelect: (option: AccountingCoaOption | null) => void;
  disabled?: boolean;
};

export default function AccountingCoaSelect({
  valueNoBB,
  valueNoSBB,
  options,
  onSelect,
  disabled,
}: Props) {
  const bbOptions = getUniqueBB(options);

  const selectedOptionBySBB = options.find(
    (item) => item.nosbb === valueNoSBB
  );

  const effectiveNoBB =
    valueNoBB && bbOptions.some((item) => item.nobb === valueNoBB)
      ? valueNoBB
      : selectedOptionBySBB?.nobb || "";

  const sbbOptions = effectiveNoBB ? getSbbByBB(options, effectiveNoBB) : [];

  const selectedBB = bbOptions.find((item) => item.nobb === effectiveNoBB);
  const selectedSBB = sbbOptions.find((item) => item.nosbb === valueNoSBB);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Buku Besar
        </label>

        <Select
          value={effectiveNoBB || undefined}
          onValueChange={(nextBB) => {
            const firstSbb = getSbbByBB(options, nextBB)[0];
            onSelect(firstSbb ?? null);
          }}
          disabled={disabled}
        >
          <SelectTrigger className="h-11 text-sm">
            <SelectValue placeholder="Pilih Buku Besar" />
          </SelectTrigger>
          <SelectContent>
            {bbOptions.map((item) => (
              <SelectItem key={item.nobb} value={item.nobb}>
                {item.nama_bb}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-sm text-gray-600">
          No. BB:{" "}
          <span className="font-semibold text-gray-800">
            {selectedBB?.nosbb_bb || "-"}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Sub Buku Besar
        </label>

        <Select
          value={valueNoSBB || undefined}
          onValueChange={(nextSbb) => {
            const selected = sbbOptions.find((item) => item.nosbb === nextSbb);
            onSelect(selected ?? null);
          }}
          disabled={disabled || !effectiveNoBB}
        >
          <SelectTrigger className="h-11 text-sm">
            <SelectValue placeholder="Pilih Sub Buku Besar" />
          </SelectTrigger>
          <SelectContent>
            {sbbOptions.map((item) => (
              <SelectItem key={item.nosbb} value={item.nosbb}>
                {item.nama_sbb}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-sm text-gray-600">
          No. SBB:{" "}
          <span className="font-semibold text-gray-800">
            {selectedSBB?.nosbb || "-"}
          </span>
        </div>
      </div>
    </div>
  );
}