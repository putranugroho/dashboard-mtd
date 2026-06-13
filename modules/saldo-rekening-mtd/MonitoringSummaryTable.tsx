"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SaldoMTDMonitoringSummaryItem } from "./types";
import HorizontalDragScroll from "../shared/HorizontalDragScroll";

type Props = {
  data: SaldoMTDMonitoringSummaryItem[];
  loading?: boolean;
  canDetail?: boolean;
  canRefreshBpr?: boolean;
  refreshingBprId?: string;
  formatCurrency: (value: number) => string;
  formatDateTime: (value?: string | null) => string;
  onDetail: (item: SaldoMTDMonitoringSummaryItem) => void;
  onRefreshBpr: (item: SaldoMTDMonitoringSummaryItem) => void;
};

function statusVariant(status: string) {
  const normalized = status?.toUpperCase();

  if (normalized === "SUCCESS") return "default";
  if (normalized === "NO_DATA") return "secondary";

  return "outline";
}

export default function MonitoringSummaryTable({
  data,
  loading = false,
  canDetail = true,
  canRefreshBpr = false,
  refreshingBprId = "",
  formatCurrency,
  formatDateTime,
  onDetail,
  onRefreshBpr,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-gray-900">
          Daftar Saldo MTD Semua BPR
        </h2>
        <p className="text-sm text-gray-500">
          Data berasal dari snapshot middleware, bukan inquiry live ke gateway.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <HorizontalDragScroll>
          <table className="w-full min-w-[1150px] border-collapse text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">BPR</th>
                <th className="px-4 py-3 text-right">Saldo Rekening</th>
                <th className="px-4 py-3 text-right">Saldo GL</th>
                <th className="px-4 py-3 text-right">Total Saldo</th>
                <th className="px-4 py-3 text-center">Jumlah Data</th>
                <th className="px-4 py-3 text-left">Last Sync</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Memuat data snapshot...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Data snapshot belum tersedia.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.bpr_id} className="align-top hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {item.nama_bpr || "-"}
                      </div>
                      <div className="text-xs text-gray-500">{item.bpr_id}</div>
                    </td>

                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(Number(item.total_rekening || 0))}
                      <div className="text-xs text-gray-500">
                        {item.count_rekening} rekening
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(Number(item.total_gl || 0))}
                      <div className="text-xs text-gray-500">{item.count_gl} GL</div>
                    </td>

                    <td className="px-4 py-3 text-right font-semibold">
                      {formatCurrency(Number(item.total_all || 0))}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Badge variant="secondary">{item.count_all}</Badge>
                    </td>

                    <td className="px-4 py-3">
                      <div>{formatDateTime(item.last_sync_at)}</div>
                      {item.snapshot_date ? (
                        <div className="text-xs text-gray-500">
                          Snapshot: {item.snapshot_date}
                        </div>
                      ) : null}
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(item.sync_status)}>
                        {item.sync_status || "NO_DATA"}
                      </Badge>
                      {item.sync_message ? (
                        <div className="mt-1 max-w-[240px] truncate text-xs text-gray-500">
                          {item.sync_message}
                        </div>
                      ) : null}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!canRefreshBpr || refreshingBprId === item.bpr_id}
                          onClick={() => onRefreshBpr(item)}
                          title={!canRefreshBpr ? "Anda tidak memiliki akses refresh BPR." : undefined}
                        >
                          {refreshingBprId === item.bpr_id ? "Refreshing..." : "Refresh"}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!canDetail || item.count_all <= 0}
                          onClick={() => onDetail(item)}
                          title={
                            !canDetail
                              ? "Anda tidak memiliki akses detail."
                              : item.count_all <= 0
                                ? "Snapshot detail belum tersedia."
                                : undefined
                          }
                        >
                          Detail
                        </Button>
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
  );
}