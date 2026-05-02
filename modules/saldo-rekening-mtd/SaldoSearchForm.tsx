"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import BprSelect from "@/components/shared/BprSelect";
import { ListBprItem } from "@/lib/api/bpr";

type Props = {
  bprId: string;
  loading?: boolean;
  onChange: (value: string, item?: ListBprItem) => void;
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
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Saldo Rekening MTD
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Inquiry saldo seluruh rekening dan GL berdasarkan BPR.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="w-full md:w-[360px]">
            <BprSelect
              value={bprId}
              disabled={loading}
              label="BPR"
              placeholder="Pilih BPR"
              onChange={onChange}
            />
          </div>

          <Button
            onClick={onSearch}
            disabled={loading || !bprId}
            className="h-11 px-4 md:w-auto"
          >
            <Search className="mr-2 size-4" />
            {loading ? "Memuat..." : "Cari"}
          </Button>
        </div>
      </div>
    </div>
  );
}