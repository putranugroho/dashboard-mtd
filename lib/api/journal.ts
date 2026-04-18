import { postJson } from "./client";
import {
  JournalDetail,
  JournalItem,
  JournalTcodeSummary,
} from "@/modules/setup-jurnal/types-new";

type ApiResponse<T> = {
  code: string;
  status?: string;
  message: string;
  data: T;
};

type JournalDetailApi = {
  tcode: string;
  keterangan: string;
  journals: JournalItem[];
};

export async function getJournalTcodes() {
  const res = await postJson<ApiResponse<JournalTcodeSummary[]>>(
    "/tcode_journal",
    {
      action: "list",
    }
  );

  return res.data ?? [];
}

export async function getJournalDetail(tcode: string): Promise<JournalDetail> {
  const res = await postJson<ApiResponse<JournalDetailApi>>("/tcode_journal", {
    action: "detail",
    tcode,
  });

  return res.data;
}

export async function saveJournalBulk(payload: {
  tcode: string;
  journals: JournalItem[];
  userlogin?: string;
}) {
  return postJson<ApiResponse<{ tcode: string; count: number }>>(
    "/tcode_journal_bulk",
    {
      action: "replace",
      tcode: payload.tcode,
      userlogin: payload.userlogin || "admin",
      journals: payload.journals.map((item, index) => ({
        id: item.id,
        journal_no: index,
        keterangan_jurnal: item.keterangan_jurnal,
        debit_source_type: item.debit_source_type,
        debit_keterangan: item.debit_keterangan,
        kredit_source_type: item.kredit_source_type,
        kredit_keterangan: item.kredit_keterangan,
        is_active: item.is_active,
      })),
    }
  );
}