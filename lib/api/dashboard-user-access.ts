import { postJson } from "./client";
import { getCurrentUserLogin } from "@/lib/auth/session";

export type DashboardUserAccessItem = {
  id: number;
  user_id?: number;
  facility_id?: number;
  modul: string;
  menu: string;
  submenu: string;
  subsubmenu?: string;
  menu_code: string;
  action_code: string;
  permission_code: string;
  route_path?: string;
  flag: boolean;
  is_menu?: boolean;
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

export async function getDashboardUserAccess(userId: number) {
  const res = await postJson<ApiResponse<unknown>>("/dashboard_user_access", {
    action: "get_by_user",
    user_id: userId,
    userlogin: getCurrentUserLogin(),
  });

  return normalizeList<DashboardUserAccessItem>(res.data);
}

export async function saveDashboardUserAccess(userId: number, permissions: string[]) {
  return postJson<ApiResponse<{ user_id: number; total: number }>>("/dashboard_user_access", {
    action: "save_by_user",
    user_id: userId,
    permissions,
    userlogin: getCurrentUserLogin(),
  });
}
