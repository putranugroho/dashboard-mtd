"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  bprId: string;
  loading?: boolean;
  onChange: (value: string) => void;
  onSearch: () => void;
};

export default function SaldoSearchForm({
  bprId,
  loading = false,
  onChange,
  onSearch,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Saldo Rekening MTD
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Inquiry saldo seluruh rekening dan GL berdasarkan BPR ID.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={bprId}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Masukkan BPR ID"
              className="pl-9"
            />
          </div>

          <Button onClick={onSearch} disabled={loading}>
            {loading ? "Memuat..." : "Cari"}
          </Button>
        </div>
      </div>
    </div>
  );
}