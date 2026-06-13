"use client";

import type { CSSProperties } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HorizontalDragScroll from "../shared/HorizontalDragScroll";
import type { TrxLogItem } from "./types";

type Props = {
  data: TrxLogItem[];
  loading?: boolean;
  canDetail?: boolean;
  formatCurrency: (value: number) => string;
  formatDateTime: (value?: string | null) => string;
  onDetail: (item: TrxLogItem) => void;
};

const TABLE_WIDTH = 1300;
const COL_WAKTU = 190;

const stickyWaktuHeaderStyle: CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 50,
  width: COL_WAKTU,
  minWidth: COL_WAKTU,
  maxWidth: COL_WAKTU,
  boxShadow: "8px 0 10px -8px rgba(0,0,0,0.35)",
};

const stickyWaktuBodyStyle: CSSProperties = {
  position: "sticky",
  left: 0,
  zIndex: 40,
  width: COL_WAKTU,
  minWidth: COL_WAKTU,
  maxWidth: COL_WAKTU,
  boxShadow: "8px 0 10px -8px rgba(0,0,0,0.25)",
};

function statusVariant(status: string) {
  const normalized = status?.toUpperCase();

  if (normalized === "SUCCESS") return "default";
  if (normalized === "FAILED") return "destructive";
  if (normalized === "TIMEOUT") return "secondary";

  return "outline";
}

export default function TrxLogTable({
  data,
  loading = false,
  canDetail = true,
  formatCurrency,
  formatDateTime,
  onDetail,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Daftar Log Transaksi
        </h2>
        <p className="text-sm text-gray-500">
          List utama menampilkan induk transaksi dari middleware.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <HorizontalDragScroll className="relative isolate">
          <table
            className="table-fixed border-separate border-spacing-0 text-sm"
            style={{ width: TABLE_WIDTH, minWidth: TABLE_WIDTH }}
          >
            <colgroup>
              <col style={{ width: COL_WAKTU }} />
              <col style={{ width: 120 }} />
              <col style={{ width: 170 }} />
              <col style={{ width: 180 }} />
              <col style={{ width: 170 }} />
              <col style={{ width: 160 }} />
              <col style={{ width: 130 }} />
              <col style={{ width: 130 }} />
              <col style={{ width: 190 }} />
              <col style={{ width: 170 }} />
              <col style={{ width: 80 }} />
            </colgroup>

            <thead className="text-xs uppercase text-gray-500">
              <tr>
                <th
                  style={stickyWaktuHeaderStyle}
                  className="border-b border-r bg-gray-50 px-4 py-3 text-left font-semibold"
                >
                  Waktu
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 text-left font-semibold">
                  Jenis
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 text-left font-semibold">
                  BPR
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 text-left font-semibold">
                  RRN / Ref
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 text-left font-semibold">
                  TCode / Produk
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 text-left font-semibold">
                  Rek / HP
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 text-right font-semibold">
                  Amount
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 text-left font-semibold">
                  Status
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 text-left font-semibold">
                  Response
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 text-left font-semibold">
                  Kendala
                </th>
                <th className="relative z-0 border-b bg-gray-50 px-4 py-3 text-right font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Memuat log transaksi...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Data log transaksi belum tersedia.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="group align-top hover:bg-gray-50"
                  >
                    <td
                      style={stickyWaktuBodyStyle}
                      className="border-b border-r bg-white px-4 py-3 group-hover:bg-gray-50"
                    >
                      <div>{formatDateTime(item.created_at)}</div>
                      <div className="truncate text-xs text-gray-500">
                        TglTrans: {item.tgl_trans || "-"}
                      </div>
                    </td>

                    <td className="relative z-0 border-b px-4 py-3">
                      <Badge variant="outline">{item.trx_category}</Badge>
                      <div className="mt-1 truncate text-xs text-gray-500">
                        {item.trx_direction || "-"}
                      </div>
                    </td>

                    <td className="relative z-0 border-b px-4 py-3">
                      <div className="truncate font-medium">{item.nama_bpr || "-"}</div>
                      <div className="truncate text-xs text-gray-500">{item.bpr_id}</div>
                    </td>

                    <td className="relative z-0 border-b px-4 py-3">
                      <div className="truncate font-medium">{item.rrn}</div>
                      <div className="truncate text-xs text-gray-500">
                        {item.ref_id || "-"}
                      </div>
                    </td>

                    <td className="relative z-0 border-b px-4 py-3">
                      <div className="truncate">{item.trx_code || "-"}</div>
                      <div className="truncate text-xs text-gray-500">
                        {item.product_name || "-"}
                      </div>
                    </td>

                    <td className="relative z-0 border-b px-4 py-3">
                      <div className="truncate">{item.no_rek || "-"}</div>
                      <div className="truncate text-xs text-gray-500">
                        {item.no_hp || "-"}
                      </div>
                    </td>

                    <td className="relative z-0 border-b px-4 py-3 text-right font-medium">
                      {formatCurrency(Number(item.amount || 0))}
                    </td>

                    <td className="relative z-0 border-b px-4 py-3">
                      <Badge variant={statusVariant(item.final_status)}>
                        {item.final_status || "PENDING"}
                      </Badge>
                      <div className="mt-1 text-xs text-gray-500">
                        {Math.round(Number(item.duration_ms || 0) / 1000)}s
                      </div>
                    </td>

                    <td className="relative z-0 border-b px-4 py-3">
                      <div className="truncate font-medium">{item.final_code || "-"}</div>
                      <div className="truncate text-xs text-gray-500">
                        {item.final_message || "-"}
                      </div>
                    </td>

                    <td className="relative z-0 border-b px-4 py-3">
                      <div className="truncate">{item.failed_at_layer || "-"}</div>
                      <div className="truncate text-xs text-gray-500">
                        {item.failed_at_step || "-"}
                      </div>
                    </td>

                    <td className="relative z-0 border-b px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!canDetail}
                        onClick={() => onDetail(item)}
                      >
                        Detail
                      </Button>
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
