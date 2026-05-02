"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BannerFormValues, BannerItem, BannerScopeType, BannerType } from "./types";
import { uploadBannerAsset } from "@/lib/api/banner";

type Props = {
  mode: "create" | "edit";
  scopeType: BannerScopeType;
  bprId?: string;
  nextOrder: number;
  initialData?: BannerItem | null;
  submitting?: boolean;
  onSubmit: (values: BannerFormValues) => Promise<void> | void;
  onCancel: () => void;
};

const emptyForm = (
  scopeType: BannerScopeType,
  bprId: string,
  nextOrder: number
): BannerFormValues => ({
  scope_type: scopeType,
  bpr_id: scopeType === "BPR" ? bprId : "",
  banner_type: "IMAGE",
  title: "",
  description: "",
  image_file: "",
  video_file: "",
  text_content: "",
  urutan: nextOrder,
  is_active: true,
});

export default function BannerForm({
  mode,
  scopeType,
  bprId = "",
  nextOrder,
  initialData,
  submitting,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<BannerFormValues>(
    emptyForm(scopeType, bprId, nextOrder)
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        scope_type: initialData.scope_type,
        bpr_id: initialData.bpr_id || "",
        banner_type: initialData.banner_type,
        title: initialData.title || "",
        description: initialData.description || "",
        image_file: initialData.image_file || "",
        video_file: initialData.video_file || "",
        text_content: initialData.text_content || "",
        urutan: Number(initialData.urutan || nextOrder),
        is_active: Boolean(initialData.is_active),
      });
    } else {
      setForm(emptyForm(scopeType, bprId, nextOrder));
    }

    setImageFile(null);
    setVideoFile(null);
  }, [initialData, scopeType, bprId, nextOrder]);

  const title = useMemo(() => {
    if (scopeType === "GLOBAL") return "Banner Global";
    return `Banner Khusus BPR ${bprId || "-"}`;
  }, [scopeType, bprId]);

  const handleSubmit = async () => {
    if (scopeType === "BPR" && !form.bpr_id.trim()) {
      window.alert("BPR ID wajib diisi untuk banner khusus BPR.");
      return;
    }

    if (!form.title.trim()) {
      window.alert("Title banner wajib diisi.");
      return;
    }

    if (!form.urutan || form.urutan < 1) {
      window.alert("Urutan banner minimal 1.");
      return;
    }

    if (!form.image_file && !imageFile) {
      window.alert("Image banner wajib diupload.");
      return;
    }

    if (form.banner_type === "VIDEO" && !form.video_file && !videoFile) {
      window.alert("File video wajib diupload untuk banner jenis Video.");
      return;
    }

    if (form.banner_type === "TEXT" && !form.text_content.trim()) {
      window.alert("Text informasi wajib diisi untuk banner jenis Text.");
      return;
    }

    try {
      setUploading(true);

      let nextImageFile = form.image_file;
      let nextVideoFile = form.video_file;

      if (imageFile) {
        const uploadedImage = await uploadBannerAsset("image", imageFile);
        nextImageFile = uploadedImage.file_name;
      }

      if (form.banner_type === "VIDEO" && videoFile) {
        const uploadedVideo = await uploadBannerAsset("video", videoFile);
        nextVideoFile = uploadedVideo.file_name;
      }

      await onSubmit({
        ...form,
        scope_type: scopeType,
        bpr_id: scopeType === "BPR" ? form.bpr_id.trim() : "",
        title: form.title.trim(),
        description: form.description.trim(),
        image_file: nextImageFile,
        video_file: form.banner_type === "VIDEO" ? nextVideoFile : "",
        text_content: form.banner_type === "TEXT" ? form.text_content.trim() : "",
        urutan: Number(form.urutan || 1),
      });
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal menyimpan banner"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-gray-50 p-4">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-xs text-gray-500">
          Urutan otomatis dimulai dari 1 dan mengikuti jumlah banner pada section ini.
        </p>
      </div>

      {scopeType === "BPR" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">BPR ID</label>
          <Input
            value={form.bpr_id}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, bpr_id: e.target.value }))
            }
            placeholder="Contoh: 609999"
            disabled={mode === "edit"}
          />
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Jenis Banner</label>
          <select
            value={form.banner_type}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                banner_type: e.target.value as BannerType,
              }))
            }
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Video</option>
            <option value="TEXT">Text</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Urutan</label>
          <Input
            type="number"
            min={1}
            value={form.urutan}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, urutan: Number(e.target.value) }))
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Title</label>
        <Input
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Masukkan judul banner"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <Textarea
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Deskripsi singkat banner"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Upload Image Banner / Thumbnail
        </label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />
        <p className="text-xs text-gray-500">
          File saat ini: {imageFile?.name || form.image_file || "Belum ada"}
        </p>
      </div>

      {form.banner_type === "VIDEO" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Upload Video</label>
          <Input
            type="file"
            accept="video/mp4,video/webm,video/quicktime,.m4v"
            onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-gray-500">
            File saat ini: {videoFile?.name || form.video_file || "Belum ada"}
          </p>
        </div>
      ) : null}

      {form.banner_type === "TEXT" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Text Informasi</label>
          <Textarea
            className="min-h-[140px]"
            value={form.text_content}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, text_content: e.target.value }))
            }
            placeholder="Masukkan informasi yang ingin ditampilkan saat banner diklik"
          />
        </div>
      ) : null}

      <div className="flex items-center justify-between rounded-xl border bg-gray-50 p-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Status Banner</p>
          <p className="text-xs text-gray-500">
            Banner nonaktif tidak muncul pada aplikasi user.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setForm((prev) => ({ ...prev, is_active: !prev.is_active }))
          }
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            form.is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {form.is_active ? "Aktif" : "Nonaktif"}
        </button>
      </div>

      <div className="flex justify-end gap-3 border-t pt-5">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={uploading || submitting}>
          {uploading || submitting
            ? "Menyimpan..."
            : mode === "edit"
              ? "Simpan Perubahan"
              : "Tambah Banner"}
        </Button>
      </div>
    </div>
  );
}
