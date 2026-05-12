import { postJson } from "./client";

type ApiResponse<T> = {
  code: string;
  status?: string;
  message: string;
  data: T;
};

export type CoreHistoryTrxItem = {
  dokumen?: string;
  dokument?: string;
  keterangan?: string;
  noacc?: string;
  nominal?: string | number;
  tgltrn?: string;
};

export async function getCoreHistoryTrx(params: {
  bprId: string;
  noRek: string;
  jnsRek: "1" | "2";
  tglAwal: string;
  tglAkhir: string;
}): Promise<CoreHistoryTrxItem[]> {
  const res = await postJson<ApiResponse<CoreHistoryTrxItem[]>>(
    "/history_trx",
    {
      bpr_id: params.bprId,
      no_rek: params.noRek,
      jns_rek: params.jnsRek,
      tglawal: params.tglAwal,
      tglakhir: params.tglAkhir,
    }
  );

  return Array.isArray(res.data) ? res.data : [];
}