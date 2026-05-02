"use client";

import { Search, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import BprSelect from "@/components/shared/BprSelect";
import { ListBprItem } from "@/lib/api/bpr";

type Props = {
  bprId: string;
  bprName: string;
  loading: boolean;
  saving: boolean;
  canSave: boolean;
  onChangeBprId: (value: string, item?: ListBprItem) => void;
  onSearch: () => void;
  onSave: () => void;
};

export default function RelasiSearchForm({
  bprId,
  loading,
  saving,
  canSave,
  onChangeBprId,
  onSearch,
  onSave,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        
        <div className="w-[360px]">
          <BprSelect
            value={bprId}
            disabled={loading || saving}
            label="BPR"
            placeholder="Pilih BPR"
            onChange={onChangeBprId}
          />
        </div>

        <Button
          onClick={onSearch}
          disabled={loading || saving || !bprId}
          className="h-11 px-4"
        >
          <Search className="mr-2 size-4" />
          {loading ? "Memuat..." : "Relasi"}
        </Button>

        <Button
          onClick={onSave}
          disabled={!canSave || saving || loading}
          className="h-11 px-4"
        >
          <Save className="mr-2 size-4" />
          {saving ? "Menyimpan..." : "Simpan Relasi"}
        </Button>

      </div>
    </div>
  );
}