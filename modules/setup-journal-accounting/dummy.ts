import { JournalAccountingDetail, JournalAccountingItem } from "./types";

export function createEmptyAccountingJournalItem(
  journalNo: number
): JournalAccountingItem {
  return {
    journal_no: journalNo,
    status_journal: true,
    keterangan_journal: "",

    debit_source_type: "BB",
    debit_gol_acc: "",
    debit_nobb: "",
    debit_nama_bb: "",
    debit_nosbb: "",
    debit_nama_sbb: "",
    debit_type_posting: "",
    debit_akun_perantara: "",
    debit_hutang: "",
    debit_piutang: "",

    kredit_source_type: "BB",
    kredit_gol_acc: "",
    kredit_nobb: "",
    kredit_nama_bb: "",
    kredit_nosbb: "",
    kredit_nama_sbb: "",
    kredit_type_posting: "",
    kredit_akun_perantara: "",
    kredit_hutang: "",
    kredit_piutang: "",
  };
}

export function createEmptyAccountingJournalDetail(
  tcode: string,
  keterangan: string,
  journalReady = false,
  accountingReady = false
): JournalAccountingDetail {
  return {
    tcode,
    keterangan,
    journal_ready: journalReady,
    accounting_ready: accountingReady,
    journals: [createEmptyAccountingJournalItem(1)],
  };
}