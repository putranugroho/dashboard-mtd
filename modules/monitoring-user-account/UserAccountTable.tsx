import type { CSSProperties } from "react";

import { Badge } from "@/components/ui/badge";
import { UserAccountItem, UserAccountRole } from "./types";
import HorizontalDragScroll from "../shared/HorizontalDragScroll";

type Props = {
  title: string;
  role: UserAccountRole;
  data: UserAccountItem[];
};

const TABLE_WIDTH = 1320;
const COL_USERNAME = 180;
const COL_NAME = 240;

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

const stickyUsernameHeaderStyle: CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 50,
  width: COL_USERNAME,
  minWidth: COL_USERNAME,
  maxWidth: COL_USERNAME,
};

const stickyNameHeaderStyle: CSSProperties = {
  position: "sticky",
  left: COL_USERNAME,
  zIndex: 50,
  width: COL_NAME,
  minWidth: COL_NAME,
  maxWidth: COL_NAME,
  boxShadow: "8px 0 10px -8px rgba(0,0,0,0.35)",
};

const stickyUsernameBodyStyle: CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 40,
  width: COL_USERNAME,
  minWidth: COL_USERNAME,
  maxWidth: COL_USERNAME,
};

const stickyNameBodyStyle: CSSProperties = {
  position: "sticky",
  left: COL_USERNAME,
  zIndex: 40,
  width: COL_NAME,
  minWidth: COL_NAME,
  maxWidth: COL_NAME,
  boxShadow: "8px 0 10px -8px rgba(0,0,0,0.25)",
};

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

      <div className="overflow-hidden rounded-xl border">
        <HorizontalDragScroll className="relative isolate">
          <table
            className="table-fixed border-separate border-spacing-0 text-sm"
            style={{ width: TABLE_WIDTH, minWidth: TABLE_WIDTH }}
          >
            <colgroup>
              <col style={{ width: COL_USERNAME }} />
              <col style={{ width: COL_NAME }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 100 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 150 }} />
              <col style={{ width: 180 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 160 }} />
            </colgroup>

            <thead>
              <tr className="text-left">
                <th
                  style={stickyUsernameHeaderStyle}
                  className="border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700"
                >
                  Username
                </th>
                <th
                  style={stickyNameHeaderStyle}
                  className="border-b border-r bg-gray-50 px-4 py-3 font-semibold text-gray-700"
                >
                  Nama
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">BPR</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">Kantor</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">No CIF</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">Phone</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">Identitas</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">Token</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">Created</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">Updated</th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">Deleted At</th>
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
                    <tr
                      key={`${item.role}-${item.id}-${item.username}`}
                      className="group"
                    >
                      <td
                        style={stickyUsernameBodyStyle}
                        className="border-b bg-white px-4 py-3 font-semibold text-gray-900 group-hover:bg-gray-50"
                      >
                        <div className="truncate">{item.username || "-"}</div>
                      </td>
                      <td
                        style={stickyNameBodyStyle}
                        className="border-b border-r bg-white px-4 py-3 group-hover:bg-gray-50"
                      >
                        <div className="truncate">{item.nama || "-"}</div>
                      </td>
                      <td className="relative z-0 border-b px-4 py-3">{item.bpr_id || "-"}</td>
                      <td className="relative z-0 border-b px-4 py-3">{item.kd_kantor || "-"}</td>
                      <td className="relative z-0 border-b px-4 py-3">{item.no_cif || "-"}</td>
                      <td className="relative z-0 border-b px-4 py-3">{item.phone || "-"}</td>
                      <td className="relative z-0 border-b px-4 py-3">{item.no_identitas || "-"}</td>
                      <td className="relative z-0 border-b px-4 py-3">
                        <div className="flex max-w-[220px] flex-col gap-1">
                          {hasToken ? <Badge>Sudah Ada</Badge> : <Badge variant="outline">Belum Ada</Badge>}
                          <span className="truncate font-mono text-xs text-gray-500" title={item.token}>
                            {maskToken(item.token)}
                          </span>
                        </div>
                      </td>
                      <td className="relative z-0 border-b px-4 py-3">
                        {deleted ? <Badge variant="destructive">Deleted</Badge> : <Badge>Aktif</Badge>}
                      </td>
                      <td className="relative z-0 whitespace-nowrap border-b px-4 py-3">{formatDate(item.created_at)}</td>
                      <td className="relative z-0 whitespace-nowrap border-b px-4 py-3">{formatDate(item.updated_at)}</td>
                      <td className="relative z-0 whitespace-nowrap border-b px-4 py-3">{formatDate(item.deleted_at)}</td>
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
