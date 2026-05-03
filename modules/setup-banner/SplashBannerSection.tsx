"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ImagePlus, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import BannerForm from "./BannerForm";
import BannerPreviewDialog from "./BannerPreviewDialog";
import { BannerFormValues, BannerItem } from "./types";
import { activateSplashBanner, resolveBannerAssetUrl } from "@/lib/api/banner";

type Props = {
  data: BannerItem[];
  loading: boolean;
  submitting: boolean;
  onSubmit: (
    values: BannerFormValues,
    selectedItem: BannerItem | null
  ) => Promise<void>;
  onDelete: (item: BannerItem) => Promise<void> | void;
  onRefresh: () => Promise<void> | void;
};

function getNextSplashOrder(data: BannerItem[]) {
  const used = new Set(
    data.map((item) => Number(item.urutan || 0)).filter((value) => value > 0)
  );

  let next = 1;
  while (used.has(next)) next += 1;
  return next;
}

export default function SplashBannerSection({
  data,
  loading,
  submitting,
  onSubmit,
  onDelete,
  onRefresh,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BannerItem | null>(null);
  const [previewItem, setPreviewItem] = useState<BannerItem | null>(null);
  const [activatingId, setActivatingId] = useState<number | null>(null);

  const nextOrder = useMemo(() => getNextSplashOrder(data), [data]);

  const handleCreate = () => {
    setSelectedItem(null);
    setSheetOpen(true);
  };

  const handleEdit = (item: BannerItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };

  const handleActivate = async (item: BannerItem) => {
    const ok = window.confirm(
      `Aktifkan splash "${item.title}"?\n\nSplash lain yang aktif akan otomatis dinonaktifkan.`
    );
    if (!ok) return;

    try {
      setActivatingId(item.id);
      await activateSplashBanner(item.id);
      await onRefresh();
      window.alert("Splash berhasil diaktifkan.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal mengaktifkan splash"
      );
    } finally {
      setActivatingId(null);
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Splash Banner</h2>
          <p className="text-sm text-gray-500">
            Gambar popup global saat user pertama kali membuka aplikasi. Hanya
            satu splash yang boleh aktif.
          </p>
        </div>

        <Button onClick={handleCreate} disabled={submitting}>
          <ImagePlus className="mr-2 size-4" />
          Tambah Splash
        </Button>
      </div>

      {loading ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
          Memuat splash banner...
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
          Belum ada splash banner.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border">
            <div className="grid grid-cols-[80px_120px_1fr_140px_240px] bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600">
                <div>ID</div>
                <div>Preview</div>
                <div>Judul</div>
                <div>Status</div>
                <div className="text-right">Aksi</div>
            </div>

            {data.map((item) => {
                const imageUrl = resolveBannerAssetUrl(item.image_url || item.image_file);

                return (
                <div
                    key={item.id}
                    className="grid grid-cols-[80px_120px_1fr_140px_240px] items-center border-t px-4 py-3 text-sm"
                >
                    <div>{item.id}</div>

                    <div>
                    {imageUrl ? (
                        <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        className="h-[70px] w-[100px] overflow-hidden rounded-xl border bg-gray-50"
                        >
                        <img
                            src={imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover"
                        />
                        </button>
                    ) : (
                        <div className="flex h-[70px] w-[100px] items-center justify-center rounded-xl border bg-gray-50 text-xs text-gray-400">
                        No Img
                        </div>
                    )}
                    </div>

                    <div>
                    <div className="font-semibold text-gray-900">{item.title}</div>
                    <div className="break-all text-xs text-gray-500">
                        {item.image_file || "-"}
                    </div>
                    </div>

                    <div>
                    {item.is_active ? (
                        <span className="inline-flex rounded-full border border-green-600 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                        Aktif
                        </span>
                    ) : (
                        <span className="inline-flex rounded-full border border-gray-300 bg-gray-50 px-2 py-1 text-xs font-semibold text-gray-500">
                        Inactive
                        </span>
                    )}
                    </div>

                    <div className="flex justify-end gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewItem(item)}
                    >
                        Preview
                    </Button>

                    {!item.is_active ? (
                        <Button
                        size="sm"
                        onClick={() => handleActivate(item)}
                        disabled={activatingId === item.id}
                        >
                        <CheckCircle2 className="mr-1 size-4" />
                        Aktifkan
                        </Button>
                    ) : null}

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                    >
                        <Pencil className="size-4" />
                    </Button>

                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(item)}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                    </div>
                </div>
                );
            })}
            </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
            side="right"
            className="w-full overflow-y-auto rounded-l-2xl bg-white sm:max-w-[680px]"
            >
            <SheetHeader className="pb-5">
                <SheetTitle>
                {selectedItem ? "Edit Splash Banner" : "Tambah Splash Banner"}
                </SheetTitle>
            </SheetHeader>

            <div className="pb-6">
                <BannerForm
                mode={selectedItem ? "edit" : "create"}
                scopeType="GLOBAL"
                bprId=""
                nextOrder={selectedItem ? selectedItem.urutan : nextOrder}
                initialData={selectedItem}
                submitting={submitting}
                forcedBannerType="SPLASH"
                forcedIsActive={selectedItem ? undefined : false}
                hideOrderInput
                onSubmit={async (values) => {
                    await onSubmit(
                    {
                        ...values,
                        scope_type: "GLOBAL",
                        bpr_id: "",
                        banner_type: "SPLASH",
                        urutan: selectedItem?.urutan || 1,
                        is_active: selectedItem ? values.is_active : false,
                    },
                    selectedItem
                    );

                    setSheetOpen(false);
                    setSelectedItem(null);
                }}
                onCancel={() => {
                    setSheetOpen(false);
                    setSelectedItem(null);
                }}
                />
            </div>
            </SheetContent>
      </Sheet>

      <BannerPreviewDialog
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
}