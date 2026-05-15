import type { SetupUserFormState } from "./types";

export const emptyUserForm: SetupUserFormState = {
  username: "",
  password: "",
  full_name: "",
  email: "",
  phone: "",
  role_name: "",
  is_super_admin: false,
  is_active: true,
};

export const actionLabels: Record<string, string> = {
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
  unlock: "Buka Blokir",
  sign: "Sign In / Sign Off",
};