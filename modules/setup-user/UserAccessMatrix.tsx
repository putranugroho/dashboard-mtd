"use client";

import { ArrowLeft, Save, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import PermissionButton from "@/components/auth/PermissionButton";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { AccessGroup, DashboardUser } from "./types";
import { actionLabels } from "./constants";

type Props = {
  user: DashboardUser | null;
  groups: AccessGroup[];
  loading: boolean;
  submitting: boolean;
  selectedPermissions: Set<string>;
  onBack: () => void;
  onTogglePermission: (permission: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onSave: () => void;
};

export default function UserAccessMatrix({
  user,
  groups,
  loading,
  submitting,
  selectedPermissions,
  onBack,
  onTogglePermission,
  onSelectAll,
  onClearAll,
  onSave,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <ShieldCheck className="size-5 text-green-600" />
            Akses User
          </h2>
          <p className="text-sm text-gray-500">
            {user
              ? `User: ${user.username} - ${user.full_name}`
              : "Pilih user terlebih dahulu."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 size-4" />
            Kembali
          </Button>

          <PermissionButton
            permission={PERMISSIONS.SETUP_USER_MANAGE_ACCESS}
            type="button"
            variant="outline"
            onClick={onSelectAll}
            disabled={!user || loading}
          >
            Pilih Semua
          </PermissionButton>

          <PermissionButton
            permission={PERMISSIONS.SETUP_USER_MANAGE_ACCESS}
            type="button"
            variant="outline"
            onClick={onClearAll}
            disabled={!user || loading}
          >
            Hapus Semua
          </PermissionButton>

          <PermissionButton
            permission={PERMISSIONS.SETUP_USER_MANAGE_ACCESS}
            onClick={onSave}
            disabled={!user || loading || submitting}
          >
            <Save className="mr-2 size-4" />
            {submitting ? "Menyimpan..." : "Simpan Akses"}
          </PermissionButton>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-gray-500">
          Memuat matrix akses...
        </div>
      ) : groups.length ? (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Menu</th>
                <th className="px-4 py-3 text-left">Submenu</th>
                <th className="px-4 py-3 text-left">Akses Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {groups.map((group) => (
                <tr key={group.key} className="align-top">
                  <td className="px-4 py-3 font-medium">{group.menu}</td>
                  <td className="px-4 py-3">{group.submenu}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => {
                        const checked = selectedPermissions.has(item.permission_code);

                        return (
                          <label
                            key={item.permission_code}
                            className={
                              checked
                                ? "flex cursor-pointer items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                                : "flex cursor-pointer items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-gray-600"
                            }
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={!user || submitting}
                              onChange={() => onTogglePermission(item.permission_code)}
                            />
                            {actionLabels[item.action_code] || item.action_code}
                          </label>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-gray-500">
          Data master fasilitas belum tersedia. Jalankan seed `mst_dashboard_facility` terlebih dahulu.
        </div>
      )}
    </div>
  );
}