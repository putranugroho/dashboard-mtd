import { postJson } from "./client";

export type PaymentGateway = {
  id: number;
  kode: string;
  nama: string;
  deskripsi: string | null;
  global_flat_fee: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
};

export type TCodeOption = {
  id: number;
  tcode: string;
  keterangan: string;
  is_active: boolean;
};

export type SetupFeePG = {
  id?: number;
  pg_id: number;
  tcode_id: number;
  nilai_transaksi: number;
  markup_bpr: number;
  margin_mtd: number;
  fee_bpr: number;
  fee_mtd: number;
  is_active?: boolean;
  pg_kode?: string;
  pg_nama?: string;
  global_flat_fee?: number;
  tcode?: string;
  tcode_keterangan?: string;
};

type ApiResponse<T> = {
  code: string;
  status?: string;
  message?: string;
  data: T;
};

export async function getMasterPG(): Promise<PaymentGateway[]> {
  const res = await postJson<ApiResponse<PaymentGateway[]>>("/master_pg", {
    action: "list",
  });
  return res.data ?? [];
}

export async function createMasterPG(
  data: { kode: string; nama: string; deskripsi?: string; global_flat_fee: number; is_active?: boolean },
  userlogin = "admin"
): Promise<{ id: number }> {
  const res = await postJson<ApiResponse<{ id: number }>>("/master_pg", {
    action: "insert",
    ...data,
    userlogin,
  });
  return res.data;
}

export async function updateMasterPG(
  id: number,
  data: { kode: string; nama: string; deskripsi?: string; global_flat_fee: number; is_active?: boolean },
  userlogin = "admin"
): Promise<void> {
  await postJson<ApiResponse<unknown>>("/master_pg", {
    action: "update",
    id,
    ...data,
    userlogin,
  });
}

export async function deleteMasterPG(id: number, userlogin = "admin"): Promise<void> {
  await postJson<ApiResponse<unknown>>("/master_pg", {
    action: "delete",
    id,
    userlogin,
  });
}

export async function getSetupFeePG(pg_id?: number): Promise<SetupFeePG[]> {
  const res = await postJson<ApiResponse<SetupFeePG[]>>("/setup_fee_pg", {
    action: "list",
    pg_id: pg_id ?? 0,
  });
  return res.data ?? [];
}

export async function saveAllFeePG(
  pg_id: number,
  fees: { tcode_id: number; nilai_transaksi: number; markup_bpr: number; margin_mtd: number; fee_bpr: number; fee_mtd: number }[],
  userlogin = "admin"
): Promise<void> {
  await postJson<ApiResponse<unknown>>("/setup_fee_pg", {
    action: "save_all",
    pg_id,
    fees,
    userlogin,
  });
}

export async function getTCodes(): Promise<TCodeOption[]> {
  const res = await postJson<ApiResponse<TCodeOption[]>>("/tcode", {
    action: "list",
  });
  return (res.data ?? []).filter((t: TCodeOption) => t.is_active);
}
