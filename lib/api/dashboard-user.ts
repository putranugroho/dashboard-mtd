import { postJson } from "./client";
import { getCurrentUserLogin } from "@/lib/auth/session";

export type DashboardUser = {
  id: number;
  username: string;
  full_name: string;
  email?: string;
  phone?: string;
  role_name?: string;
  is_super_admin?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type DashboardUserFormValues = {
  username: string;
  password?: string;
  full_name: string;
  email?: string;
  phone?: string;
  role_name?: string;
  is_super_admin?: boolean;
  is_active?: boolean;
};

type ApiResponse<T> = {
  code?: string;
  status?: string;
  message?: string;
  data?: T;
};

function normalizeList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: T[] }).data;
  }
  return [];
}

export async function getDashboardUsers() {
  const res = await postJson<ApiResponse<unknown>>("/dashboard_user", {
    action: "list",
    userlogin: getCurrentUserLogin(),
  });

  return normalizeList<DashboardUser>(res.data);
}

export async function createDashboardUser(payload: DashboardUserFormValues) {
  return postJson<ApiResponse<{ id: number }>>("/dashboard_user", {
    action: "insert",
    userlogin: getCurrentUserLogin(),
    ...payload,
  });
}

export async function updateDashboardUser(id: number, payload: DashboardUserFormValues) {
  return postJson<ApiResponse<{ id: number }>>("/dashboard_user", {
    action: "update",
    id,
    userlogin: getCurrentUserLogin(),
    ...payload,
  });
}

export async function deleteDashboardUser(id: number) {
  return postJson<ApiResponse<{ id: number }>>("/dashboard_user", {
    action: "delete",
    id,
    userlogin: getCurrentUserLogin(),
  });
}

export async function resetDashboardUserPassword(id: number, password: string) {
  return postJson<ApiResponse<{ id: number }>>("/dashboard_user", {
    action: "reset_password",
    id,
    password,
    userlogin: getCurrentUserLogin(),
  });
}
