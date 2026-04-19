"use client";

import { Badge } from "@/components/ui/badge";
import { SaldoMTDItem } from "./types";

type Props = {
  title: string;
  data: SaldoMTDItem[];
  formatCurrency: (value: number) => string;
};

export default function SaldoTable({ title, data, formatCurrency }: Props) {
  const isGLTable = title.toLowerCase().includes("gl");
  const firstColumnLabel = isGLTable ? "No GL" : "No Rekening";

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">Total data: {data.length}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[30%]" />
              <col className="w-[20%]" />
              <col className="w-[20%]" />
              <col className="w-[10%]" />
            </colgroup>

            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  {firstColumnLabel}
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Nama
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Saldo Akhir
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                  Saldo Efektif
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
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
                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                      {item.no_rek}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {item.nama}
                    </td>
                    <td className="px-4 py-3 text-left text-sm text-gray-700">
                      {formatCurrency(Number(item.saldoakhir || 0))}
                    </td>
                    <td className="px-4 py-3 text-left text-sm text-gray-700">
                      {formatCurrency(Number(item.saldoeff || 0))}
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      <div className="flex justify-center">
                        <Badge
                          variant={
                            item.status_rek?.toUpperCase() === "AKTIF"
                              ? "default"
                              : "outline"
                          }
                        >
                          {item.status_rek}
                        </Badge>
                      </div>
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