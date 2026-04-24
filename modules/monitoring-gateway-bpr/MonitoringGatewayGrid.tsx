"use client";

import { Monitor, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { GatewayMonitorItem } from "./types";
import { getGatewayStatusTone } from "./utils";

type Props = {
  items: GatewayMonitorItem[];
  loading: boolean;
};

function GatewayMonitorCard({ item }: { item: GatewayMonitorItem }) {
  const tone = getGatewayStatusTone(item.status);
  const isError = item.status === "ERROR";

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col items-center text-center">
        <div
          className={`relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 ${tone.icon}`}
        >
          <Monitor className="size-14 stroke-[1.8]" />

          {isError ? (
            <div className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-md">
              <X className="size-5" />
            </div>
          ) : null}
        </div>

        <div className="mt-4">
          <p className="text-base font-semibold text-gray-900">{item.nama_bpr}</p>
          <p className="mt-1 text-sm text-gray-500">ID: {item.bpr_id}</p>
        </div>

        <Badge className={`mt-3 border ${tone.badge}`}>{item.status}</Badge>

        <p className="mt-3 min-h-[40px] text-sm text-gray-600">{item.reason}</p>

        <div className="mt-3 w-full rounded-xl bg-gray-50 p-3 text-left">
          <p className="truncate text-xs text-gray-500">
            <span className="font-semibold">Gateway:</span> {item.gateway_url}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            <span className="font-semibold">Checked:</span> {item.checked_at}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MonitoringGatewayGrid({ items, loading }: Props) {
  if (!loading && items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
        Belum ada data monitoring gateway.
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <GatewayMonitorCard
          key={`${item.bpr_id}-${item.nama_bpr}`}
          item={item}
        />
      ))}
    </div>
  );
}