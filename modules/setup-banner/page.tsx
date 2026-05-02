"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
} from "@/lib/api/banner";
import BannerPreviewDialog from "./BannerPreviewDialog";
import BannerSection from "./BannerSection";
import { BannerFormValues, BannerItem } from "./types";

export default function SetupBannerPage() {
  const [globalBanners, setGlobalBanners] = useState<BannerItem[]>([]);
  const [bprBanners, setBprBanners] = useState<BannerItem[]>([]);
  const [bprId, setBprId] = useState("609999");
  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const [loadingBpr, setLoadingBpr] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewItem, setPreviewItem] = useState<BannerItem | null>(null);

  const loadGlobalBanners = async () => {
    try {
      setLoadingGlobal(true);
      const result = await getBanners({ scopeType: "GLOBAL" });
      setGlobalBanners(result);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal memuat banner global"
      );
    } finally {
      setLoadingGlobal(false);
    }
  };

  const loadBprBanners = async (targetBprId = bprId) => {
    const code = targetBprId.trim();
    if (!code) {
      setBprBanners([]);
      return;
    }

    try {
      setLoadingBpr(true);
      const result = await getBanners({ scopeType: "BPR", bprId: code });
      setBprBanners(result);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal memuat banner khusus BPR"
      );
    } finally {
      setLoadingBpr(false);
    }
  };

  useEffect(() => {
    loadGlobalBanners();
  }, []);

  useEffect(() => {
    loadBprBanners(bprId);
  }, []);

  const handleSubmit = async (
    values: BannerFormValues,
    selectedItem: BannerItem | null
  ) => {
    try {
      setSubmitting(true);

      if (selectedItem) {
        await updateBanner(selectedItem.id, values);
      } else {
        await createBanner(values);
      }

      if (values.scope_type === "GLOBAL") {
        await loadGlobalBanners();
      } else {
        await loadBprBanners(values.bpr_id);
      }

      window.alert(
        selectedItem ? "Banner berhasil diperbarui." : "Banner berhasil ditambahkan."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: BannerItem) => {
    const ok = window.confirm(
      `Yakin ingin menonaktifkan banner "${item.title}"?`
    );
    if (!ok) return;

    try {
      await deleteBanner(item.id);

      if (item.scope_type === "GLOBAL") {
        await loadGlobalBanners();
      } else {
        await loadBprBanners(item.bpr_id);
      }

      window.alert("Banner berhasil dinonaktifkan.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal menonaktifkan banner"
      );
    }
  };

  const bprControl = (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <Input
        value={bprId}
        onChange={(e) => setBprId(e.target.value)}
        placeholder="Masukkan BPR ID"
        className="md:w-[220px]"
      />
      <button
        type="button"
        onClick={() => loadBprBanners(bprId)}
        className="h-10 rounded-md border bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Cari BPR
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Setup Banner</h1>
        <p className="mt-1 text-sm text-gray-500">
          Kelola banner global untuk semua BPR dan banner khusus per BPR. Urutan banner dihitung terpisah: global mulai dari 1, dan setiap BPR juga mulai dari 1.
        </p>
      </div>

      <BannerSection
        title="Upload Global Banner"
        description="Banner global akan tampil untuk seluruh user dari semua BPR."
        scopeType="GLOBAL"
        data={globalBanners}
        loading={loadingGlobal}
        submitting={submitting}
        onRefresh={loadGlobalBanners}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onPreview={setPreviewItem}
      />

      <BannerSection
        title="Upload Khusus BPR Banner"
        description="Banner khusus hanya akan tampil untuk user dengan BPR ID yang sama."
        scopeType="BPR"
        bprId={bprId.trim()}
        data={bprBanners}
        loading={loadingBpr}
        submitting={submitting}
        onRefresh={() => loadBprBanners(bprId)}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onPreview={setPreviewItem}
        rightControl={bprControl}
      />

      <BannerPreviewDialog item={previewItem} onClose={() => setPreviewItem(null)} />
    </div>
  );
}
