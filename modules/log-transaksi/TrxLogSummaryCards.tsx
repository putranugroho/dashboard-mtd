"use client";

import { Badge } from "@/components/ui/badge";
import type { TrxLogSummary } from "./types";

type Props = {
  summary: TrxLogSummary;
  formatCurrency: (value: number) => string;
};

export default function TrxLogSummaryCards({ summary, formatCurrency }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Total Log</p>
        <p className="mt-2 text-2xl font-semibold">{summary.total}</p>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Success</p>
        <p className="mt-2 text-2xl font-semibold">{summary.success}</p>
        <Badge className="mt-3">SUCCESS</Badge>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Failed</p>
        <p className="mt-2 text-2xl font-semibold">{summary.failed}</p>
        <Badge variant="destructive" className="mt-3">FAILED</Badge>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Timeout/Pending</p>
        <p className="mt-2 text-2xl font-semibold">
          {summary.timeout + summary.pending}
        </p>
        <Badge variant="secondary" className="mt-3">MONITOR</Badge>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Total Amount</p>
        <p className="mt-2 text-xl font-semibold">
          {formatCurrency(summary.totalAmount)}
        </p>
      </div>
    </div>
  );
}