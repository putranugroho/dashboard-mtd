import { postJson } from "./client";
import { getCurrentUserLogin } from "@/lib/auth/session";
import {
  SaldoMTDItem,
  SaldoMTDMonitoringDetailItem,
  SaldoMTDMonitoringSummaryItem,
  SaldoMTDResponseItem,
} from "@/modules/saldo-rekening-mtd/types";

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

function normalizeSaldoMTDItem(item: SaldoMTDResponseItem): SaldoMTDItem {
  return {
    no_rek: String(item.no_rek ?? ""),
    jns_rek: String(item.jns_rek ?? ""),
    nama: String(item.nama ?? ""),
    saldoakhir: String(item.saldoakhir ?? "0"),
    saldoeff: String(item.saldoeff ?? "0"),
    status_rek: String(item.status_rek ?? ""),
  };
}

export async function getSaldoMTD(bprId: string): Promise<SaldoMTDItem[]> {
  const res = await postJson<ApiResponse<unknown> | SaldoMTDResponseItem[]>(
    "/saldomtd",
    {
      userlogin: getCurrentUserLogin(),
      bpr_id: bprId,
      term: "WEB",
    }
  );

  const rawData = normalizeList<SaldoMTDResponseItem>(
    Array.isArray(res) ? res : res.data
  );

  return rawData.map(normalizeSaldoMTDItem);
}

export async function getSaldoMTDMonitoringSummary(params?: {
  keyword?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  limit?: number;
  offset?: number;
}): Promise<SaldoMTDMonitoringSummaryItem[]> {
  const res = await postJson<
    ApiResponse<unknown> | SaldoMTDMonitoringSummaryItem[]
  >("/saldo_mtd_monitoring", {
    action: "list_summary",
    userlogin: getCurrentUserLogin(),
    keyword: params?.keyword || "",
    sort_by: params?.sort_by || "",
    sort_dir: params?.sort_dir || "asc",
    limit: params?.limit || 1000,
    offset: params?.offset || 0,
  });

  return normalizeList<SaldoMTDMonitoringSummaryItem>(
    Array.isArray(res) ? res : res.data
  );
}

export async function getSaldoMTDMonitoringDetail(params: {
  bpr_id: string;
  keyword?: string;
  jenis?: "ALL" | "REKENING" | "GL";
  limit?: number;
  offset?: number;
}): Promise<SaldoMTDMonitoringDetailItem[]> {
  const res = await postJson<
    ApiResponse<unknown> | SaldoMTDMonitoringDetailItem[]
  >("/saldo_mtd_monitoring", {
    action: "list_detail",
    userlogin: getCurrentUserLogin(),
    bpr_id: params.bpr_id,
    keyword: params.keyword || "",
    jenis: params.jenis || "ALL",
    limit: params.limit || 2000,
    offset: params.offset || 0,
  });

  return normalizeList<SaldoMTDMonitoringDetailItem>(
    Array.isArray(res) ? res : res.data
  );
}

export async function refreshSaldoMTDMonitoringBpr(
  bprId: string
): Promise<SaldoMTDRefreshBprResult | null> {
  const res = await postJson<ApiResponse<SaldoMTDRefreshBprResult>>(
    "/saldo_mtd_monitoring",
    {
      action: "refresh_bpr",
      userlogin: getCurrentUserLogin(),
      bpr_id: bprId,
    }
  );

  return res.data ?? null;
}

export type SaldoMTDRefreshBprResult = {
  bpr_id: string;
  nama_bpr: string;
  count_rekening: number;
  count_gl: number;
  count_all: number;
  total_rekening: number;
  total_gl: number;
  total_all: number;
};

export type SaldoMTDRefreshAllResult = {
  overall_status: string;
  trigger_type: string;
  total_bpr: number;
  success_bpr: number;
  failed_bpr: number;
  total_rekening: number;
  total_gl: number;
  total_all: number;
  total_saldo_rekening: number;
  total_saldo_gl: number;
  total_saldo_all: number;
  duration_ms: number;
  results: Array<{
    bpr_id: string;
    nama_bpr: string;
    status: string;
    message?: string;
    count_rekening?: number;
    count_gl?: number;
    count_all?: number;
    total_rekening?: number;
    total_gl?: number;
    total_all?: number;
  }>;
};

export type SaldoMTDSyncLogItem = {
  id: number;
  run_id: string;
  bpr_id: string;
  nama_bpr: string;
  trigger_type: string;
  status: string;
  message: string;
  total_rekening: number;
  total_gl: number;
  total_all: number;
  started_at?: string | null;
  finished_at?: string | null;
  duration_ms: number;
  triggered_by: string;
};

export async function refreshSaldoMTDMonitoringAll(
  triggerType: "MANUAL_ALL" | "SCHEDULED" = "MANUAL_ALL"
): Promise<SaldoMTDRefreshAllResult | null> {
  const res = await postJson<ApiResponse<SaldoMTDRefreshAllResult>>(
    "/saldo_mtd_monitoring",
    {
      action: "refresh_all",
      userlogin: getCurrentUserLogin(),
      trigger_type: triggerType,
    }
  );

  return res.data ?? null;
}

export async function getSaldoMTDMonitoringSyncLog(params?: {
  bpr_id?: string;
  keyword?: string;
  status?: string;
  trigger_type?: string;
  limit?: number;
  offset?: number;
}): Promise<SaldoMTDSyncLogItem[]> {
  const res = await postJson<ApiResponse<unknown> | SaldoMTDSyncLogItem[]>(
    "/saldo_mtd_monitoring",
    {
      action: "sync_log",
      userlogin: getCurrentUserLogin(),
      bpr_id: params?.bpr_id || "",
      keyword: params?.keyword || "",
      status: params?.status || "",
      trigger_type: params?.trigger_type || "",
      limit: params?.limit || 50,
      offset: params?.offset || 0,
    }
  );

  return normalizeList<SaldoMTDSyncLogItem>(
    Array.isArray(res) ? res : res.data
  );
}