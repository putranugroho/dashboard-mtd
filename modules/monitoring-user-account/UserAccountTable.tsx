import { Badge } from "@/components/ui/badge";
import { UserAccountItem, UserAccountRole } from "./types";

type Props = {
  title: string;
  role: UserAccountRole;
  data: UserAccountItem[];
};

function maskToken(token: string) {
  if (!token.trim()) return "-";
  if (token.length <= 12) return token;
  return `${token.slice(0, 8)}...${token.slice(-4)}`;
}

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function UserAccountTable({ title, role, data }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">
            Menampilkan {data.length} account role {role}.
          </p>
        </div>
        <Badge variant={role === "NASABAH" ? "default" : "secondary"}>{role}</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1320px] border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-700">Username</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Nama</th>
              <th className="px-4 py-3 font-semibold text-gray-700">BPR</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Kantor</th>
              <th className="px-4 py-3 font-semibold text-gray-700">No CIF</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Phone</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Identitas</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Token</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Deleted</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Created</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Updated</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Deleted At</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada account {role} yang sesuai filter.
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const hasToken = item.token.trim().length > 0;
                const deleted = item.is_deleted === "Y" || Boolean(item.deleted_at);

                return (
                  <tr key={`${item.role}-${item.id}-${item.username}`} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-semibold text-gray-900">{item.username || "-"}</td>
                    <td className="px-4 py-3">{item.nama || "-"}</td>
                    <td className="px-4 py-3">{item.bpr_id || "-"}</td>
                    <td className="px-4 py-3">{item.kd_kantor || "-"}</td>
                    <td className="px-4 py-3">{item.no_cif || "-"}</td>
                    <td className="px-4 py-3">{item.phone || "-"}</td>
                    <td className="px-4 py-3">{item.no_identitas || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex max-w-[220px] flex-col gap-1">
                        {hasToken ? <Badge>Sudah Ada</Badge> : <Badge variant="outline">Belum Ada</Badge>}
                        <span className="truncate font-mono text-xs text-gray-500" title={item.token}>
                          {maskToken(item.token)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {deleted ? <Badge variant="destructive">Y</Badge> : <Badge>N</Badge>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.created_at)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.updated_at)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.deleted_at)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
