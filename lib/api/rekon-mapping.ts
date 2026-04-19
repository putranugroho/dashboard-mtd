import { postJson } from "./client";
import {
  RekonMappingItem,
  RekonMappingListItem,
  SaveRekonMappingPayload,
} from "@/modules/setup-relasi-rekonsiliasi/types";

type ApiResponse<T> = {
  code?: string;
  status?: string;
  message?: string;
  data?: T;
};

function normalizeMappingListPayload(payload: unknown): RekonMappingListItem[] {
  if (Array.isArray(payload)) {
    return payload as RekonMappingListItem[];
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: RekonMappingListItem[] }).data;
  }

  return [];
}

function extractMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }
  return fallback;
}

export async function getRekonMappingList(
  bprId: string
): Promise<RekonMappingListItem[]> {
  const res = await postJson<ApiResponse<unknown>>("/rekon_mapping", {
    action: "list",
    bpr_id: bprId,
  });

  return normalizeMappingListPayload(res.data);
}

export async function saveRekonMapping(
  payload: SaveRekonMappingPayload
): Promise<ApiResponse<{ total: number; success: number; failed: number }>> {
  const res = await postJson<ApiResponse<unknown>>("/rekon_mapping", {
    action: "bulk_upsert",
    userlogin: payload.userlogin,
    bpr_id: payload.bpr_id,
    data: payload.data,
  });

  const nestedData =
    res.data &&
    typeof res.data === "object" &&
    "data" in res.data &&
    (res.data as { data?: unknown }).data &&
    typeof (res.data as { data?: unknown }).data === "object"
      ? ((res.data as { data?: { total?: number; success?: number; failed?: number } })
          .data ?? {})
      : {};

  return {
    code: res.code,
    status: res.status,
    message: extractMessage(res.data, res.message || "Berhasil menyimpan mapping"),
    data: {
      total: Number(nestedData.total ?? 0),
      success: Number(nestedData.success ?? 0),
      failed: Number(nestedData.failed ?? 0),
    },
  };
}

export async function deactivateRekonMapping(
  id: number,
  userlogin: string
): Promise<ApiResponse<{ id: number; is_active: boolean }>> {
  const res = await postJson<ApiResponse<unknown>>("/rekon_mapping", {
    action: "deactivate",
    id,
    userlogin,
  });

  const nestedData =
    res.data &&
    typeof res.data === "object" &&
    "data" in res.data &&
    (res.data as { data?: unknown }).data &&
    typeof (res.data as { data?: unknown }).data === "object"
      ? ((res.data as { data?: { id?: number; is_active?: boolean } }).data ?? {})
      : {};

  return {
    code: res.code,
    status: res.status,
    message: extractMessage(res.data, res.message || "Berhasil menonaktifkan mapping"),
    data: {
      id: Number(nestedData.id ?? id),
      is_active: Boolean(nestedData.is_active ?? false),
    },
  };
}

export type { RekonMappingItem };