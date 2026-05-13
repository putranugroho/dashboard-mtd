"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, KeyRound, LockKeyhole, Pencil, Plus, RefreshCcw, Save, Search, ShieldCheck, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PermissionButton from "@/components/auth/PermissionButton";
import { PERMISSIONS } from "@/lib/auth/permissions";
import {
  createDashboardUser,
  deleteDashboardUser,
  DashboardUser,
  DashboardUserFormValues,
  getDashboardUsers,
  resetDashboardUserPassword,
  updateDashboardUser,
} from "@/lib/api/dashboard-user";
import {
  DashboardUserAccessItem,
  getDashboardUserAccess,
  saveDashboardUserAccess,
} from "@/lib/api/dashboard-user-access";

type FormState = DashboardUserFormValues & { id?: number };
type ViewMode = "list" | "create" | "edit" | "access";

const emptyForm: FormState = {
  username: "",
  password: "",
  full_name: "",
  email: "",
  phone: "",
  role_name: "",
  is_super_admin: false,
  is_active: true,
};

const actionLabels: Record<string, string> = {
  view: "View",
  save: "Insert / Update",
  delete: "Delete",
  relasi: "Relasi",
  detail: "Detail",
  export: "Export Excel",
  search: "Search / Cari",
  check: "Check Status",
  activate: "Activate",
  preview: "Preview",
  reset_password: "Reset Password",
  manage_access: "Manage Access",
  sign: "Sign In / Sign Off",
};

function toBool(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

export default function SetupUserPage() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<DashboardUser | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [access, setAccess] = useState<DashboardUserAccessItem[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAccess, setLoadingAccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [accessSubmitting, setAccessSubmitting] = useState(false);

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

  const loadAccess = async (user: DashboardUser) => {
    try {
      setLoadingAccess(true);
      const result = await getDashboardUserAccess(user.id);
      setAccess(result);
      setSelectedPermissions(
        new Set(result.filter((item) => toBool(item.flag)).map((item) => item.permission_code))
      );
    } catch (error) {
      console.error(error);
      setAccess([]);
      setSelectedPermissions(new Set());
      window.alert(error instanceof Error ? error.message : "Gagal memuat akses user");
    } finally {
      setLoadingAccess(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return users;

    return users.filter((item) =>
      [item.username, item.full_name, item.email, item.role_name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [users, query]);

  const groupedAccess = useMemo(() => {
    const groups = new Map<string, DashboardUserAccessItem[]>();

    for (const item of access) {
      const key = `${item.menu}::${item.submenu}::${item.menu_code}`;
      const current = groups.get(key) ?? [];
      current.push(item);
      groups.set(key, current);
    }

    return Array.from(groups.entries()).map(([key, items]) => {
      const [menu, submenu, menuCode] = key.split("::");
      return {
        key,
        menu,
        submenu,
        menuCode,
        items: items.sort((a, b) => a.action_code.localeCompare(b.action_code)),
      };
    });
  }, [access]);

  const backToList = async () => {
    setViewMode("list");
    setSelectedUser(null);
    setForm(emptyForm);
    setAccess([]);
    setSelectedPermissions(new Set());
    await loadUsers();
  };

  const openCreate = () => {
    setSelectedUser(null);
    setForm(emptyForm);
    setViewMode("create");
  };

  const openEdit = (user: DashboardUser) => {
    setSelectedUser(user);
    setForm({
      id: user.id,
      username: user.username,
      full_name: user.full_name,
      email: user.email || "",
      phone: user.phone || "",
      role_name: user.role_name || "",
      password: "",
      is_super_admin: Boolean(user.is_super_admin),
      is_active: user.is_active !== false,
    });
    setViewMode("edit");
  };

  const openAccess = async (user: DashboardUser) => {
    setSelectedUser(user);
    setViewMode("access");
    await loadAccess(user);
  };

  const handleSubmitUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.username.trim()) return window.alert("Username wajib diisi.");
    if (!form.full_name.trim()) return window.alert("Nama lengkap wajib diisi.");
    if (!form.id && !form.password?.trim()) return window.alert("Password wajib diisi untuk user baru.");

    try {
      setSubmitting(true);
      const payload: DashboardUserFormValues = {
        username: form.username.trim().toUpperCase(),
        password: form.password?.trim() || undefined,
        full_name: form.full_name.trim(),
        email: form.email?.trim(),
        phone: form.phone?.trim(),
        role_name: form.role_name?.trim(),
        is_super_admin: Boolean(form.is_super_admin),
        is_active: Boolean(form.is_active),
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

  const handleDeleteUser = async (user: DashboardUser) => {
    if (!window.confirm(`Yakin ingin menonaktifkan user ${user.username}?`)) return;

    try {
      await deleteDashboardUser(user.id);
      await loadUsers();
      window.alert("User berhasil dinonaktifkan.");
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Gagal menonaktifkan user");
    }
  };

  const handleResetPassword = async (user: DashboardUser) => {
    const password = window.prompt(`Password baru untuk ${user.username}`);
    if (!password) return;

    try {
      await resetDashboardUserPassword(user.id, password);
      window.alert("Password berhasil direset.");
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Gagal reset password");
    }
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(permission)) next.delete(permission);
      else next.add(permission);
      return next;
    });
  };

  const handleSaveAccess = async () => {
    if (!selectedUser) return;

    try {
      setAccessSubmitting(true);
      await saveDashboardUserAccess(selectedUser.id, Array.from(selectedPermissions));
      await loadAccess(selectedUser);
      window.alert("Akses user berhasil disimpan.");
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Gagal menyimpan akses user");
    } finally {
      setAccessSubmitting(false);
    }
  };

  const renderList = () => (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Daftar User</h2>
          <p className="text-sm text-gray-500">{filteredUsers.length} user ditampilkan</p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="relative min-w-[300px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari username / nama / role..." className="pl-9" />
          </div>
          <Button variant="outline" onClick={loadUsers} disabled={loadingUsers}>
            <RefreshCcw className="mr-2 size-4" />
            Refresh
          </Button>
          <PermissionButton permission={PERMISSIONS.SETUP_USER_SAVE} onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            User Baru
          </PermissionButton>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingUsers ? (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-gray-500">Memuat user...</TableCell></TableRow>
            ) : filteredUsers.length ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.full_name}<div className="text-xs text-gray-500">{user.email || "-"}</div></TableCell>
                  <TableCell>{user.role_name || "-"}</TableCell>
                  <TableCell>
                    <span className={user.is_active === false ? "text-red-600" : "text-green-600"}>{user.is_active === false ? "Nonaktif" : "Aktif"}</span>
                    {user.is_super_admin ? <div className="text-xs text-amber-600">Super Admin</div> : null}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap justify-end gap-2">
                      <PermissionButton permission={PERMISSIONS.SETUP_USER_SAVE} size="sm" variant="outline" onClick={() => openEdit(user)}>
                        <Pencil className="mr-1 size-4" /> Edit
                      </PermissionButton>
                      <PermissionButton permission={PERMISSIONS.SETUP_USER_MANAGE_ACCESS} size="sm" variant="outline" onClick={() => openAccess(user)}>
                        <ShieldCheck className="mr-1 size-4" /> Akses
                      </PermissionButton>
                      <PermissionButton permission={PERMISSIONS.SETUP_USER_RESET_PASSWORD} size="sm" variant="outline" onClick={() => handleResetPassword(user)}>
                        <KeyRound className="size-4" />
                      </PermissionButton>
                      <PermissionButton permission={PERMISSIONS.SETUP_USER_DELETE} size="sm" variant="destructive" onClick={() => handleDeleteUser(user)}>
                        <Trash2 className="size-4" />
                      </PermissionButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-gray-500">User tidak ditemukan.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmitUser} className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{viewMode === "edit" ? "Edit User" : "Tambah User"}</h2>
          <p className="text-sm text-gray-500">Password hanya wajib saat membuat user baru.</p>
        </div>
        <Button type="button" variant="outline" onClick={backToList}><ArrowLeft className="mr-2 size-4" /> Kembali</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1 text-sm"><span className="font-medium text-gray-700">Username</span><Input value={form.username} onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value.toUpperCase() }))} placeholder="ADMIN" disabled={Boolean(form.id)} /></label>
        <label className="space-y-1 text-sm"><span className="font-medium text-gray-700">Password</span><Input value={form.password || ""} onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))} type="password" placeholder={form.id ? "Kosongkan jika tidak diubah" : "Password"} /></label>
        <label className="space-y-1 text-sm"><span className="font-medium text-gray-700">Nama Lengkap</span><Input value={form.full_name} onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))} placeholder="Administrator" /></label>
        <label className="space-y-1 text-sm"><span className="font-medium text-gray-700">Role</span><Input value={form.role_name || ""} onChange={(event) => setForm((prev) => ({ ...prev, role_name: event.target.value }))} placeholder="ADMIN" /></label>
        <label className="space-y-1 text-sm"><span className="font-medium text-gray-700">Email</span><Input value={form.email || ""} onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="admin@mtd.co.id" /></label>
        <label className="space-y-1 text-sm"><span className="font-medium text-gray-700">No HP</span><Input value={form.phone || ""} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="08xxxxxxxxxx" /></label>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={Boolean(form.is_active)} onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))} /> User aktif</label>
        <label className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={Boolean(form.is_super_admin)} onChange={(event) => setForm((prev) => ({ ...prev, is_super_admin: event.target.checked }))} /> Super admin / bypass permission</label>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={backToList}>Batal</Button>
        <PermissionButton permission={PERMISSIONS.SETUP_USER_SAVE} type="submit" disabled={submitting}>
          <Save className="mr-2 size-4" /> {submitting ? "Menyimpan..." : "Simpan User"}
        </PermissionButton>
      </div>
    </form>
  );

  const renderAccess = () => (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900"><ShieldCheck className="size-5 text-green-600" /> Akses User</h2>
          <p className="text-sm text-gray-500">{selectedUser ? `User: ${selectedUser.username} - ${selectedUser.full_name}` : "Pilih user terlebih dahulu."}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={backToList}><ArrowLeft className="mr-2 size-4" /> Kembali</Button>
          <PermissionButton permission={PERMISSIONS.SETUP_USER_MANAGE_ACCESS} type="button" variant="outline" onClick={() => setSelectedPermissions(new Set(access.map((item) => item.permission_code)))} disabled={!selectedUser || loadingAccess}>Pilih Semua</PermissionButton>
          <PermissionButton permission={PERMISSIONS.SETUP_USER_MANAGE_ACCESS} type="button" variant="outline" onClick={() => setSelectedPermissions(new Set())} disabled={!selectedUser || loadingAccess}>Hapus Semua</PermissionButton>
          <PermissionButton permission={PERMISSIONS.SETUP_USER_MANAGE_ACCESS} onClick={handleSaveAccess} disabled={!selectedUser || loadingAccess || accessSubmitting}>
            <Save className="mr-2 size-4" /> {accessSubmitting ? "Menyimpan..." : "Simpan Akses"}
          </PermissionButton>
        </div>
      </div>

      {loadingAccess ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-gray-500">Memuat matrix akses...</div>
      ) : groupedAccess.length ? (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Menu</TableHead><TableHead>Submenu</TableHead><TableHead>Akses Action</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {groupedAccess.map((group) => (
                <TableRow key={group.key}>
                  <TableCell className="font-medium">{group.menu}</TableCell>
                  <TableCell>{group.submenu}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => {
                        const checked = selectedPermissions.has(item.permission_code);
                        return (
                          <label key={item.permission_code} className={checked ? "flex cursor-pointer items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700" : "flex cursor-pointer items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs text-gray-600"}>
                            <input type="checkbox" checked={checked} disabled={!selectedUser || accessSubmitting} onChange={() => togglePermission(item.permission_code)} />
                            {actionLabels[item.action_code] || item.action_code}
                          </label>
                        );
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-gray-500">Data master fasilitas belum tersedia. Jalankan seed `mst_dashboard_facility` terlebih dahulu.</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Setup User</h1>
            <p className="mt-1 text-sm text-gray-500">Kelola user login Dashboard MTD dan akses fasilitas berbasis action-level.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-600"><LockKeyhole className="size-4" /> Action permission aktif untuk sidebar dan tombol.</div>
        </div>
      </div>

      {viewMode === "list" ? renderList() : null}
      {viewMode === "create" || viewMode === "edit" ? renderForm() : null}
      {viewMode === "access" ? renderAccess() : null}
    </div>
  );
}
