export type CollMeStatusAktif = "ALL" | "A" | "NON_ACTIVE";

export type CollMeCollectorItem = {
  id: number;
  backend_id: number;
  userid: string;
  nama: string;
  bpr_id: string;
  kd_kantor: string;
  nohp: string;
  nosbb: string;
  nama_sbb: string;
  stslogin: string;
  stsaktif: string;
  pass_salah: number;
  blokirpass: string;
  created_at: string;
  created_by: string;
  updated_at: string;
};

export type CollMeFilter = {
  bprId: string;
  keyword: string;
  kdKantor: string;
  statusAktif: CollMeStatusAktif;
};

export type CollMeSummary = {
  total: number;
  active: number;
  inactive: number;
  login: number;
  notLogin: number;
  blocked: number;
  passwordWrong: number;
};

export type CollMeListResult = {
  items: CollMeCollectorItem[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
};