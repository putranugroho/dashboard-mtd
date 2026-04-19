export type JournalAccountingTcodeSummary = {
  tcode: string;
  keterangan: string;
  is_linked: boolean;
  journal_ready: boolean;
  accounting_ready: boolean;
  accounting_journal_count: number;
};

export type AccountingCoaNode = {
  nosbb: string;
  gol_acc: string;
  nobb: string;
  nama_sbb: string;
  jns_acc: string;
  type_posting: string;
  akun_perantara: string;
  nonaktif: string;
  hutang: string;
  piutang: string;
  children: AccountingCoaNode[];
};

export type AccountingCoaOption = {
  gol_acc: string;
  nobb: string;
  nosbb_bb: string;
  nama_bb: string;
  nosbb: string;
  nama_sbb: string;
  jns_acc: string;
  type_posting: string;
  akun_perantara: string;
  nonaktif: string;
  hutang: string;
  piutang: string;
};

export type AccountingSourceType = "NASABAH" | "BB" | "SBB";

export type JournalAccountingItem = {
  journal_no: number;
  status_journal: boolean;
  keterangan_journal: string;

  debit_source_type: AccountingSourceType;
  debit_gol_acc: string;
  debit_nobb: string;
  debit_nama_bb: string;
  debit_nosbb: string;
  debit_nama_sbb: string;
  debit_type_posting: string;
  debit_akun_perantara: string;
  debit_hutang: string;
  debit_piutang: string;

  kredit_source_type: AccountingSourceType;
  kredit_gol_acc: string;
  kredit_nobb: string;
  kredit_nama_bb: string;
  kredit_nosbb: string;
  kredit_nama_sbb: string;
  kredit_type_posting: string;
  kredit_akun_perantara: string;
  kredit_hutang: string;
  kredit_piutang: string;
};

export type JournalAccountingDetail = {
  tcode: string;
  keterangan: string;
  journal_ready: boolean;
  accounting_ready: boolean;
  journals: JournalAccountingItem[];
};

export type JournalAccountingRowErrors = Partial<{
  keterangan_journal: string;
  debit_source_type: string;
  debit_account: string;
  kredit_source_type: string;
  kredit_account: string;
}>;