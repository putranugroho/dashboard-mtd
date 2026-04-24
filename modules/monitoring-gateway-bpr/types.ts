export type GatewayMonitorStatus =
  | "ERROR"
  | "OFFLINE"
  | "WARNING"
  | "NORMAL";

export type GatewayMonitorItem = {
  bpr_id: string;
  nama_bpr: string;
  gateway_url: string;
  status: GatewayMonitorStatus;
  reason: string;
  checked_at: string;
  echo_success: boolean;
};

export type GatewayMonitorSummary = {
  total: number;
  normal: number;
  offline: number;
  warning: number;
  error: number;
};