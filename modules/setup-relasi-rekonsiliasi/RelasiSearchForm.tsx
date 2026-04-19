"use client";

import { Search, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  bprId: string;
  bprName: string;
  loading: boolean;
  saving: boolean;
  canSave: boolean;
  onChangeBprId: (value: string) => void;
  onSearch: () => void;
  onSave: () => void;
};

export default function RelasiSearchForm({
  bprId,
  bprName,
  loading,
  saving,
  canSave,
  onChangeBprId,
  onSearch,
  onSave,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[220px_1fr_auto_auto] md:items-end">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">BPR ID</label>
          <Input
            value={bprId}
            onChange={(e) => onChangeBprId(e.target.value)}
            placeholder="Masukkan BPR ID"
            disabled={loading || saving}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Nama BPR</label>
          <Input value={bprName} readOnly placeholder="Akan tampil otomatis" />
        </div>

        <Button onClick={onSearch} disabled={loading || saving}>
          <Search className="mr-2 size-4" />
          {loading ? "Memuat..." : "Relasi"}
        </Button>

        <Button onClick={onSave} disabled={!canSave || saving || loading}>
          <Save className="mr-2 size-4" />
          {saving ? "Menyimpan..." : "Simpan Relasi"}
        </Button>
      </div>
    </div>
  );
}