import { postJson } from "./client";
import { getCurrentUserLogin } from "@/lib/auth/session";

export type DashboardFacility = {
  id: number;
  modul: string;
  menu: string;
  submenu: string;
  subsubmenu?: string;
  menu_code: string;
  action_code: string;
  permission_code: string;
  route_path?: string;
  urut?: number;
  modul_urut?: number;
  menu_urut?: number;
  submenu_urut?: number;
  subsubmenu_urut?: number;
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

export async function getDashboardFacilities() {
  const res = await postJson<ApiResponse<unknown>>("/dashboard_facility", {
    action: "list",
    userlogin: getCurrentUserLogin(),
  });

  return normalizeList<DashboardFacility>(res.data);
}
