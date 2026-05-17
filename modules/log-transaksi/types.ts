export type TrxCategory = "ALL" | "TRANSFER" | "PPOB";
export type TrxStatus = "ALL" | "PENDING" | "SUCCESS" | "FAILED" | "TIMEOUT";

export type TrxLogFilterState = {
  trxCategory: TrxCategory;
  bprId: string;
  rrn: string;
  status: TrxStatus;
  tglAwal: string;
  tglAkhir: string;
  limit: number;
  offset: number;
};

export type TrxLogItem = {
  id: number;
  trx_category: string;
  trx_direction: string;
  bpr_id: string;
  nama_bpr: string;
  rrn: string;
  ref_id: string;
  no_rek: string;
  no_hp: string;
  trx_code: string;
  product_name: string;
  amount: number;
  admin_fee: number;
  fee_bpr: number;
  tgl_trans: string;
  tgl_trans_date?: string | null;
  final_code: string;
  final_status: string;
  final_message: string;
  failed_at_layer: string;
  failed_at_step: string;
  duration_ms: number;
  created_at?: string | null;
  updated_at?: string | null;
};

export type TrxLogDetailPayload = {
  id: number;
  request_payload: unknown;
  response_payload: unknown;
};

export type TrxLogTimelineItem = {
  id: number;
  trx_log_id: number;
  trx_category: string;
  rrn: string;
  ref_id: string;
  bpr_id: string;
  layer: string;
  step_name: string;
  direction: string;
  status: string;
  response_code: string;
  message: string;
  url: string;
  route_path: string;
  duration_ms: number;
  event_order: number;
  created_at?: string | null;
};

export type TrxLogSummary = {
  total: number;
  success: number;
  failed: number;
  timeout: number;
  pending: number;
  totalAmount: number;
};