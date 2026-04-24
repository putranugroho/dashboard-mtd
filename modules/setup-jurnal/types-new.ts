export type JournalTcodeSummary = {
  tcode_id: number;
  tcode: string;
  keterangan: string;
  jml_jurnal: number;
};

export type JournalItem = {
  id: number;
  journal_no: number;
  keterangan_jurnal: string;
  debit_source_type: number;
  debit_keterangan: string;
  kredit_source_type: number;
  kredit_keterangan: string;
  is_active: boolean;
};

export type JournalDetail = {
  tcode_id: number;
  tcode: string;
  keterangan: string;
  journals: JournalItem[];
};

export type SourceTypeOption = {
  value: number;
  label: string;
};

export type JournalRowErrors = Partial<{
  keterangan_jurnal: string;
  debit_source_type: string;
  debit_keterangan: string;
  kredit_source_type: string;
  kredit_keterangan: string;
}>;