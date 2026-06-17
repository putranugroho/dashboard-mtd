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

export type SandiBankSearchItem = {
  id: number;
  kode_bank: string;
  bpr_id: string;
  nama: string;
  nama_bpr: string;
  jenis: string;
  tipe: string;
  logo: string;
  logo_cetak: string;
  fasilitas_atm: string;
  perbarindo: string;
  active: string;
  is_existing_profile: boolean;
  registration_status: "SUDAH_TERDAFTAR" | "BELUM_TERDAFTAR";
};