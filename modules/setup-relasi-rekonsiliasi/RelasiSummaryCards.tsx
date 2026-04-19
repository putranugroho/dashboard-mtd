"use client";

import { RelasiSummary } from "./types";

type Props = {
  summary: RelasiSummary;
};

function Card({
  title,
  value,
  helper,
}: {
  title: string;
  value: number;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      <p className="mt-2 text-xs text-gray-500">{helper}</p>
    </div>
  );
}

export default function RelasiSummaryCards({ summary }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card
        title="Total Source MTD"
        value={summary.total}
        helper="Total rekening / GL hasil inquiry saldo MTD"
      />
      <Card
        title="Sudah Relasi"
        value={summary.mapped}
        helper="Source yang sudah punya mapping SBB"
      />
      <Card
        title="Belum Relasi"
        value={summary.unmapped}
        helper="Source yang belum dipilihkan mapping SBB"
      />
    </div>
  );
}