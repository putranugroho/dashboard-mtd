"use client";

import { Badge } from "@/components/ui/badge";
import type { SaldoMTDSyncLogItem } from "@/lib/api/saldo-mtd";

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
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Sync Log</h2>
        <p className="text-sm text-gray-500">
          Riwayat proses refresh saldo MTD per BPR.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="max-h-[360px] overflow-auto">
          <table className="w-full min-w-[1100px] border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-500 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-left">Waktu</th>
                <th className="px-4 py-3 text-left">BPR</th>
                <th className="px-4 py-3 text-left">Trigger</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Total Data</th>
                <th className="px-4 py-3 text-right">Durasi</th>
                <th className="px-4 py-3 text-left">Message</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Memuat sync log...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Sync log belum tersedia.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="align-top">
                    <td className="px-4 py-3">
                      <div>{formatDateTime(item.started_at)}</div>
                      <div className="text-xs text-gray-500">
                        Finish: {formatDateTime(item.finished_at)}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {item.nama_bpr || "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.bpr_id || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant="outline">{item.trigger_type || "-"}</Badge>
                      <div className="mt-1 text-xs text-gray-500">
                        by {item.triggered_by || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant={badgeVariant(item.status)}>
                        {item.status || "-"}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="font-medium">{item.total_all || 0}</div>
                      <div className="text-xs text-gray-500">
                        Rek: {item.total_rekening || 0} · GL: {item.total_gl || 0}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right">
                      {Math.round((item.duration_ms || 0) / 1000)}s
                    </td>

                    <td className="px-4 py-3">
                      <div className="max-w-[320px] text-xs text-gray-600">
                        {item.message || "-"}
                      </div>
                      <div className="mt-1 max-w-[320px] truncate text-[11px] text-gray-400">
                        {item.run_id}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}