import {
  JournalAccountingDetail,
  JournalAccountingItem,
} from "./types";

export const createEmptyJournalItem = (
  journalNo = 1,
  paymentGatewayCode = ""
): JournalAccountingItem => ({
  journal_no: journalNo,
  status_journal: true,
  keterangan_journal: "",
  payment_gateway_code: paymentGatewayCode,

  debit_source_type: "NASABAH",
  debit_gol_acc: "",
  debit_nobb: "",
  debit_nama_bb: "",
  debit_nosbb: "",
  debit_nama_sbb: "",
  debit_type_posting: "",
  debit_akun_perantara: "N",
  debit_hutang: "N",
  debit_piutang: "N",

  kredit_source_type: "NASABAH",
  kredit_gol_acc: "",
  kredit_nobb: "",
  kredit_nama_bb: "",
  kredit_nosbb: "",
  kredit_nama_sbb: "",
  kredit_type_posting: "",
  kredit_akun_perantara: "N",
  kredit_hutang: "N",
  kredit_piutang: "N",
});

export const createEmptyAccountingJournalDetail = (
  tcode: string,
  keterangan: string,
  journalReady = false,
  accountingReady = false,
  paymentGatewayCode = "MOTION_PAY"
): JournalAccountingDetail => ({
  tcode,
  payment_gateway_code: paymentGatewayCode,
  keterangan,
  journal_ready: journalReady,
  accounting_ready: accountingReady,
  journals: [createEmptyJournalItem(1, paymentGatewayCode)],
});