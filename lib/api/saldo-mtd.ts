import { postJson } from "./client";
import {
  SaldoMTDItem,
  SaldoMTDResponseItem,
} from "@/modules/saldo-rekening-mtd/types";

type ApiResponse<T> = {
  code: string;
  status?: string;
  message: string;
  data: T;
};

const DEFAULT_USERLOGIN =
  process.env.NEXT_PUBLIC_DEFAULT_USERLOGIN || "admin";
const DEFAULT_TERM = process.env.NEXT_PUBLIC_DEFAULT_TERM || "WEB";

export type SaldoMTDSourceItem = {
  source_type: "REK" | "GL";
  source_code: string;
  source_name: string;
};

function normalizeItem(item: SaldoMTDResponseItem): SaldoMTDItem {
  return {
    no_rek: String(item.no_rek ?? ""),
    jns_rek: String(item.jns_rek ?? ""),
    nama: String(item.nama ?? ""),
    saldoakhir: String(item.saldoakhir ?? 0),
    saldoeff: String(item.saldoeff ?? 0),
    status_rek: String(item.status_rek ?? ""),
  };
}

function normalizeSource(item: SaldoMTDResponseItem): SaldoMTDSourceItem {
  const jnsRek = String(item.jns_rek ?? "");

  return {
    source_type: jnsRek === "1" ? "GL" : "REK",
    source_code: String(item.no_rek ?? ""),
    source_name: String(item.nama ?? ""),
  };
}

async function fetchSaldoMTD(
  bprId: string,
  userlogin = DEFAULT_USERLOGIN
): Promise<SaldoMTDResponseItem[]> {
  const res = await postJson<ApiResponse<SaldoMTDResponseItem[]>>(
    "/saldomtd",
    {
      userlogin,
      bpr_id: bprId,
      term: DEFAULT_TERM,
    }
  );

  return res.data ?? [];
}

/**
 * Dipakai oleh halaman monitoring saldo MTD
 */
export async function getSaldoMTD(
  bprId: string,
  userlogin = DEFAULT_USERLOGIN
): Promise<SaldoMTDItem[]> {
  const data = await fetchSaldoMTD(bprId, userlogin);
  return data.map(normalizeItem);
}

/**
 * Dipakai oleh halaman setup relasi rekonsiliasi
 */
export async function getSaldoMTDSources(
  bprId: string,
  userlogin = DEFAULT_USERLOGIN
): Promise<SaldoMTDSourceItem[]> {
  const data = await fetchSaldoMTD(bprId, userlogin);
  return data.map(normalizeSource);
}