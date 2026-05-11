import { postJson } from "./client";
import { AkunIBPRItem } from "@/modules/monitoring-akun-ibpr/types";

type ApiResponse<T> = {
  code: string;
  status?: string;
  message: string;
  data: T;
};

type UsersIBPRData = {
  items?: RawAkunIBPRItem[];
  pagination?: {
    total?: number;
    limit?: number;
    offset?: number;
  };
  summary?: Record<string, number>;
};

type RawAkunIBPRItem = Partial<AkunIBPRItem> & {
  no_hp?: string;
  no_ponsel?: string;
  user_id?: string;
  userid?: string;
  created_at?: string;
  created_date?: string;
  has_token?: boolean;
};

const DEFAULT_USERLOGIN = process.env.NEXT_PUBLIC_DEFAULT_USERLOGIN || "admin";
const USERS_IBPR_INFO_ENDPOINT =
  process.env.NEXT_PUBLIC_USERS_IBPR_INFO_ENDPOINT || "/users-ibpr-info";

function normalizeYN(value: unknown, fallback: "Y" | "N" = "N"): string {
  const text = String(value ?? fallback).toUpperCase();
  return text === "Y" ? "Y" : "N";
}

function normalizeItem(item: RawAkunIBPRItem): AkunIBPRItem {
  const token = String(item.token ?? "");

  return {
    id: Number(item.id ?? 0),
    users_id: String(item.users_id ?? item.user_id ?? item.userid ?? ""),
    bpr_id: String(item.bpr_id ?? ""),
    bpr_logo: String(item.bpr_logo ?? ""),
    nama_lengkap: String(item.nama_lengkap ?? ""),
    no_rekening: String(item.no_rekening ?? ""),
    nomor_ponsel: String(item.nomor_ponsel ?? item.no_ponsel ?? item.no_hp ?? ""),
    no_ktp: String(item.no_ktp ?? ""),
    createdDate: String(
      item.createdDate ?? item.created_at ?? item.created_date ?? ""
    ),
    photo: String(item.photo ?? ""),
    is_lock: normalizeYN(item.is_lock),
    is_deleted: normalizeYN(item.is_deleted),
    token,
    has_token: Boolean(item.has_token ?? token.trim() !== ""),
    deviceId: String(item.deviceId ?? ""),
    development: normalizeYN(item.development),
  };
}

export async function getMonitoringAkunIBPR(params?: {
  bprId?: string;
  userlogin?: string;
}): Promise<AkunIBPRItem[]> {
  const res = await postJson<ApiResponse<UsersIBPRData | RawAkunIBPRItem[]>>(
    USERS_IBPR_INFO_ENDPOINT,
    {
      action: "list",
      userlogin: params?.userlogin || DEFAULT_USERLOGIN,
      bpr_id: params?.bprId || "",
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