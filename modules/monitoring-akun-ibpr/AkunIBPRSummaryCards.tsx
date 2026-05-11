import { Badge } from "@/components/ui/badge";
import { AkunIBPRSummary } from "./types";

type Props = {
  summary: AkunIBPRSummary;
};

export default function AkunIBPRSummaryCards({ summary }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <div className="rounded-xl border bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Total Account</p>
        <p className="mt-1 text-2xl font-semibold">{summary.total}</p>
      </div>

      <div className="rounded-xl border bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Token</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>Sudah: {summary.withToken}</Badge>
          <Badge variant="outline">Belum: {summary.withoutToken}</Badge>
        </div>
      </div>

      <div className="rounded-xl border bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Status Account</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>Aktif: {summary.active}</Badge>
          <Badge variant="destructive">Deleted: {summary.deleted}</Badge>
        </div>
      </div>

      <div className="rounded-xl border bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Lock & Mode</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="destructive">Locked: {summary.locked}</Badge>
          <Badge variant="secondary">Dev: {summary.development}</Badge>
        </div>
      </div>
    </div>
  );
}