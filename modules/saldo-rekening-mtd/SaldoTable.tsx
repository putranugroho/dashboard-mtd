"use client";

import { Badge } from "@/components/ui/badge";
import { SaldoRekeningItem } from "./types";

type Props = {
  title: string;
  data: SaldoRekeningItem[];
  formatCurrency: (value: number) => string;
};

export default function SaldoTable({ title, data, formatCurrency }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">
            Total data: {data.length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  No Rekening / GL
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Nama
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Saldo Akhir
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Saldo Efektif
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={`${item.no_rek}-${index}`} className="border-t">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.no_rek}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.nama}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatCurrency(Number(item.saldoakhir || 0))}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatCurrency(Number(item.saldoeff || 0))}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge
                        variant={
                          item.status_rek?.toUpperCase() === "AKTIF"
                            ? "default"
                            : "outline"
                        }
                      >
                        {item.status_rek}
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