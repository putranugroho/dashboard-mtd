"use client";

import { Edit, Eye, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveBannerAssetUrl } from "@/lib/api/banner";
import { BannerItem } from "./types";

type Props = {
  data: BannerItem[];
  onEdit: (item: BannerItem) => void;
  onDelete: (item: BannerItem) => void;
  onPreview: (item: BannerItem) => void;
};

function TypeBadge({ type }: { type: BannerItem["banner_type"] }) {
  if (type === "VIDEO") return <Badge variant="secondary">Video</Badge>;
  if (type === "TEXT") return <Badge variant="outline">Text</Badge>;
  return <Badge>Image</Badge>;
}

export default function BannerTable({ data, onEdit, onDelete, onPreview }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-collapse text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="w-[90px] px-4 py-3 font-semibold text-gray-700">Preview</th>
            <th className="w-[90px] px-4 py-3 font-semibold text-gray-700">Urutan</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Title</th>
            <th className="w-[120px] px-4 py-3 font-semibold text-gray-700">Jenis</th>
            <th className="w-[120px] px-4 py-3 font-semibold text-gray-700">Scope</th>
            <th className="w-[120px] px-4 py-3 font-semibold text-gray-700">BPR ID</th>
            <th className="w-[110px] px-4 py-3 font-semibold text-gray-700">Status</th>
            <th className="w-[170px] px-4 py-3 text-center font-semibold text-gray-700">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                Belum ada data banner.
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const imageUrl = resolveBannerAssetUrl(item.image_url);

              return (
                <tr key={item.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3">
                    {imageUrl ? (
                      <button
                        type="button"
                        onClick={() => onPreview(item)}
                        className="block size-14 overflow-hidden rounded-xl border bg-gray-50"
                      >
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-xl border bg-gray-50 text-xs text-gray-400">
                        No Img
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 font-semibold text-gray-900">#{item.urutan}</td>

                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="mt-1 line-clamp-2 text-xs text-gray-500">
                      {item.description || "-"}
                    </div>
                  </td>

                  <td className="px-4 py-3"><TypeBadge type={item.banner_type} /></td>
                  <td className="px-4 py-3">{item.scope_type}</td>
                  <td className="px-4 py-3">{item.bpr_id || "-"}</td>

                  <td className="px-4 py-3">
                    {item.is_active ? <Badge>Aktif</Badge> : <Badge variant="outline">Nonaktif</Badge>}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => onPreview(item)}>
                        <Eye className="size-4" />
                      </Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => onEdit(item)}>
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
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
