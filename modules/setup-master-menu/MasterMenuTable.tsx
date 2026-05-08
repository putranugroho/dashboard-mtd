"use client";

import { Edit, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MasterMenuItem } from "./types";

type Props = {
  data: MasterMenuItem[];
  onEdit: (item: MasterMenuItem) => void;
  onDelete: (item: MasterMenuItem) => void;
};

export default function MasterMenuTable({
  data,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white">
      <table className="w-full min-w-[1180px] border-collapse text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="w-[160px] px-4 py-3 font-semibold text-gray-700">
              Module
            </th>
            <th className="w-[70px] px-4 py-3 font-semibold text-gray-700">
              Urut
            </th>
            <th className="w-[160px] px-4 py-3 font-semibold text-gray-700">
              Menu
            </th>
            <th className="w-[70px] px-4 py-3 font-semibold text-gray-700">
              Urut
            </th>
            <th className="w-[220px] px-4 py-3 font-semibold text-gray-700">
              Submenu
            </th>
            <th className="w-[70px] px-4 py-3 font-semibold text-gray-700">
              Urut
            </th>
            <th className="w-[220px] px-4 py-3 font-semibold text-gray-700">
              Subsubmenu
            </th>
            <th className="w-[70px] px-4 py-3 font-semibold text-gray-700">
              Urut
            </th>
            <th className="w-[120px] px-4 py-3 font-semibold text-gray-700">
              Status
            </th>
            <th className="w-[140px] px-4 py-3 text-center font-semibold text-gray-700">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-4 py-10 text-center text-gray-500">
                Belum ada master menu.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {item.modul}
                </td>
                <td className="px-4 py-3">#{item.modul_urut}</td>

                <td className="px-4 py-3 font-medium text-gray-800">
                  {item.menu}
                </td>
                <td className="px-4 py-3">#{item.menu_urut}</td>

                <td className="px-4 py-3 text-gray-700">{item.submenu}</td>
                <td className="px-4 py-3">#{item.submenu_urut}</td>

                <td className="px-4 py-3 text-gray-700">
                  {item.subsubmenu || "-"}
                </td>
                <td className="px-4 py-3">#{item.subsubmenu_urut}</td>

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
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="size-4" />
                    </Button>

                    <Button
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