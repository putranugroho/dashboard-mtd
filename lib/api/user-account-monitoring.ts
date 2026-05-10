import { postJson } from "./client";
import { UserAccountItem, UserAccountRole } from "@/modules/monitoring-user-account/types";

type ApiResponse<T> = {
  code: string;
  status?: string;
  message: string;
  data: T;
};

type UsersInfoData = {
  items?: RawUserAccountItem[];
  pagination?: {
    total?: number;
    limit?: number;
    offset?: number;
  };
  summary?: Record<string, number>;
};

type RawUserAccountItem = Partial<UserAccountItem> & {
  no_hp?: string;
  no_ktp?: string;
  users_id?: string;
  user_id?: string;
  has_token?: boolean;
};

const DEFAULT_USERLOGIN = process.env.NEXT_PUBLIC_DEFAULT_USERLOGIN || "admin";
const USERS_INFO_ENDPOINT =
  process.env.NEXT_PUBLIC_USERS_INFO_ENDPOINT || "/users-info";

function normalizeRole(value: unknown): UserAccountRole {
  const role = String(value ?? "NASABAH").toUpperCase();
  return role === "STAFF" ? "STAFF" : "NASABAH";
}

function normalizeItem(item: RawUserAccountItem): UserAccountItem {
  return {
    id: Number(item.id ?? 0),
    no_cif: String(item.no_cif ?? ""),
    username: String(item.username ?? item.users_id ?? item.user_id ?? ""),
    bpr_id: String(item.bpr_id ?? ""),
    kd_kantor: String(item.kd_kantor ?? ""),
    nama: String(item.nama ?? ""),
    phone: String(item.phone ?? item.no_hp ?? ""),
    tgl_lahir: String(item.tgl_lahir ?? ""),
    no_identitas: String(item.no_identitas ?? item.no_ktp ?? ""),
    token: String(item.token ?? ""),
    created_at: String(item.created_at ?? ""),
    updated_at: String(item.updated_at ?? ""),
    deleted_at: String(item.deleted_at ?? ""),
    role: normalizeRole(item.role),
    is_deleted: String(item.is_deleted ?? "N"),
  };
}

export async function getMonitoringUserAccounts(params?: {
  bprId?: string;
  role?: "ALL" | UserAccountRole;
  userlogin?: string;
}): Promise<UserAccountItem[]> {
  const res = await postJson<ApiResponse<UsersInfoData | RawUserAccountItem[]>>(
    USERS_INFO_ENDPOINT,
    {
      action: "list",
      userlogin: params?.userlogin || DEFAULT_USERLOGIN,
      bpr_id: params?.bprId || "",
      role: params?.role && params.role !== "ALL" ? params.role : "",
    }
  );

  const rawData = res.data;

  const items = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.items)
      ? rawData.items
      : [];

  return items.map(normalizeItem);
}