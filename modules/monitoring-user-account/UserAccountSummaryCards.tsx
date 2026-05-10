import { Badge } from "@/components/ui/badge";
import { UserAccountSummary } from "./types";

type Props = {
  summary: UserAccountSummary;
};

export default function UserAccountSummaryCards({ summary }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <div className="rounded-xl border bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Total Account</p>
        <p className="mt-1 text-2xl font-semibold">{summary.total}</p>
      </div>

      <div className="rounded-xl border bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Role</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>NASABAH: {summary.nasabah}</Badge>
          <Badge variant="secondary">STAFF: {summary.staff}</Badge>
        </div>
      </div>

      <div className="rounded-xl border bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Token</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>Sudah: {summary.withToken}</Badge>
          <Badge variant="outline">Belum: {summary.withoutToken}</Badge>
        </div>
      </div>

      <div className="rounded-xl border bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Status Delete</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>Aktif: {summary.active}</Badge>
          <Badge variant="destructive">Deleted: {summary.deleted}</Badge>
        </div>
      </div>
    </div>
  );
}
