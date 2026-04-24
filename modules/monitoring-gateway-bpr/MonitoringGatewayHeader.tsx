"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  loading: boolean;
  lastChecked: string;
  onRefresh: () => void;
};

export default function MonitoringGatewayHeader({
  loading,
  lastChecked,
  onRefresh,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Monitoring Gateway BPR
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitoring status gateway masing-masing BPR berdasarkan endpoint echo.
          </p>
        </div>

        <Button onClick={onRefresh} disabled={loading} className="rounded-xl">
          <RefreshCcw className="mr-2 size-4" />
          {loading ? "Memuat..." : "Refresh"}
        </Button>
      </div>

      <div className="mt-4 text-sm font-medium text-gray-700">
        Last checked: {lastChecked || "-"}
      </div>
    </div>
  );
}