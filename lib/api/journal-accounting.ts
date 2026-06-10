import { getBprDetailWithTcodes } from "./bpr";
import { postJson } from "./client";
import {
  AccountingCoaNode,
  JournalAccountingDetail,
  JournalAccountingItem,
  JournalAccountingTcodeSummary,
  MasterPaymentGatewayItem,
} from "@/modules/setup-journal-accounting/types";
import { createEmptyAccountingJournalDetail } from "@/modules/setup-journal-accounting/journal-factory";

type ApiResponse<T> = {
  code: string;
  status?: string;
  message: string;
  data: T;
};

type GetDetailParams = {
  tcode: string;
  bprId: string;
  userlogin: string;
  term: string;
  paymentGatewayCode: string;
  keterangan?: string;
  journalReady?: boolean;
  accountingReady?: boolean;
};

type SaveParams = {
  tcode: string;
  bprId: string;
  kdKantor: string;
  userlogin: string;
  term: string;
  paymentGatewayCode: string;
  journals: JournalAccountingItem[];
  isExistingSetup?: boolean;
};

type DeleteParams = {
  tcode: string;
  bprId: string;
  kdKantor: string;
  userlogin: string;
  term: string;
  paymentGatewayCode: string;
};

type CountByPgParams = {
  bprId: string;
  userlogin: string;
  term: string;
  paymentGatewayCode: string;
  tcodes: JournalAccountingTcodeSummary[];
};

export async function getAccountingJournalCountsByPaymentGateway(
  params: CountByPgParams
): Promise<Record<string, number>> {
  const entries = await Promise.all(
    params.tcodes.map(async (item) => {
      try {
        const res = await postJson<ApiResponse<JournalAccountingItem[]>>(
          "/setup_journal_accounting_inquiry",
          {
            type: "bytcode",
            userlogin: params.userlogin,
            bpr_id: params.bprId,
            term: params.term,
            tcode: item.tcode,
            payment_gateway_code: params.paymentGatewayCode,
          }
        );

        return [item.tcode, res?.data?.length ?? 0] as const;
      } catch (error) {
        console.error(
          "Gagal memuat count journal",
          item.tcode,
          params.paymentGatewayCode,
          error
        );

        return [item.tcode, 0] as const;
      }
    })
  );

  return Object.fromEntries(entries);
}

export async function getAccountingJournalTcodes(
  bprId: string
): Promise<JournalAccountingTcodeSummary[]> {
  const detail = await getBprDetailWithTcodes(bprId);

  const tcodes = detail?.tcodes ?? [];

  return tcodes
    .filter((item: any) => item.is_linked === true)
    .map((item: any) => ({
      tcode: item.tcode,
      keterangan: item.keterangan,
      is_linked: item.is_linked,
      journal_ready: item.journal_ready === true,
      accounting_ready: item.accounting_ready === true,
      accounting_journal_count: Number(item.accounting_journal_count ?? 0),
    }));
}

export async function getAccountingJournalDetail(
  params: GetDetailParams
): Promise<JournalAccountingDetail> {
  const res = await postJson<ApiResponse<JournalAccountingItem[]>>(
    "/setup_journal_accounting_inquiry",
    {
      type: "bytcode",
      userlogin: params.userlogin,
      bpr_id: params.bprId,
      term: params.term,
      tcode: params.tcode,
      payment_gateway_code: params.paymentGatewayCode,
    }
  );

  const rows = res?.data ?? [];

  if (rows.length === 0) {
    return createEmptyAccountingJournalDetail(
      params.tcode,
      params.keterangan || "",
      params.journalReady === true,
      params.accountingReady === true,
      params.paymentGatewayCode
    );
  }

  return {
    tcode: params.tcode,
    payment_gateway_code: params.paymentGatewayCode,
    keterangan: params.keterangan || "",
    journal_ready: params.journalReady === true,
    accounting_ready: params.accountingReady === true,
    journals: rows.map((item, index) => ({
      payment_gateway_code:
        item.payment_gateway_code || params.paymentGatewayCode,
      journal_no: Number(item.journal_no ?? index + 1),
      status_journal: item.status_journal !== false,
      keterangan_journal: item.keterangan_journal || "",

      debit_source_type: (item.debit_source_type || "NASABAH") as
        | "NASABAH"
        | "BB"
        | "SBB",
      debit_gol_acc: item.debit_gol_acc || "",
      debit_nobb: item.debit_nobb || "",
      debit_nama_bb: item.debit_nama_bb || "",
      debit_nosbb: item.debit_nosbb || "",
      debit_nama_sbb: item.debit_nama_sbb || "",
      debit_type_posting: item.debit_type_posting || "",
      debit_akun_perantara: item.debit_akun_perantara || "",
      debit_hutang: item.debit_hutang || "",
      debit_piutang: item.debit_piutang || "",

      kredit_source_type: (item.kredit_source_type || "NASABAH") as
        | "NASABAH"
        | "BB"
        | "SBB",
      kredit_gol_acc: item.kredit_gol_acc || "",
      kredit_nobb: item.kredit_nobb || "",
      kredit_nama_bb: item.kredit_nama_bb || "",
      kredit_nosbb: item.kredit_nosbb || "",
      kredit_nama_sbb: item.kredit_nama_sbb || "",
      kredit_type_posting: item.kredit_type_posting || "",
      kredit_akun_perantara: item.kredit_akun_perantara || "",
      kredit_hutang: item.kredit_hutang || "",
      kredit_piutang: item.kredit_piutang || "",
    })),
  };
}

export async function saveAccountingJournalBulk(payload: SaveParams) {
  return postJson<ApiResponse<unknown>>("/setup_journal_accounting", {
    action: payload.isExistingSetup ? "update" : "insert",
    userlogin: payload.userlogin,
    bpr_id: payload.bprId,
    term: payload.term,
    kd_kantor: payload.kdKantor,
    tcode: payload.tcode,
    payment_gateway_code: payload.paymentGatewayCode,
    data: payload.journals.map((item, index) => ({
      ...item,
      payment_gateway_code: payload.paymentGatewayCode,
      journal_no: index + 1,
    })),
  });
}

export async function deleteAccountingJournal(payload: DeleteParams) {
  return postJson<ApiResponse<unknown>>("/setup_journal_accounting", {
    action: "delete",
    userlogin: payload.userlogin,
    bpr_id: payload.bprId,
    term: payload.term,
    kd_kantor: payload.kdKantor,
    tcode: payload.tcode,
    payment_gateway_code: payload.paymentGatewayCode,
    data: [],
  });
}

export async function getAccountingSubtree(): Promise<AccountingCoaNode[]> {
  const response = await fetch("/api/accounting/subtree", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kode_pt: "001", // 🔥 nanti bisa dibuat dynamic kalau perlu
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Gagal memuat subtree accounting");
  }

  return json?.data ?? [];
}

export async function getMasterPaymentGateways(): Promise<MasterPaymentGatewayItem[]> {
  const res = await postJson<ApiResponse<MasterPaymentGatewayItem[]>>(
    "/master_pg",
    {
      action: "list",
    }
  );

  return (res.data ?? []).filter((item) => item.is_active === true);
}