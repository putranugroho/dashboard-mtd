"use client";

import { CheckCircle2, CircleAlert, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TrxLogTimelineItem } from "./types";

type Props = {
  data: TrxLogTimelineItem[];
  formatDateTime: (value?: string | null) => string;
};

function iconForStatus(status: string) {
  const normalized = status?.toUpperCase();

  if (normalized === "SUCCESS") return <CheckCircle2 className="size-4 text-green-600" />;
  if (normalized === "FAILED") return <XCircle className="size-4 text-red-600" />;
  if (normalized === "TIMEOUT") return <CircleAlert className="size-4 text-orange-600" />;

  return <Clock className="size-4 text-gray-500" />;
}

function badgeVariant(status: string) {
  const normalized = status?.toUpperCase();

  if (normalized === "SUCCESS") return "default";
  if (normalized === "FAILED") return "destructive";
  if (normalized === "TIMEOUT") return "secondary";

  return "outline";
}

export default function TrxLogTimeline({ data, formatDateTime }: Props) {
  return (
    <div className="rounded-xl border bg-gray-50 p-4">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        Timeline Transaksi
      </h3>

      {data.length === 0 ? (
        <div className="rounded-lg bg-white p-4 text-sm text-gray-500">
          Timeline belum tersedia.
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.id} className="rounded-xl border bg-white p-4">
              <div className="flex gap-3">
                <div className="mt-0.5">{iconForStatus(item.status)}</div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{item.layer}</Badge>
                    <span className="font-medium text-gray-900">
                      {item.step_name}
                    </span>
                    <Badge variant={badgeVariant(item.status)}>
                      {item.status}
                    </Badge>
                  </div>

                  <p className="mt-1 text-sm text-gray-600">
                    {item.message || "-"}
                  </p>

                  <div className="mt-2 grid gap-2 text-xs text-gray-500 sm:grid-cols-2">
                    <div>Direction: {item.direction}</div>
                    <div>Code: {item.response_code || "-"}</div>
                    <div>Route: {item.route_path || "-"}</div>
                    <div>Durasi: {item.duration_ms || 0}ms</div>
                    <div>Waktu: {formatDateTime(item.created_at)}</div>
                    <div>Order: {item.event_order}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}