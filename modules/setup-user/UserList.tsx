"use client";

import {
  KeyRound,
  LockOpen,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PermissionButton from "@/components/auth/PermissionButton";
import { PERMISSIONS } from "@/lib/auth/permissions";
import type { DashboardUser } from "./types";
import UserFlags from "./UserFlags";
import { isUserLocked } from "./utils";

type Props = {
  users: DashboardUser[];
  query: string;
  loading: boolean;
  canUnlock: boolean;
  onQueryChange: (value: string) => void;
  onRefresh: () => void;
  onCreate: () => void;
  onEdit: (user: DashboardUser) => void;
  onAccess: (user: DashboardUser) => void;
  onResetPassword: (user: DashboardUser) => void;
  onDelete: (user: DashboardUser) => void;
  onUnlock: (user: DashboardUser) => void;
};

export default function UserList({
  users,
  query,
  loading,
  canUnlock,
  onQueryChange,
  onRefresh,
  onCreate,
  onEdit,
  onAccess,
  onResetPassword,
  onDelete,
  onUnlock,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Daftar User</h2>
          <p className="text-sm text-gray-500">
            {users.length} user ditampilkan
          </p>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <div className="relative min-w-0 md:min-w-[320px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Cari username / nama / role..."
              className="pl-9"
            />
          </div>

          <Button variant="outline" onClick={onRefresh} disabled={loading}>
            <RefreshCcw className="mr-2 size-4" />
            Refresh
          </Button>

          <PermissionButton permission={PERMISSIONS.SETUP_USER_SAVE} onClick={onCreate}>
            <Plus className="mr-2 size-4" />
            User Baru
          </PermissionButton>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Nama / Kontak</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Flag Akun</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Memuat user...
                </td>
              </tr>
            ) : users.length ? (
              users.map((user) => (
                <tr key={user.id} className="align-top">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {user.username}
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{user.full_name}</div>
                    <div className="text-xs text-gray-500">{user.email || "-"}</div>
                    <div className="text-xs text-gray-500">{user.phone || "-"}</div>
                  </td>

                  <td className="px-4 py-3">{user.role_name || "-"}</td>

                  <td className="px-4 py-3">
                    <UserFlags user={user} />
                    {user.locked_reason ? (
                      <div className="mt-2 text-xs text-red-600">
                        {user.locked_reason}
                      </div>
                    ) : null}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-2">
                      <PermissionButton
                        permission={PERMISSIONS.SETUP_USER_SAVE}
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(user)}
                      >
                        <Pencil className="mr-1 size-4" />
                        Edit
                      </PermissionButton>

                      <PermissionButton
                        permission={PERMISSIONS.SETUP_USER_MANAGE_ACCESS}
                        size="sm"
                        variant="outline"
                        onClick={() => onAccess(user)}
                      >
                        <ShieldCheck className="mr-1 size-4" />
                        Akses
                      </PermissionButton>

                      <PermissionButton
                        permission={PERMISSIONS.SETUP_USER_RESET_PASSWORD}
                        size="sm"
                        variant="outline"
                        onClick={() => onResetPassword(user)}
                      >
                        <KeyRound className="size-4" />
                      </PermissionButton>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!canUnlock || !isUserLocked(user)}
                        onClick={() => onUnlock(user)}
                        title={
                          !canUnlock
                            ? "Tidak punya akses buka blokir"
                            : !isUserLocked(user)
                              ? "User tidak sedang terblokir"
                              : "Buka blokir user"
                        }
                      >
                        <LockOpen className="size-4" />
                      </Button>

                      <PermissionButton
                        permission={PERMISSIONS.SETUP_USER_DELETE}
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(user)}
                      >
                        <Trash2 className="size-4" />
                      </PermissionButton>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  User tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}