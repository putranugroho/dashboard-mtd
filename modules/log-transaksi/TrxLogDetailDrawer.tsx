"use client";

import { Download, RefreshCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrxLogDetailPayload, TrxLogItem, TrxLogTimelineItem } from "./types";
import TrxLogTimeline from "./TrxLogTimeline";

type Props = {
  open: boolean;
  item: TrxLogItem | null;
  detail: TrxLogDetailPayload | null;
  timeline: TrxLogTimelineItem[];
  loading?: boolean;
  syncing?: boolean;
  canSyncGateway?: boolean;
  formatCurrency: (value: number) => string;
  formatDateTime: (value?: string | null) => string;
  onClose: () => void;
  onSyncGateway: () => void;
};

function JsonViewer({ value }: { value: unknown }) {
  return (
    <pre className="max-h-[280px] overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
      {JSON.stringify(value ?? null, null, 2)}
    </pre>
  );
}

export default function TrxLogDetailDrawer({
  open,
  item,
  detail,
  timeline,
  loading = false,
  syncing = false,
  canSyncGateway = false,
  formatCurrency,
  formatDateTime,
  onClose,
  onSyncGateway,
}: Props) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <div className="absolute right-0 top-0 h-full w-full max-w-5xl overflow-y-auto bg-white shadow-xl">
        <div className="sticky top-0 z-10 border-b bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Detail Log Transaksi
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                RRN: {item.rrn} · {item.trx_category} · {item.final_status}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                disabled={!canSyncGateway || syncing}
                onClick={onSyncGateway}
                title={!canSyncGateway ? "Anda tidak memiliki akses sync gateway." : undefined}
              >
                <RefreshCcw className="mr-2 size-4" />
                {syncing ? "Syncing..." : "Sync Gateway Log"}
              </Button>

              <Button variant="outline" disabled>
                <Download className="mr-2 size-4" />
                Export Detail
              </Button>

              <Button variant="outline" size="icon" onClick={onClose}>
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border p-4">
              <p className="text-xs text-gray-500">BPR</p>
              <p className="mt-1 font-semibold">{item.nama_bpr || item.bpr_id || "-"}</p>
              <p className="text-xs text-gray-500">{item.bpr_id}</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-gray-500">Amount</p>
              <p className="mt-1 font-semibold">{formatCurrency(item.amount)}</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-gray-500">Status</p>
              <p className="mt-1 font-semibold">{item.final_status}</p>
              <p className="text-xs text-gray-500">{item.final_code || "-"}</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-gray-500">Waktu</p>
              <p className="mt-1 font-semibold">{formatDateTime(item.created_at)}</p>
              <p className="text-xs text-gray-500">TglTrans: {item.tgl_trans || "-"}</p>
            </div>
          </div>

          <TrxLogTimeline data={timeline} formatDateTime={formatDateTime} />

          <div className="grid gap-5 xl:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                Middleware Request Payload
              </h3>
              {loading ? (
                <div className="rounded-xl border p-4 text-sm text-gray-500">
                  Memuat payload...
                </div>
              ) : (
                <JsonViewer value={detail?.request_payload} />
              )}
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                Middleware Response Payload
              </h3>
              {loading ? (
                <div className="rounded-xl border p-4 text-sm text-gray-500">
                  Memuat payload...
                </div>
              ) : (
                <JsonViewer value={detail?.response_payload} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}