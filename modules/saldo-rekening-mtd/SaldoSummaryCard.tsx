"use client";

import { Badge } from "@/components/ui/badge";
import { SaldoSummary } from "./types";

type Props = {
  summary: SaldoSummary;
  formatCurrency: (value: number) => string;
};

export default function SaldoSummaryCards({
  summary,
  formatCurrency,
}: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Total Saldo Rekening</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {formatCurrency(summary.totalRekening)}
        </p>
        <div className="mt-3">
          <Badge>{summary.countRekening} Rekening</Badge>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Total Saldo GL</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {formatCurrency(summary.totalGL)}
        </p>
        <div className="mt-3">
          <Badge variant="outline">{summary.countGL} GL</Badge>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Total Keseluruhan</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {formatCurrency(summary.totalAll)}
        </p>
        <div className="mt-3">
          <Badge variant="secondary">{summary.countAll} Total Data</Badge>
        </div>
      </div>
    </div>
  );
}