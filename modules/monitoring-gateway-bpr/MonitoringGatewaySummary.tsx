"use client";

import { GatewayMonitorSummary } from "./types";

type Props = {
  summary: GatewayMonitorSummary;
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

export default function MonitoringGatewaySummary({ summary }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card title="Total BPR" value={summary.total} helper="Total BPR dimonitor" />
      <Card title="Normal" value={summary.normal} helper="Echo berhasil" />
      <Card title="Offline" value={summary.offline} helper="Gateway nonaktif" />
      <Card title="Warning" value={summary.warning} helper="Perlu perhatian" />
      <Card title="Error" value={summary.error} helper="Gateway bermasalah" />
    </div>
  );
}