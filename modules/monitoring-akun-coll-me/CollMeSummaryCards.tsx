import { Badge } from "@/components/ui/badge";
import { CollMeSummary } from "./types";

type Props = {
  summary: CollMeSummary;
};

export default function CollMeSummaryCards({ summary }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">Total Collector</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">
          {summary.total}
        </p>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">Status Aktif</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>Aktif: {summary.active}</Badge>
          <Badge variant="secondary">Tidak Aktif: {summary.inactive}</Badge>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">Status Login</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>Login: {summary.login}</Badge>
          <Badge variant="outline">Tidak Login: {summary.notLogin}</Badge>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">Keamanan</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="destructive">Blokir: {summary.blocked}</Badge>
          <Badge variant="secondary">Pass Salah: {summary.passwordWrong}</Badge>
        </div>
      </div>
    </div>
  );
}