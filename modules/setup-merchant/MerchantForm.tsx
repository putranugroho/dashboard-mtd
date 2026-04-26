"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MerchantFormValues, MerchantItem } from "./types";

type Props = {
  mode: "create" | "edit";
  initialData?: MerchantItem | null;
  onSubmit: (values: MerchantFormValues) => void;
  onCancel: () => void;
};

const emptyForm: MerchantFormValues = {
  merchant_id: "",
  nama_merchant: "",
  pic: "",
  no_hp: "",
  is_active: true,
};

export default function MerchantForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<MerchantFormValues>(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        merchant_id: initialData.merchant_id,
        nama_merchant: initialData.nama_merchant,
        pic: initialData.pic,
        no_hp: initialData.no_hp,
        is_active: initialData.is_active,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!form.merchant_id.trim()) {
      window.alert("Merchant ID wajib diisi.");
      return;
    }
    if (!form.nama_merchant.trim()) {
      window.alert("Nama Merchant wajib diisi.");
      return;
    }
    if (!form.pic.trim()) {
      window.alert("PIC wajib diisi.");
      return;
    }
    if (!form.no_hp.trim()) {
      window.alert("No HP wajib diisi.");
      return;
    }

    onSubmit({
      ...form,
      merchant_id: form.merchant_id.trim(),
      nama_merchant: form.nama_merchant.trim(),
      pic: form.pic.trim(),
      no_hp: form.no_hp.trim(),
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Merchant ID</label>
        <Input
          value={form.merchant_id}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, merchant_id: e.target.value }))
          }
          placeholder="Contoh: MRC001"
          disabled={mode === "edit"}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Nama Merchant
        </label>
        <Input
          value={form.nama_merchant}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, nama_merchant: e.target.value }))
          }
          placeholder="Masukkan nama merchant"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">PIC</label>
        <Input
          value={form.pic}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, pic: e.target.value }))
          }
          placeholder="Nama PIC merchant"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">No HP</label>
        <Input
          value={form.no_hp}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, no_hp: e.target.value }))
          }
          placeholder="Contoh: 081234567890"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border bg-gray-50 p-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Status Merchant</p>
          <p className="text-xs text-gray-500">
            Nonaktifkan jika merchant tidak digunakan sementara.
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

        <Button type="button" onClick={handleSubmit}>
          {mode === "edit" ? "Simpan Perubahan" : "Tambah Merchant"}
        </Button>
      </div>
    </div>
  );
}