"use client";

import { Badge } from "@/components/ui/badge";
import type { SaldoMTDMonitoringDetailItem } from "./types";

type Props = {
  title: string;
  data: SaldoMTDMonitoringDetailItem[];
  loading?: boolean;
  formatCurrency: (value: number) => string;
};

export default function MonitoringDetailTable({
  title,
  data,
  loading = false,
  formatCurrency,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">Total data: {data.length}</p>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Jenis</th>
                <th className="px-4 py-3 text-left">No Rek / GL</th>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-right">Saldo Akhir</th>
                <th className="px-4 py-3 text-right">Saldo Efektif</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Memuat detail...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Detail snapshot belum tersedia.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={`${item.bpr_id}-${item.jns_rek}-${item.no_rek}`}>
                    <td className="px-4 py-3">
                      <Badge variant={item.jns_rek === "1" ? "outline" : "default"}>
                        {item.jns_rek === "1" ? "GL" : "Rekening"}
                      </Badge>
                    </td>

                    <td className="px-4 py-3 font-medium text-gray-900">
                      {item.no_rek}
                    </td>

                    <td className="px-4 py-3">{item.nama || "-"}</td>

                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(Number(item.saldoakhir || 0))}
                    </td>

                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(Number(item.saldoeff || 0))}
                    </td>

                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          item.status_rek?.toUpperCase() === "AKTIF"
                            ? "default"
                            : "outline"
                        }
                      >
                        {item.status_rek || "-"}
                      </Badge>
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