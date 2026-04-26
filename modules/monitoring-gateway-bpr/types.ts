export type GatewayMonitorStatus =
  | "ERROR"
  | "OFFLINE"
  | "WARNING"
  | "NORMAL";

export type GatewayMonitorSortBy =
  | "severity"
  | "nama_bpr"
  | "bpr_id"
  | "status"
  | "checked_at";

export type GatewayMonitorItem = {
  bpr_id: string;
  nama_bpr: string;
  gateway_url: string;
  status: GatewayMonitorStatus;
  reason: string;
  checked_at: string;
  echo_success: boolean;
  core_status?: string;
};

export type GatewayMonitorSummary = {
  total: number;
  normal: number;
  offline: number;
  warning: number;
  error: number;
};