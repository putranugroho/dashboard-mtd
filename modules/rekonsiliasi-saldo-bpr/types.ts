export type RekonsiliasiRow = {
  source_type: "REK" | "GL";
  source_code: string;
  source_name: string;

  saldo_bpr: number;
  saldo_acct: number;
  selisih: number;

  sbb_code: string;
  sbb_name: string;
  sbb_nobb: string;
  accounting_name: string;

  status: "MATCH" | "NOT_MATCH";
  recon_at: string;
};

export type RekonsiliasiHeaderState = {
  bprId: string;
  bprName: string;
  reconAt: string;
};

export type RekonMappingListItem = {
  id: number;
  bpr_id: string;
  source_type: string;
  source_code: string;
  source_name: string;
  sbb_code: string;
  sbb_name: string;
  sbb_nobb: string;
  sbb_gol_acc?: string;
  sbb_jns_acc?: string;
  sbb_type_posting?: string;
  sbb_nonaktif?: string;
  is_active: boolean;
  created_by?: string;
  created_at?: string;
  updated_by?: string;
  updated_at?: string;
};

export type SaldoGLItem = {
  golongan: string;
  jenis: string;
  nobb: string;
  nosbb: string;
  nama_account: string;
  posting_type: string;
  saldo_awal: string;
  mutasi_debet: string;
  mutasi_credit: string;
  saldo_akhir: string;
};

export type RekonsiliasiBuildInput = {
  saldoItems: {
    no_rek: string;
    jns_rek: string;
    nama: string;
    saldoakhir: string;
    saldoeff: string;
    status_rek: string;
  }[];
  mappings: RekonMappingListItem[];
  saldoGLItems: SaldoGLItem[];
  reconAt: string;
};