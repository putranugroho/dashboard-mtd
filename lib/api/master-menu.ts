import { postJson } from "./client";
import { MasterMenuFormValues, MasterMenuItem } from "@/modules/setup-master-menu/types";

type ApiResponse<T> = {
  code?: string;
  status?: string;
  message?: string;
  data?: T;
};

function normalizeList(payload: unknown): MasterMenuItem[] {
  if (Array.isArray(payload)) return payload as MasterMenuItem[];
  if (payload && typeof payload === "object" && Array.isArray((payload as any).data)) {
    return (payload as any).data;
  }
  return [];
}

export async function getMasterMenus(): Promise<MasterMenuItem[]> {
  const res = await postJson<ApiResponse<unknown>>("/master_menu", {
    action: "list",
  });

  return normalizeList(res.data);
}

export async function createMasterMenu(payload: MasterMenuFormValues) {
  return postJson<ApiResponse<{ id: number }>>("/master_menu", {
    action: "insert",
    ...payload,
  });
}

export async function updateMasterMenu(id: number, payload: MasterMenuFormValues) {
  return postJson<ApiResponse<{ id: number }>>("/master_menu", {
    action: "update",
    id,
    ...payload,
  });
}

export async function deleteMasterMenu(id: number, userlogin = "admin") {
  return postJson<ApiResponse<{ id: number }>>("/master_menu", {
    action: "delete",
    id,
    userlogin,
  });
}