"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { LockKeyhole } from "lucide-react";

import { PERMISSIONS } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import {
  createDashboardUser,
  deleteDashboardUser,
  DashboardUserFormValues,
  getDashboardUsers,
  resetDashboardUserPassword,
  unlockDashboardUser,
  updateDashboardUser,
} from "@/lib/api/dashboard-user";
import {
  getDashboardUserAccess,
  saveDashboardUserAccess,
} from "@/lib/api/dashboard-user-access";

import UserList from "./UserList";
import UserForm from "./UserForm";
import UserAccessMatrix from "./UserAccessMatrix";
import type {
  DashboardUser,
  DashboardUserAccessItem,
  SetupUserFormState,
  SetupUserViewMode,
} from "./types";
import {
  createEmptyUserForm,
  groupAccessItems,
  normalizeUserToForm,
  toBool,
} from "./utils";

export default function SetupUserPage() {
  const { user: sessionUser, can } = useSession();

  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<DashboardUser | null>(null);
  const [viewMode, setViewMode] = useState<SetupUserViewMode>("list");
  const [form, setForm] = useState<SetupUserFormState>(createEmptyUserForm());
  const [access, setAccess] = useState<DashboardUserAccessItem[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  );
  const [query, setQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAccess, setLoadingAccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [accessSubmitting, setAccessSubmitting] = useState(false);

  const canUnlockUser = can(PERMISSIONS.SETUP_USER_UNLOCK);
  const canManageSuperAdmin = Boolean(sessionUser?.is_super_admin);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      setUsers(await getDashboardUsers());
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Gagal memuat user");
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadAccess = async (targetUser: DashboardUser) => {
    try {
      setLoadingAccess(true);

      const result = await getDashboardUserAccess(targetUser.id);

      setAccess(result);
      setSelectedPermissions(
        new Set(
          result
            .filter((item) => toBool(item.flag))
            .map((item) => item.permission_code)
        )
      );
    } catch (error) {
      console.error(error);
      setAccess([]);
      setSelectedPermissions(new Set());
      window.alert(
        error instanceof Error ? error.message : "Gagal memuat akses user"
      );
    } finally {
      setLoadingAccess(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return users;

    return users.filter((item) =>
      [
        item.username,
        item.full_name,
        item.email,
        item.phone,
        item.role_name,
        item.is_active === false ? "nonaktif" : "aktif",
        item.is_locked ? "terblokir" : "normal",
        item.is_super_admin ? "super admin" : "",
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [users, query]);

  const groupedAccess = useMemo(() => groupAccessItems(access), [access]);

  const backToList = async () => {
    setViewMode("list");
    setSelectedUser(null);
    setForm(createEmptyUserForm());
    setAccess([]);
    setSelectedPermissions(new Set());
    await loadUsers();
  };

  const openCreate = () => {
    setSelectedUser(null);
    setForm(createEmptyUserForm());
    setViewMode("create");
  };

  const openEdit = (targetUser: DashboardUser) => {
    setSelectedUser(targetUser);
    setForm(normalizeUserToForm(targetUser));
    setViewMode("edit");
  };

  const openAccess = async (targetUser: DashboardUser) => {
    setSelectedUser(targetUser);
    setViewMode("access");
    await loadAccess(targetUser);
  };

  const handleSubmitUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.username.trim()) {
      window.alert("Username wajib diisi.");
      return;
    }

    if (!form.full_name.trim()) {
      window.alert("Nama lengkap wajib diisi.");
      return;
    }

    if (!form.id && !form.password?.trim()) {
      window.alert("Password wajib diisi untuk user baru.");
      return;
    }

    try {
      setSubmitting(true);

      const payload: DashboardUserFormValues = {
        username: form.username.trim().toUpperCase(),
        password: form.password?.trim() || undefined,
        full_name: form.full_name.trim(),
        email: form.email?.trim(),
        phone: form.phone?.trim(),
        role_name: form.role_name?.trim(),
        is_active: Boolean(form.is_active),
        ...(canManageSuperAdmin
          ? { is_super_admin: Boolean(form.is_super_admin) }
          : {}),
      };

      if (form.id) {
        await updateDashboardUser(form.id, payload);
        window.alert("User berhasil diperbarui.");
      } else {
        await createDashboardUser(payload);
        window.alert("User berhasil ditambahkan.");
      }

      await backToList();
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Gagal menyimpan user");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (targetUser: DashboardUser) => {
    if (!window.confirm(`Yakin ingin menonaktifkan user ${targetUser.username}?`)) {
      return;
    }

    try {
      await deleteDashboardUser(targetUser.id);
      await loadUsers();
      window.alert("User berhasil dinonaktifkan.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal menonaktifkan user"
      );
    }
  };

  const handleResetPassword = async (targetUser: DashboardUser) => {
    const password = window.prompt(`Password baru untuk ${targetUser.username}`);
    if (!password) return;

    try {
      await resetDashboardUserPassword(targetUser.id, password);
      await loadUsers();
      window.alert("Password berhasil direset.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal reset password"
      );
    }
  };

  const handleUnlockUser = async (targetUser: DashboardUser) => {
    const ok = window.confirm(
      `Buka blokir user "${targetUser.username}" dan reset counter salah password?`
    );

    if (!ok) return;

    try {
      await unlockDashboardUser(targetUser.id);
      await loadUsers();
      window.alert("Blokir user berhasil dibuka.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal membuka blokir user"
      );
    }
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);

      if (next.has(permission)) {
        next.delete(permission);
      } else {
        next.add(permission);
      }

      return next;
    });
  };

  const handleSaveAccess = async () => {
    if (!selectedUser) return;

    try {
      setAccessSubmitting(true);

      await saveDashboardUserAccess(
        selectedUser.id,
        Array.from(selectedPermissions)
      );

      await loadAccess(selectedUser);
      window.alert("Akses user berhasil disimpan.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal menyimpan akses user"
      );
    } finally {
      setAccessSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Setup User
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola user login Dashboard MTD, status akun, blokir login, dan akses fasilitas berbasis action-level.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-600">
            <LockKeyhole className="size-4" />
            Lock otomatis setelah 3x salah password.
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <UserList
          users={filteredUsers}
          query={query}
          loading={loadingUsers}
          canUnlock={canUnlockUser}
          onQueryChange={setQuery}
          onRefresh={() => void loadUsers()}
          onCreate={openCreate}
          onEdit={openEdit}
          onAccess={(targetUser) => void openAccess(targetUser)}
          onResetPassword={handleResetPassword}
          onDelete={handleDeleteUser}
          onUnlock={handleUnlockUser}
        />
      ) : null}

      {viewMode === "create" || viewMode === "edit" ? (
        <UserForm
          mode={viewMode}
          form={form}
          submitting={submitting}
          canManageSuperAdmin={canManageSuperAdmin}
          onChange={setForm}
          onSubmit={handleSubmitUser}
          onBack={() => void backToList()}
        />
      ) : null}

      {viewMode === "access" ? (
        <UserAccessMatrix
          user={selectedUser}
          groups={groupedAccess}
          loading={loadingAccess}
          submitting={accessSubmitting}
          selectedPermissions={selectedPermissions}
          onBack={() => void backToList()}
          onTogglePermission={togglePermission}
          onSelectAll={() =>
            setSelectedPermissions(
              new Set(access.map((item) => item.permission_code))
            )
          }
          onClearAll={() => setSelectedPermissions(new Set())}
          onSave={handleSaveAccess}
        />
      ) : null}
    </div>
  );
}