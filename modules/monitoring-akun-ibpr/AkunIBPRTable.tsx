import { Badge } from "@/components/ui/badge";
import { AkunIBPRItem } from "./types";

type Props = {
  data: AkunIBPRItem[];
};

function maskToken(token: string) {
  if (!token.trim()) return "-";
  if (token.length <= 12) return token;
  return `${token.slice(0, 8)}...${token.slice(-4)}`;
}

function maskDeviceId(deviceId: string) {
  if (!deviceId.trim()) return "-";
  if (deviceId.length <= 16) return deviceId;
  return `${deviceId.slice(0, 10)}...${deviceId.slice(-6)}`;
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

export default function AkunIBPRTable({ data }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Daftar Akun IBPR
          </h2>
          <p className="text-sm text-gray-500">
            Menampilkan {data.length} account dari tabel users_ibpr.
          </p>
        </div>
        <Badge variant="secondary">USERS_IBPR</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1480px] border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-700">User ID</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Nama Lengkap</th>
              <th className="px-4 py-3 font-semibold text-gray-700">BPR</th>
              <th className="px-4 py-3 font-semibold text-gray-700">No Rekening</th>
              <th className="px-4 py-3 font-semibold text-gray-700">No Ponsel</th>
              <th className="px-4 py-3 font-semibold text-gray-700">No KTP</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Token</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Lock</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Deleted</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Device ID</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Development</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Created</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                  Tidak ada account IBPR yang sesuai filter.
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const hasToken = item.token.trim().length > 0;
                const deleted = item.is_deleted === "Y";
                const locked = item.is_lock === "Y";
                const isDevelopment = item.development === "Y";

                return (
                  <tr
                    key={`${item.id}-${item.users_id}`}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {item.users_id || "-"}
                    </td>
                    <td className="px-4 py-3">{item.nama_lengkap || "-"}</td>
                    <td className="px-4 py-3">{item.bpr_id || "-"}</td>
                    <td className="px-4 py-3">{item.no_rekening || "-"}</td>
                    <td className="px-4 py-3">{item.nomor_ponsel || "-"}</td>
                    <td className="px-4 py-3">{item.no_ktp || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex max-w-[220px] flex-col gap-1">
                        {hasToken ? (
                          <Badge>Sudah Ada</Badge>
                        ) : (
                          <Badge variant="outline">Belum Ada</Badge>
                        )}
                        <span
                          className="truncate font-mono text-xs text-gray-500"
                          title={item.token}
                        >
                          {maskToken(item.token)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {locked ? (
                        <Badge variant="destructive">Y</Badge>
                      ) : (
                        <Badge>N</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {deleted ? (
                        <Badge variant="destructive">Y</Badge>
                      ) : (
                        <Badge>N</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-xs text-gray-600"
                        title={item.deviceId}
                      >
                        {maskDeviceId(item.deviceId)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isDevelopment ? (
                        <Badge variant="secondary">Development</Badge>
                      ) : (
                        <Badge variant="outline">Production</Badge>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDate(item.createdDate)}
                    </td>
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