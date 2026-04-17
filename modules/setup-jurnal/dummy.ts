import { JournalDetail, JournalTcodeSummary, SourceTypeOption } from "./types-new";

export const sourceTypeOptions: SourceTypeOption[] = [
  { value: 1, label: "Rekening Nasabah" },
  { value: 2, label: "GL" },
  { value: 3, label: "Rekening MTD" },
];

export const journalTcodeDummy: JournalTcodeSummary[] = [
  {
    tcode_id: 1,
    tcode: "2100",
    keterangan: "Transfer Out",
    jml_jurnal: 2,
  },
  {
    tcode_id: 2,
    tcode: "2200",
    keterangan: "Transfer In",
    jml_jurnal: 2,
  },
  {
    tcode_id: 3,
    tcode: "2300",
    keterangan: "Pindah Buku",
    jml_jurnal: 1,
  },
  {
    tcode_id: 6,
    tcode: "5000",
    keterangan: "PPOB",
    jml_jurnal: 2,
  },
];

export const journalDetailDummy: Record<number, JournalDetail> = {
  1: {
    tcode_id: 1,
    tcode: "2100",
    keterangan: "Transfer Out",
    journals: [
      {
        id: 11,
        journal_no: 0,
        keterangan_jurnal: "Pokok Transfer Out",
        debit_source_type: 1,
        debit_keterangan: "Menggunakan rekening nasabah",
        kredit_source_type: 3,
        kredit_keterangan: "Menggunakan rekening MTD",
        is_active: true,
      },
      {
        id: 12,
        journal_no: 1,
        keterangan_jurnal: "Fee Transfer Out",
        debit_source_type: 1,
        debit_keterangan: "Fee dari rekening nasabah",
        kredit_source_type: 2,
        kredit_keterangan: "Masuk ke GL fee",
        is_active: true,
      },
    ],
  },
  2: {
    tcode_id: 2,
    tcode: "2200",
    keterangan: "Transfer In",
    journals: [
      {
        id: 21,
        journal_no: 0,
        keterangan_jurnal: "Pokok Transfer In",
        debit_source_type: 3,
        debit_keterangan: "Menggunakan rekening MTD",
        kredit_source_type: 1,
        kredit_keterangan: "Masuk ke rekening nasabah",
        is_active: true,
      },
      {
        id: 22,
        journal_no: 1,
        keterangan_jurnal: "Fee Transfer In",
        debit_source_type: 2,
        debit_keterangan: "GL fee",
        kredit_source_type: 1,
        kredit_keterangan: "Pembebanan ke nasabah",
        is_active: false,
      },
    ],
  },
  3: {
    tcode_id: 3,
    tcode: "2300",
    keterangan: "Pindah Buku",
    journals: [
      {
        id: 31,
        journal_no: 0,
        keterangan_jurnal: "Jurnal Pindah Buku",
        debit_source_type: 1,
        debit_keterangan: "Rekening asal",
        kredit_source_type: 1,
        kredit_keterangan: "Rekening tujuan",
        is_active: true,
      },
    ],
  },
  6: {
    tcode_id: 6,
    tcode: "5000",
    keterangan: "PPOB",
    journals: [
      {
        id: 61,
        journal_no: 0,
        keterangan_jurnal: "Jurnal PPOB Utama",
        debit_source_type: 1,
        debit_keterangan: "Menggunakan nomor rekening nasabah",
        kredit_source_type: 3,
        kredit_keterangan: "Menggunakan nomor rekening MTD",
        is_active: true,
      },
      {
        id: 62,
        journal_no: 1,
        keterangan_jurnal: "Fee PPOB",
        debit_source_type: 3,
        debit_keterangan: "Menggunakan rekening MTD",
        kredit_source_type: 2,
        kredit_keterangan: "Masuk ke GL fee PPOB",
        is_active: true,
      },
    ],
  },
};