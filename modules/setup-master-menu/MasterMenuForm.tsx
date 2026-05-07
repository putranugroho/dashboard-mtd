"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MasterMenuFormValues, MasterMenuItem } from "./types";

type Props = {
  initialData?: MasterMenuItem | null;
  submitting?: boolean;
  onSubmit: (values: MasterMenuFormValues) => Promise<void> | void;
  onCancel: () => void;
};

const DEFAULT_USERLOGIN = process.env.NEXT_PUBLIC_DEFAULT_USERLOGIN || "admin";

const emptyForm: MasterMenuFormValues = {
  modul: "CMS",
  menu: "",
  submenu: "",
  subsubmenu: "",
  urut: 1,
  is_active: true,
  userlogin: DEFAULT_USERLOGIN,
};

export default function MasterMenuForm({
  initialData,
  submitting = false,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<MasterMenuFormValues>(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        modul: initialData.modul || "CMS",
        menu: initialData.menu || "",
        submenu: initialData.submenu || "",
        subsubmenu: initialData.subsubmenu || "",
        urut: Number(initialData.urut || 1),
        is_active: Boolean(initialData.is_active),
        userlogin: DEFAULT_USERLOGIN,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!form.modul.trim()) {
      window.alert("Modul wajib diisi.");
      return;
    }

    if (!form.menu.trim()) {
      window.alert("Menu wajib diisi.");
      return;
    }

    if (!form.submenu.trim()) {
      window.alert("Submenu wajib diisi.");
      return;
    }

    if (!form.urut || form.urut < 1) {
      window.alert("Urut minimal 1.");
      return;
    }

    await onSubmit({
      ...form,
      modul: form.modul.trim().toUpperCase(),
      menu: form.menu.trim().toUpperCase(),
      submenu: form.submenu.trim().toUpperCase(),
      subsubmenu: form.subsubmenu.trim().toUpperCase(),
      urut: Number(form.urut),
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-gray-50 p-4">
        <p className="text-base font-semibold text-gray-900">
          {initialData ? "Edit Master Menu" : "Tambah Master Menu"}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Data ini akan digunakan oleh CMS-IBPR melalui endpoint master_menu middleware.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Modul</label>
          <Input
            value={form.modul}
            onChange={(e) => setForm((prev) => ({ ...prev, modul: e.target.value }))}
            placeholder="CMS"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Urut</label>
          <Input
            type="number"
            min={1}
            value={form.urut}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                urut: Number(e.target.value || 1),
              }))
            }
            placeholder="1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Menu</label>
        <Input
          value={form.menu}
          onChange={(e) => setForm((prev) => ({ ...prev, menu: e.target.value }))}
          placeholder="SETUP / AKUN / MPIN / LAPORAN"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Submenu</label>
        <Input
          value={form.submenu}
          onChange={(e) => setForm((prev) => ({ ...prev, submenu: e.target.value }))}
          placeholder="USER ACCESS"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Sub Submenu</label>
        <Input
          value={form.subsubmenu}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, subsubmenu: e.target.value }))
          }
          placeholder="TAMBAH / UBAH / HAPUS"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl border bg-gray-50 p-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Status Menu</p>
          <p className="text-xs text-gray-500">
            Menu nonaktif tidak akan muncul pada CMS.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
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
        <Button type="button" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Tambah Menu"}
        </Button>
      </div>
    </div>
  );
}