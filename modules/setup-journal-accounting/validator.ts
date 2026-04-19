import {
  JournalAccountingDetail,
  JournalAccountingRowErrors,
} from "./types";

export function validateAccountingJournalDetail(
  detail: JournalAccountingDetail
): Record<number, JournalAccountingRowErrors> {
  const result: Record<number, JournalAccountingRowErrors> = {};
  const seen = new Set<number>();

  detail.journals.forEach((item, index) => {
    const errors: JournalAccountingRowErrors = {};

    if (!item.keterangan_journal.trim()) {
      errors.keterangan_journal = "Keterangan journal wajib diisi.";
    }

    if (seen.has(item.journal_no)) {
      errors.keterangan_journal =
        "Nomor journal duplikat. Mohon cek urutan journal.";
    }
    seen.add(item.journal_no);

    const isDebitComplete =
      !!item.debit_nobb &&
      !!item.debit_nama_bb &&
      !!item.debit_nosbb &&
      !!item.debit_nama_sbb;

    if (!isDebitComplete) {
      errors.debit_account = "Akun debit wajib dipilih lengkap.";
    }

    const isKreditComplete =
      !!item.kredit_nobb &&
      !!item.kredit_nama_bb &&
      !!item.kredit_nosbb &&
      !!item.kredit_nama_sbb;

    if (!isKreditComplete) {
      errors.kredit_account = "Akun kredit wajib dipilih lengkap.";
    }

    if (Object.keys(errors).length > 0) {
      result[index] = errors;
    }
  });

  return result;
}