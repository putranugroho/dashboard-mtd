"use client";

import { Download, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  bprId: string;
  bprName: string;
  reconAt: string;
  loading: boolean;
  canDownload: boolean;
  onChangeBprId: (value: string) => void;
  onRekon: () => void;
  onDownload: () => void;
};

export default function RekonsiliasiSearchForm({
  bprId,
  bprName,
  reconAt,
  loading,
  canDownload,
  onChangeBprId,
  onRekon,
  onDownload,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[320px_1fr_auto_auto] md:items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">BPR ID</label>
          <Input
            value={bprId}
            onChange={(e) => onChangeBprId(e.target.value)}
            placeholder="Masukkan BPR ID"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Nama BPR</label>
          <Input value={bprName} readOnly placeholder="Nama BPR" />
        </div>

        <Button
          onClick={onRekon}
          disabled={loading}
          className="h-14 min-w-[110px] rounded-xl"
        >
          <RefreshCcw className="mr-2 size-4" />
          {loading ? "Memuat..." : "Rekon"}
        </Button>

        <Button
          onClick={onDownload}
          disabled={!canDownload || loading}
          variant="outline"
          className="h-14 min-w-[150px] rounded-xl"
        >
          <Download className="mr-2 size-4" />
          Download Excel
        </Button>
      </div>

      <div className="mt-4 text-sm font-semibold text-gray-700">
        Waktu Rekon : {reconAt || "-"}
      </div>
    </div>
  );
}