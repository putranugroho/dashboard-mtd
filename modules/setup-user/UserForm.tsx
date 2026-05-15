"use client";

import { FormEvent } from "react";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PermissionButton from "@/components/auth/PermissionButton";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { SetupUserFormState, SetupUserViewMode } from "./types";

type Props = {
  mode: SetupUserViewMode;
  form: SetupUserFormState;
  submitting: boolean;
  canManageSuperAdmin: boolean;
  onChange: (form: SetupUserFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
};

export default function UserForm({
  mode,
  form,
  submitting,
  canManageSuperAdmin,
  onChange,
  onSubmit,
  onBack,
}: Props) {
  const isEdit = mode === "edit";

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit User" : "Tambah User"}
          </h2>
          <p className="text-sm text-gray-500">
            Password hanya wajib saat membuat user baru.
          </p>
        </div>

        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 size-4" />
          Kembali
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700">Username</span>
          <Input
            value={form.username}
            onChange={(event) =>
              onChange({ ...form, username: event.target.value.toUpperCase() })
            }
            placeholder="ADMIN"
            disabled={Boolean(form.id)}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700">Password</span>
          <Input
            value={form.password || ""}
            onChange={(event) => onChange({ ...form, password: event.target.value })}
            type="password"
            placeholder={form.id ? "Kosongkan jika tidak diubah" : "Password"}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700">Nama Lengkap</span>
          <Input
            value={form.full_name}
            onChange={(event) => onChange({ ...form, full_name: event.target.value })}
            placeholder="Administrator"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700">Role</span>
          <Input
            value={form.role_name || ""}
            onChange={(event) => onChange({ ...form, role_name: event.target.value })}
            placeholder="ADMIN"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700">Email</span>
          <Input
            value={form.email || ""}
            onChange={(event) => onChange({ ...form, email: event.target.value })}
            placeholder="admin@mtd.co.id"
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="font-medium text-gray-700">No HP</span>
          <Input
            value={form.phone || ""}
            onChange={(event) => onChange({ ...form, phone: event.target.value })}
            placeholder="08xxxxxxxxxx"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="flex items-center gap-2 rounded-xl border p-3 text-sm">
          <input
            type="checkbox"
            checked={Boolean(form.is_active)}
            onChange={(event) =>
              onChange({ ...form, is_active: event.target.checked })
            }
          />
          User aktif
        </label>

        {canManageSuperAdmin ? (
          <label className="flex items-center gap-2 rounded-xl border p-3 text-sm">
            <input
              type="checkbox"
              checked={Boolean(form.is_super_admin)}
              onChange={(event) =>
                onChange({ ...form, is_super_admin: event.target.checked })
              }
            />
            Super admin / bypass permission
          </label>
        ) : null}
      </div>

      {!canManageSuperAdmin ? (
        <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Checkbox Super Admin hanya dapat dilihat dan diubah oleh user Super Admin.
        </div>
      ) : null}

      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Batal
        </Button>

        <PermissionButton
          permission={PERMISSIONS.SETUP_USER_SAVE}
          type="submit"
          disabled={submitting}
        >
          <Save className="mr-2 size-4" />
          {submitting ? "Menyimpan..." : "Simpan User"}
        </PermissionButton>
      </div>
    </form>
  );
}