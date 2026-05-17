"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TrxLogItem } from "./types";

type Props = {
  data: TrxLogItem[];
  loading?: boolean;
  canDetail?: boolean;
  formatCurrency: (value: number) => string;
  formatDateTime: (value?: string | null) => string;
  onDetail: (item: TrxLogItem) => void;
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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] border-collapse text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Waktu</th>
                <th className="px-4 py-3 text-left">Jenis</th>
                <th className="px-4 py-3 text-left">BPR</th>
                <th className="px-4 py-3 text-left">RRN / Ref</th>
                <th className="px-4 py-3 text-left">TCode / Produk</th>
                <th className="px-4 py-3 text-left">Rek / HP</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Response</th>
                <th className="px-4 py-3 text-left">Kendala</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                    Memuat log transaksi...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                    Data log transaksi belum tersedia.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="align-top hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDateTime(item.created_at)}
                      <div className="text-xs text-gray-500">
                        TglTrans: {item.tgl_trans || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant="outline">{item.trx_category}</Badge>
                      <div className="mt-1 text-xs text-gray-500">
                        {item.trx_direction || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium">{item.nama_bpr || "-"}</div>
                      <div className="text-xs text-gray-500">{item.bpr_id}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium">{item.rrn}</div>
                      <div className="text-xs text-gray-500">{item.ref_id || "-"}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div>{item.trx_code || "-"}</div>
                      <div className="max-w-[180px] truncate text-xs text-gray-500">
                        {item.product_name || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div>{item.no_rek || "-"}</div>
                      <div className="text-xs text-gray-500">{item.no_hp || "-"}</div>
                    </td>

                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(Number(item.amount || 0))}
                    </td>

                    <td className="px-4 py-3">
                      <Badge variant={statusVariant(item.final_status)}>
                        {item.final_status || "PENDING"}
                      </Badge>
                      <div className="mt-1 text-xs text-gray-500">
                        {Math.round(Number(item.duration_ms || 0) / 1000)}s
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium">{item.final_code || "-"}</div>
                      <div className="max-w-[240px] truncate text-xs text-gray-500">
                        {item.final_message || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div>{item.failed_at_layer || "-"}</div>
                      <div className="max-w-[200px] truncate text-xs text-gray-500">
                        {item.failed_at_step || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-right">
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
        </div>
      </div>
    </div>
  );
}