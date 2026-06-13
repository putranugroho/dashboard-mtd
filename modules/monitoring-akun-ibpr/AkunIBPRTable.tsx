import type { CSSProperties } from "react";

import { Badge } from "@/components/ui/badge";
import { AkunIBPRItem } from "./types";
import HorizontalDragScroll from "../shared/HorizontalDragScroll";

type Props = {
  data: AkunIBPRItem[];
};

const TABLE_WIDTH = 1480;
const COL_USER = 180;
const COL_NAME = 240;

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

const stickyUserHeaderStyle: CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 50,
  width: COL_USER,
  minWidth: COL_USER,
  maxWidth: COL_USER,
};

const stickyNameHeaderStyle: CSSProperties = {
  position: "sticky",
  left: COL_USER,
  zIndex: 50,
  width: COL_NAME,
  minWidth: COL_NAME,
  maxWidth: COL_NAME,
  boxShadow: "8px 0 10px -8px rgba(0,0,0,0.35)",
};

const stickyUserBodyStyle: CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 40,
  width: COL_USER,
  minWidth: COL_USER,
  maxWidth: COL_USER,
};

const stickyNameBodyStyle: CSSProperties = {
  position: "sticky",
  left: COL_USER,
  zIndex: 40,
  width: COL_NAME,
  minWidth: COL_NAME,
  maxWidth: COL_NAME,
  boxShadow: "8px 0 10px -8px rgba(0,0,0,0.25)",
};

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

      <div className="overflow-hidden rounded-xl border">
        <HorizontalDragScroll className="relative isolate">
          <table
            className="table-fixed border-separate border-spacing-0 text-sm"
            style={{ width: TABLE_WIDTH, minWidth: TABLE_WIDTH }}
          >
            <colgroup>
              <col style={{ width: COL_USER }} />
              <col style={{ width: COL_NAME }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 180 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 180 }} />
              <col style={{ width: 130 }} />
              <col style={{ width: 160 }} />
            </colgroup>

            <thead>
              <tr className="text-left">
                <th
                  style={stickyUserHeaderStyle}
                  className="border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700"
                >
                  User ID
                </th>
                <th
                  style={stickyNameHeaderStyle}
                  className="border-b border-r bg-gray-50 px-4 py-3 font-semibold text-gray-700"
                >
                  Nama Lengkap
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">BPR</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">No Rekening</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">No Ponsel</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">No KTP</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">Token</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">Blokir</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">Device ID</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">Server</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">Created</th>
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
                      className="group"
                    >
                      <td
                        style={stickyUserBodyStyle}
                        className="border-b bg-white px-4 py-3 font-semibold text-gray-900 group-hover:bg-gray-50"
                      >
                        <div className="truncate">{item.users_id || "-"}</div>
                      </td>
                      <td
                        style={stickyNameBodyStyle}
                        className="border-b border-r bg-white px-4 py-3 group-hover:bg-gray-50"
                      >
                        <div className="truncate">{item.nama_lengkap || "-"}</div>
                      </td>
                      <td className="relative z-0 border-b px-4 py-3">{item.bpr_id || "-"}</td>
                      <td className="relative z-0 border-b px-4 py-3">{item.no_rekening || "-"}</td>
                      <td className="relative z-0 border-b px-4 py-3">{item.nomor_ponsel || "-"}</td>
                      <td className="relative z-0 border-b px-4 py-3">{item.no_ktp || "-"}</td>
                      <td className="relative z-0 border-b px-4 py-3">
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
                      <td className="relative z-0 border-b px-4 py-3">
                        {locked ? (
                          <Badge variant="destructive">Y</Badge>
                        ) : (
                          <Badge>N</Badge>
                        )}
                      </td>
                      <td className="relative z-0 border-b px-4 py-3">
                        {deleted ? (
                          <Badge variant="destructive">Deleted</Badge>
                        ) : (
                          <Badge>Aktif</Badge>
                        )}
                      </td>
                      <td className="relative z-0 border-b px-4 py-3">
                        <span
                          className="font-mono text-xs text-gray-600"
                          title={item.deviceId}
                        >
                          {maskDeviceId(item.deviceId)}
                        </span>
                      </td>
                      <td className="relative z-0 border-b px-4 py-3">
                        {isDevelopment ? (
                          <Badge variant="secondary">Development</Badge>
                        ) : (
                          <Badge variant="outline">Production</Badge>
                        )}
                      </td>
                      <td className="relative z-0 whitespace-nowrap border-b px-4 py-3">
                        {formatDate(item.createdDate)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </HorizontalDragScroll>
      </div>
    </div>
  );
}
