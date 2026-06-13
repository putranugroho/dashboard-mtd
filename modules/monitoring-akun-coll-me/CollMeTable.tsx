import type { CSSProperties } from "react";

import { Badge } from "@/components/ui/badge";
import { CollMeCollectorItem } from "./types";
import HorizontalDragScroll from "../shared/HorizontalDragScroll";

type Props = {
  data: CollMeCollectorItem[];
};

const TABLE_WIDTH = 1320;

const COL_NO = 80;
const COL_NAME = 260;

function renderLoginBadge(value: string) {
  return value === "Y" ? (
    <Badge>Login</Badge>
  ) : (
    <Badge variant="outline">Tidak Login</Badge>
  );
}

function renderAktifBadge(value: string) {
  return value === "A" ? (
    <Badge>Aktif</Badge>
  ) : (
    <Badge variant="secondary">Tidak Aktif</Badge>
  );
}

function renderBlokirBadge(value: string) {
  return value === "Y" ? (
    <Badge variant="destructive">Terblokir</Badge>
  ) : (
    <Badge variant="outline">Normal</Badge>
  );
}

const stickyNoHeaderStyle: CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 50,
  width: COL_NO,
  minWidth: COL_NO,
  maxWidth: COL_NO,
};

const stickyNameHeaderStyle: CSSProperties = {
  position: "sticky",
  left: COL_NO,
  zIndex: 50,
  width: COL_NAME,
  minWidth: COL_NAME,
  maxWidth: COL_NAME,
  boxShadow: "8px 0 10px -8px rgba(0,0,0,0.35)",
};

const stickyNoBodyStyle: CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 40,
  width: COL_NO,
  minWidth: COL_NO,
  maxWidth: COL_NO,
};

const stickyNameBodyStyle: CSSProperties = {
  position: "sticky",
  left: COL_NO,
  zIndex: 40,
  width: COL_NAME,
  minWidth: COL_NAME,
  maxWidth: COL_NAME,
  boxShadow: "8px 0 10px -8px rgba(0,0,0,0.25)",
};

export default function CollMeTable({ data }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Hasil Monitoring Akun Coll Me
        </h2>
        <p className="text-sm text-gray-500">
          Menampilkan {data.length} data collector.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <HorizontalDragScroll className="relative isolate">
          <table
            className="table-fixed border-separate border-spacing-0 text-sm"
            style={{ width: TABLE_WIDTH, minWidth: TABLE_WIDTH }}
          >
            <colgroup>
              <col style={{ width: COL_NO }} />
              <col style={{ width: COL_NAME }} />
              <col style={{ width: 180 }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 180 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 140 }} />
              <col style={{ width: 160 }} />
            </colgroup>

            <thead>
              <tr className="text-left">
                <th
                  style={stickyNoHeaderStyle}
                  className="border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700"
                >
                  No
                </th>

                <th
                  style={stickyNameHeaderStyle}
                  className="border-b border-r bg-gray-50 px-4 py-3 font-semibold text-gray-700"
                >
                  Nama Collector
                </th>

                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">
                  User ID
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">
                  Kantor
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">
                  No HP
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">
                  Status Login
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">
                  Status Aktif
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">
                  Pass Salah
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 font-semibold text-gray-700">
                  Blokir Pass
                </th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Tidak ada data collector yang sesuai filter.
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={`${item.id}-${item.backend_id}-${item.userid}`}
                    className="group"
                  >
                    <td
                      style={stickyNoBodyStyle}
                      className="border-b bg-white px-4 py-3 group-hover:bg-gray-50"
                    >
                      {index + 1}
                    </td>

                    <td
                      style={stickyNameBodyStyle}
                      className="border-b border-r bg-white px-4 py-3 group-hover:bg-gray-50"
                    >
                      <div className="truncate">{item.nama || "-"}</div>
                    </td>

                    <td className="relative z-0 border-b px-4 py-3 font-semibold text-gray-900">
                      <div className="truncate">{item.userid || "-"}</div>
                    </td>

                    <td className="relative z-0 border-b px-4 py-3">
                      {item.kd_kantor || "-"}
                    </td>

                    <td className="relative z-0 border-b px-4 py-3">
                      {item.nohp || "-"}
                    </td>

                    <td className="relative z-0 border-b px-4 py-3">
                      {renderLoginBadge(item.stslogin)}
                    </td>

                    <td className="relative z-0 border-b px-4 py-3">
                      {renderAktifBadge(item.stsaktif)}
                    </td>

                    <td className="relative z-0 border-b px-4 py-3">
                      {item.pass_salah > 0 ? (
                        <Badge variant="destructive">{item.pass_salah}</Badge>
                      ) : (
                        <Badge variant="outline">0</Badge>
                      )}
                    </td>

                    <td className="relative z-0 border-b px-4 py-3">
                      {renderBlokirBadge(item.blokirpass)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </HorizontalDragScroll>
      </div>
    </div>
  );
}