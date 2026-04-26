"use client";

import { Eye, MonitorCheck, MonitorX } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GatewayMonitorItem } from "./types";
import { getGatewayStatusLabel, getGatewayStatusTone } from "./utils";

type Props = {
  problemItems: GatewayMonitorItem[];
  normalItems: GatewayMonitorItem[];
  loading: boolean;
  onOpenPIC: (item: GatewayMonitorItem) => void;
};

function StatusBadge({ item }: { item: GatewayMonitorItem }) {
  const tone = getGatewayStatusTone(item.status);

  return (
    <Badge variant="outline" className={`border ${tone.badge}`}>
      <span className={`mr-2 inline-block size-2 rounded-full ${tone.dot}`} />
      {getGatewayStatusLabel(item.status)}
    </Badge>
  );
}

function GatewayTable({
  title,
  description,
  items,
  type,
  onOpenPIC,
}: {
  title: string;
  description: string;
  items: GatewayMonitorItem[];
  type: "problem" | "normal";
  onOpenPIC: (item: GatewayMonitorItem) => void;
}) {
  const icon =
    type === "problem" ? (
      <MonitorX className="size-5 text-red-600" />
    ) : (
      <MonitorCheck className="size-5 text-green-600" />
    );

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-10 items-center justify-center rounded-xl bg-gray-50">
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>

        <div className="rounded-full border bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700">
          {items.length} BPR
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="w-[130px] px-4 py-3 font-semibold text-gray-700">
                BPR ID
              </th>
              <th className="w-[220px] px-4 py-3 font-semibold text-gray-700">
                Nama BPR
              </th>
              <th className="w-[160px] px-4 py-3 font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700">
                Keterangan
              </th>
              <th className="w-[260px] px-4 py-3 font-semibold text-gray-700">
                Gateway URL
              </th>
              <th className="w-[130px] px-4 py-3 text-center font-semibold text-gray-700">
                PIC
              </th>
            </tr>
          </thead>

          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const tone = getGatewayStatusTone(item.status);

                return (
                  <tr
                    key={`${item.bpr_id}-${item.nama_bpr}`}
                    className={`border-b last:border-b-0 ${tone.row}`}
                  >
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {item.bpr_id}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {item.nama_bpr}
                      </div>
                      <div className="text-xs text-gray-500">
                        Echo: {item.echo_success ? "success" : "failed"}
                        {item.core_status ? ` • Core: ${item.core_status}` : ""}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge item={item} />
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {item.reason}
                    </td>

                    <td className="max-w-[260px] px-4 py-3">
                      <div className="truncate text-gray-600" title={item.gateway_url}>
                        {item.gateway_url}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => onOpenPIC(item)}
                      >
                        <Eye className="mr-2 size-4" />
                        Detail PIC
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function MonitoringGatewayGrid({
  problemItems,
  normalItems,
  loading,
  onOpenPIC,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
        Memuat data monitoring gateway...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GatewayTable
        title="Gateway Bermasalah / Perlu Perhatian"
        description="BPR dengan status ERROR, OFFLINE, atau WARNING ditampilkan di bagian atas."
        items={problemItems}
        type="problem"
        onOpenPIC={onOpenPIC}
      />

      <GatewayTable
        title="Gateway Normal"
        description="BPR dengan endpoint echo berjalan normal."
        items={normalItems}
        type="normal"
        onOpenPIC={onOpenPIC}
      />
    </div>
  );
}