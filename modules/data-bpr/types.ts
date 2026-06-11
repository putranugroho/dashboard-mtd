export type BprProfile = {
  id?: number;
  bpr_id: string;
  nama_bpr: string;
  alamat: string;
  direktur_nama: string;
  direktur_hp: string;
  pic_nama: string;
  pic_hp: string;
  head_teller_nama: string;
  head_teller_hp: string;
  email: string;
  tanggal_bergabung: string;
  url_gateway: string;
  url_collme: string;
  url_medfo: string;
  url_hrm: string;
  url_core: string;
  kode_pos: string;
  logo_bpr: string;
  is_active: boolean;
  is_existing_profile?: boolean;
  create_super_admin?: boolean;
  create_system_user?: boolean;
};

export type BprTcodeItem = {
  id: number;
  tcode: string;
  keterangan: string;
  is_linked: boolean;
  journal: boolean;
  journal_ready: boolean;
  accounting_ready: boolean;
  accounting_journal_count?: number;
};