"use client";

import { Badge } from "@/components/ui/badge";
import type { SaldoMTDMonitoringGlobalSummary } from "./types";

type Props = {
  summary: SaldoMTDMonitoringGlobalSummary;
  formatCurrency: (value: number) => string;
  formatDateTime: (value?: string | null) => string;
};

export default function MonitoringSummaryCards({
  summary,
  formatCurrency,
  formatDateTime,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Total Saldo Semua BPR</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {formatCurrency(summary.totalAll)}
        </p>
        <div className="mt-3">
          <Badge variant="secondary">{summary.countAll} item saldo</Badge>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Saldo Rekening</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {formatCurrency(summary.totalRekening)}
        </p>
        <div className="mt-3">
          <Badge>{summary.countRekening} rekening</Badge>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Saldo GL</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {formatCurrency(summary.totalGL)}
        </p>
        <div className="mt-3">
          <Badge variant="outline">{summary.countGL} GL</Badge>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Status Snapshot</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {summary.totalBprWithData}/{summary.totalBpr}
        </p>
        <div className="mt-3 text-xs text-gray-500">
          Last sync: {formatDateTime(summary.latestSyncAt)}
        </div>
      </div>
    </div>
  );
}