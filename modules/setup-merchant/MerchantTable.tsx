"use client";

import { Edit, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MerchantItem } from "./types";

type Props = {
  data: MerchantItem[];
  onEdit: (item: MerchantItem) => void;
  onDelete: (item: MerchantItem) => void;
};

export default function MerchantTable({ data, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[840px] border-collapse text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="px-4 py-3 font-semibold text-gray-700">
              Merchant ID
            </th>
            <th className="px-4 py-3 font-semibold text-gray-700">
              Nama Merchant
            </th>
            <th className="px-4 py-3 font-semibold text-gray-700">PIC</th>
            <th className="px-4 py-3 font-semibold text-gray-700">No HP</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
            <th className="w-[140px] px-4 py-3 text-center font-semibold text-gray-700">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                Belum ada data merchant.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {item.merchant_id}
                </td>
                <td className="px-4 py-3">{item.nama_merchant}</td>
                <td className="px-4 py-3">{item.pic}</td>
                <td className="px-4 py-3">{item.no_hp}</td>
                <td className="px-4 py-3">
                  {item.is_active ? (
                    <Badge>Aktif</Badge>
                  ) : (
                    <Badge variant="outline">Nonaktif</Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={!item.is_active}
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="size-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}