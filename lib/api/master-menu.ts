import { postJson } from "./client";
import {
  MasterMenuFormValues,
  MasterMenuItem,
  MasterMenuMenuOption,
  MasterMenuModuleOption,
  MasterMenuSubmenuOption,
} from "@/modules/setup-master-menu/types";

type ApiResponse<T> = {
  code?: string;
  status?: string;
  message?: string;
  data?: T;
};

function normalizeList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: T[] }).data;
  }

  return [];
}

export async function getMasterMenus(type = "CMS"): Promise<MasterMenuItem[]> {
  const res = await postJson<ApiResponse<unknown> | MasterMenuItem[]>(
    "/master_menu",
    {
      action: "list",
      type,
    }
  );

  return normalizeList<MasterMenuItem>(
    Array.isArray(res) ? res : res.data
  );
}

export async function getMasterMenuModules(): Promise<MasterMenuModuleOption[]> {
  const res = await postJson<ApiResponse<unknown> | MasterMenuModuleOption[]>(
    "/master_menu",
    {
      action: "list_module",
    }
  );

  return normalizeList<MasterMenuModuleOption>(
    Array.isArray(res) ? res : res.data
  );
}

export async function getMasterMenuMenus(
  modul: string
): Promise<MasterMenuMenuOption[]> {
  const res = await postJson<ApiResponse<unknown>>("/master_menu", {
    action: "list_menu",
    modul,
  });

  return normalizeList<MasterMenuMenuOption>(res.data);
}

export async function getMasterMenuSubmenus(
  modul: string,
  menu: string
): Promise<MasterMenuSubmenuOption[]> {
  const res = await postJson<ApiResponse<unknown>>("/master_menu", {
    action: "list_submenu",
    modul,
    menu,
  });

  return normalizeList<MasterMenuSubmenuOption>(res.data);
}

export async function createMasterMenu(payload: MasterMenuFormValues) {
  return postJson<ApiResponse<{ id: number }>>("/master_menu", {
    action: "insert",
    ...payload,
  });
}

export async function updateMasterMenu(
  id: number,
  payload: MasterMenuFormValues
) {
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