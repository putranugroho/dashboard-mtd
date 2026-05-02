"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TcodeFormValues, TcodeItem } from "./types";

type Props = {
  mode: "create" | "edit";
  initialData?: TcodeItem | null;
  onSubmit: (values: TcodeFormValues) => void;
  onCancel?: () => void;
};

const initialForm: TcodeFormValues = {
  tcode: "",
  keterangan: "",
  description: "",
  is_active: true,
};

export default function TcodeForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<TcodeFormValues>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        tcode: initialData.tcode ?? "",
        keterangan: initialData.keterangan ?? "",
        description: initialData.description ?? "",
        is_active: initialData.is_active ?? true,
      });
      setErrors({});
      return;
    }

    setForm(initialForm);
    setErrors({});
  }, [initialData]);

  const handleChange = (
    field: keyof TcodeFormValues,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.tcode.trim()) {
      nextErrors.tcode = "Kode transaksi wajib diisi";
    } else if (!/^\d+$/.test(form.tcode.trim())) {
      nextErrors.tcode = "Kode transaksi harus berupa angka";
    }

    if (!form.keterangan.trim()) {
      nextErrors.keterangan = "Keterangan wajib diisi";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      tcode: form.tcode.trim(),
      keterangan: form.keterangan.trim(),
      description: form.description.trim(),
      is_active: form.is_active,
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-2">
        <Label htmlFor="tcode">Kode Transaksi</Label>
        <Input
          id="tcode"
          placeholder="Contoh: 5000"
          value={form.tcode}
          disabled={mode === "edit"}
          readOnly={mode === "edit"}
          onChange={(e) => handleChange("tcode", e.target.value)}
        />

        {mode === "edit" && (
          <p className="text-xs text-amber-600">
            Kode TCode dikunci karena dipakai sebagai key relasi journal, BPR, CMS-IBPR,
            dan rekonsiliasi.
          </p>
        )}
        {errors.tcode && (
          <p className="text-xs text-red-500">{errors.tcode}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="keterangan">Keterangan</Label>
        <Input
          id="keterangan"
          placeholder="Contoh: PPOB"
          value={form.keterangan}
          onChange={(e) => handleChange("keterangan", e.target.value)}
        />
        {errors.keterangan && (
          <p className="text-xs text-red-500">{errors.keterangan}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          placeholder="Deskripsi tambahan TCode"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="min-h-[110px]"
        />
      </div>

      <div className="grid gap-2">
        <Label>Status</Label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleChange("is_active", true)}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              form.is_active
                ? "border-green-600 bg-green-50 text-green-700"
                : "border-gray-200 bg-white text-gray-600"
            }`}
          >
            Active
          </button>

          <button
            type="button"
            onClick={() => handleChange("is_active", false)}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              !form.is_active
                ? "border-red-600 bg-red-50 text-red-700"
                : "border-gray-200 bg-white text-gray-600"
            }`}
          >
            Inactive
          </button>

          <Badge variant={form.is_active ? "default" : "outline"}>
            {form.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button onClick={handleSubmit}>
          {mode === "create" ? "Simpan TCode" : "Update TCode"}
        </Button>
      </div>
    </div>
  );
}