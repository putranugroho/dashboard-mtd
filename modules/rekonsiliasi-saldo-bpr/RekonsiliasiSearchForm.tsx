"use client";

import { Download, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import BprSelect from "@/components/shared/BprSelect";
import { ListBprItem } from "@/lib/api/bpr";

type Props = {
  bprId: string;
  bprName: string;
  reconAt: string;
  loading: boolean;
  canDownload: boolean;
  onChangeBprId: (value: string, item?: ListBprItem) => void;
  onRekon: () => void;
  onDownload: () => void;
};

export default function RekonsiliasiSearchForm({
  bprId,
  reconAt,
  loading,
  canDownload,
  onChangeBprId,
  onRekon,
  onDownload,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        
        <div className="w-full md:w-[360px]">
          <BprSelect
            value={bprId}
            disabled={loading}
            label="BPR"
            placeholder="Pilih BPR"
            onChange={onChangeBprId}
          />
        </div>

        <Button
          onClick={onRekon}
          disabled={loading || !bprId}
          className="h-11 px-4"
        >
          <RefreshCcw className="mr-2 size-4" />
          {loading ? "Memuat..." : "Rekon"}
        </Button>

        <Button
          onClick={onDownload}
          disabled={!canDownload || loading}
          variant="outline"
          className="h-11 px-4"
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