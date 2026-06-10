import { postJson } from "./client";

export type FlowPG = {
  id: number;
  pg_id: number;
  pg_kode: string;
  pg_nama: string;
  global_flat_fee: number;
  priority: number;
  is_active: boolean;
};

export type FlowByTcode = {
  tcode_id: number;
  tcode: string;
  tcode_keterangan: string;
  flows: FlowPG[];
};

export type AvailablePG = {
  id: number;
  kode: string;
  nama: string;
  global_flat_fee: number;
};

type ApiResponse<T> = {
  code: string;
  status?: string;
  message?: string;
  data: T;
};

export async function getAllFlows(): Promise<FlowByTcode[]> {
  const res = await postJson<ApiResponse<FlowByTcode[]>>("/setup_flow_transaksi", {
    action: "list",
  });
  return res.data ?? [];
}

export async function saveFlow(
  tcode_id: number,
  flows: { pg_id: number; priority: number }[],
  userlogin = "admin"
): Promise<void> {
  await postJson<ApiResponse<unknown>>("/setup_flow_transaksi", {
    action: "save",
    tcode_id,
    flows,
    userlogin,
  });
}

export async function getAvailablePGs(tcode_id: number): Promise<AvailablePG[]> {
  const res = await postJson<ApiResponse<AvailablePG[]>>("/setup_flow_transaksi", {
    action: "available_pg",
    tcode_id,
  });
  return res.data ?? [];
}
