"use client";

import { Badge } from "@/components/ui/badge";
import type { SaldoMTDSyncLogItem } from "@/lib/api/saldo-mtd";
import HorizontalDragScroll from "../shared/HorizontalDragScroll";

type Props = {
  data: SaldoMTDSyncLogItem[];
  loading?: boolean;
  formatDateTime: (value?: string | null) => string;
};

function badgeVariant(status: string) {
  const normalized = status?.toUpperCase();

  if (normalized === "SUCCESS") return "default";
  if (normalized === "FAILED") return "destructive";
  if (normalized === "RUNNING") return "secondary";

  return "outline";
}

export default function MonitoringSyncLogTable({
  data,
  loading = false,
  formatDateTime,
}: Props) {
  return (
    <div className="flex max-h-[320px] flex-col overflow-hidden rounded-2xl border bg-white p-3 shadow-sm">
      <div className="mb-2 shrink-0">
        <h2 className="text-sm font-semibold text-gray-900">Sync Log</h2>
        <p className="text-xs text-gray-500">
          Menampilkan {data.length} log terakhir refresh saldo MTD.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-xl border">
        <div className="h-full overflow-auto">
          <HorizontalDragScroll>
            <table className="w-full min-w-[980px] border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-gray-50 uppercase text-gray-500 shadow-sm">
              <tr>
                <th className="px-3 py-2 text-left">Waktu</th>
                <th className="px-3 py-2 text-left">BPR</th>
                <th className="px-3 py-2 text-left">Trigger</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-right">Data</th>
                <th className="px-3 py-2 text-right">Durasi</th>
                <th className="px-3 py-2 text-left">Message</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-gray-500">
                    Memuat sync log...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-gray-500">
                    Sync log belum tersedia.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="align-middle hover:bg-gray-50">
                    <td className="whitespace-nowrap px-3 py-2">
                      <div>{formatDateTime(item.started_at)}</div>
                      <div className="text-[10px] text-gray-400">
                        Finish: {formatDateTime(item.finished_at)}
                      </div>
                    </td>

                    <td className="px-3 py-2">
                      <div className="max-w-[190px] truncate font-medium text-gray-900">
                        {item.nama_bpr || "-"}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {item.bpr_id || "-"}
                      </div>
                    </td>

                    <td className="px-3 py-2">
                      <Badge variant="outline" className="text-[10px]">
                        {item.trigger_type || "-"}
                      </Badge>
                      <div className="mt-1 text-[10px] text-gray-400">
                        by {item.triggered_by || "-"}
                      </div>
                    </td>

                    <td className="px-3 py-2">
                      <Badge variant={badgeVariant(item.status)} className="text-[10px]">
                        {item.status || "-"}
                      </Badge>
                    </td>

                    <td className="px-3 py-2 text-right">
                      <div className="font-medium">{item.total_all || 0}</div>
                      <div className="text-[11px] text-gray-500">
                        R:{item.total_rekening || 0} · G:{item.total_gl || 0}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      {Math.round((item.duration_ms || 0) / 1000)}s
                    </td>

                    <td className="px-3 py-2">
                      <div className="max-w-[320px] truncate text-gray-600">
                        {item.message || "-"}
                      </div>
                      <div className="max-w-[320px] truncate text-[10px] text-gray-400">
                        {item.run_id}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </HorizontalDragScroll>
        </div>
      </div>
    </div>
  );
}