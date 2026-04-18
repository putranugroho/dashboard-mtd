export type BprProfile = {
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
  kode_pos: string;
  logo_bpr: string;
  is_active: boolean;
};

export type BprTcodeItem = {
  id: number;
  tcode: string;
  keterangan: string;
  is_linked: boolean;
  journal_ready?: boolean;
};