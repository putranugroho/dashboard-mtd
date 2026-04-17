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
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Aktif</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Kode Transaksi</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Keterangan</th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-8 text-center text-sm text-gray-500"
              >
                Data relasi TCode belum tersedia
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.tcode_id} className="border-b last:border-b-0">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={item.is_linked}
                    onChange={() => onToggle(item.tcode_id)}
                    className="size-4 rounded border-gray-300"
                  />
                </td>
                <td className="px-4 py-3 text-sm font-medium">{item.tcode}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{item.keterangan}</td>
                <td className="px-4 py-3">
                  <Badge variant={item.is_linked ? "default" : "outline"}>
                    {item.is_linked ? "Linked" : "Unlinked"}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}