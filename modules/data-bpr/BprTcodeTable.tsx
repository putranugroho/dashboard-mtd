"use client";

import { Badge } from "@/components/ui/badge";
import { BprTcodeItem } from "./types";

type Props = {
  data: BprTcodeItem[];
  onToggle: (tcodeId: number) => void;
};

export default function BprTcodeTable({ data, onToggle }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">
              Relasi
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">
              Kode Transaksi
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">
              Keterangan
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">
              Journal
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
                Data relasi TCode belum tersedia
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const disableToggle = !item.journal_ready && !item.is_linked;

              return (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={item.is_linked}
                      disabled={disableToggle}
                      onChange={() => onToggle(item.id)}
                      className="size-4 rounded border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                      title={
                        disableToggle
                          ? "Relasi hanya dapat diaktifkan jika setup journal sudah dibuat"
                          : "Toggle relasi TCode"
                      }
                    />
                  </td>

                  <td className="px-4 py-3 text-sm font-medium">{item.tcode}</td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.keterangan}
                  </td>

                  <td className="px-4 py-3">
                    <Badge variant={item.journal_ready ? "default" : "outline"}>
                      {item.journal_ready ? "Sudah Dibuat" : "Belum Ada"}
                    </Badge>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={item.is_linked ? "default" : "outline"}>
                        {item.is_linked ? "Linked" : "Unlinked"}
                      </Badge>

                      {!item.journal_ready ? (
                        <Badge variant="outline">Relasi Terkunci</Badge>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}