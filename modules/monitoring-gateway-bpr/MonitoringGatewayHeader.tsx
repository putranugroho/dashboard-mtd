"use client";

import { RefreshCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GatewayMonitorSortBy } from "./types";

type Props = {
  loading: boolean;
  lastChecked: string;
  query: string;
  sortBy: GatewayMonitorSortBy;
  onChangeQuery: (value: string) => void;
  onChangeSortBy: (value: GatewayMonitorSortBy) => void;
  onRefresh: () => void;
};

export default function MonitoringGatewayHeader({
  loading,
  lastChecked,
  query,
  sortBy,
  onChangeQuery,
  onChangeSortBy,
  onRefresh,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Monitoring Gateway BPR
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitoring status gateway masing-masing BPR berdasarkan endpoint echo.
          </p>
          <div className="mt-3 text-sm font-medium text-gray-700">
            Last checked: {lastChecked || "-"}
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 xl:w-auto xl:min-w-[680px]">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => onChangeQuery(e.target.value)}
                placeholder="Cari BPR ID / nama / gateway / status..."
                className="pl-9"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => onChangeSortBy(e.target.value as GatewayMonitorSortBy)}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="severity">Sort: Prioritas Status</option>
              <option value="nama_bpr">Sort: Nama BPR</option>
              <option value="bpr_id">Sort: BPR ID</option>
              <option value="status">Sort: Status</option>
              <option value="checked_at">Sort: Last Checked</option>
            </select>

            <Button onClick={onRefresh} disabled={loading} className="rounded-xl">
              <RefreshCcw className="mr-2 size-4" />
              {loading ? "Memuat..." : "Refresh"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}