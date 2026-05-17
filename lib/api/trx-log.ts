import { postJson } from "./client";
import { getCurrentUserLogin } from "@/lib/auth/session";
import type {
  TrxLogDetailPayload,
  TrxLogFilterState,
  TrxLogItem,
  TrxLogTimelineItem,
} from "@/modules/log-transaksi/types";

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

export type SyncGatewayLogResult = {
  trx_log_id: number;
  bpr_id: string;
  rrn: string;
  trx_category: string;
  gateway_url: string;
  synced_count: number;
  timeline: TrxLogTimelineItem[];
};

export async function getTrxLogList(
  filter: TrxLogFilterState
): Promise<TrxLogItem[]> {
  const res = await postJson<ApiResponse<unknown> | TrxLogItem[]>("/trx_log", {
    action: "list",
    userlogin: getCurrentUserLogin(),
    trx_category: filter.trxCategory,
    bpr_id: filter.bprId,
    rrn: filter.rrn,
    status: filter.status,
    tgl_awal: filter.tglAwal,
    tgl_akhir: filter.tglAkhir,
    limit: filter.limit,
    offset: filter.offset,
  });

  return normalizeList<TrxLogItem>(Array.isArray(res) ? res : res.data);
}

export async function getTrxLogDetail(id: number): Promise<TrxLogDetailPayload | null> {
  const res = await postJson<ApiResponse<TrxLogDetailPayload>>("/trx_log", {
    action: "detail",
    userlogin: getCurrentUserLogin(),
    id,
  });

  return res.data ?? null;
}

export async function getTrxLogTimeline(params: {
  id?: number;
  rrn?: string;
}): Promise<TrxLogTimelineItem[]> {
  const res = await postJson<ApiResponse<unknown> | TrxLogTimelineItem[]>(
    "/trx_log",
    {
      action: "timeline",
      userlogin: getCurrentUserLogin(),
      id: params.id || 0,
      rrn: params.rrn || "",
    }
  );

  return normalizeList<TrxLogTimelineItem>(
    Array.isArray(res) ? res : res.data
  );
}

export async function syncGatewayLogByRRN(params: {
  id?: number;
  rrn?: string;
  trx_category?: string;
}): Promise<SyncGatewayLogResult | null> {
  const res = await postJson<ApiResponse<SyncGatewayLogResult>>("/trx_log", {
    action: "sync_gateway_by_rrn",
    userlogin: getCurrentUserLogin(),
    id: params.id || 0,
    rrn: params.rrn || "",
    trx_category: params.trx_category || "ALL",
  });

  return res.data ?? null;
}