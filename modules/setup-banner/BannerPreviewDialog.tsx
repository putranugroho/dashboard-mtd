"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { resolveBannerAssetUrl } from "@/lib/api/banner";
import { BannerItem } from "./types";

type Props = {
  item: BannerItem | null;
  onClose: () => void;
};

export default function BannerPreviewDialog({ item, onClose }: Props) {
  if (!item) return null;

  const imageUrl = resolveBannerAssetUrl(item.image_url);
  const videoUrl = resolveBannerAssetUrl(item.video_url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b p-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {item.banner_type} • {item.scope_type} {item.bpr_id ? `• ${item.bpr_id}` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="max-h-[calc(92vh-84px)] overflow-y-auto p-5">
          {item.banner_type === "VIDEO" && videoUrl ? (
            <video src={videoUrl} controls className="w-full rounded-2xl border bg-black" />
          ) : item.banner_type === "TEXT" ? (
            <div className="space-y-4">
              {imageUrl ? (
                <img src={imageUrl} alt={item.title} className="max-h-[280px] w-full rounded-2xl object-cover" />
              ) : null}
              <div className="rounded-2xl border bg-gray-50 p-5 text-sm leading-6 text-gray-700 whitespace-pre-wrap">
                {item.text_content || item.description || "Tidak ada konten text."}
              </div>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={item.title} className="max-h-[70vh] w-full rounded-2xl object-contain" />
          ) : (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
              Preview tidak tersedia.
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <Button type="button" variant="outline" onClick={onClose}>Tutup</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
