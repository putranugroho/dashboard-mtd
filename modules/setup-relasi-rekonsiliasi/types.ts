export type MasterGLNode = {
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
  children: MasterGLNode[];
};

export type SBBOption = {
  bb_code: string;
  bb_name: string;
  sbb_code: string;
  sbb_name: string;
  sbb_nobb: string;
  sbb_gol_acc: string;
  sbb_jns_acc: string;
  sbb_type_posting: string;
  sbb_nonaktif: string;
  label: string;
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

export type RekonMappingItem = {
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
  is_active?: boolean;
};

export type SaveRekonMappingPayload = {
  userlogin: string;
  bpr_id: string;
  data: RekonMappingItem[];
};

export type RelasiRow = {
  id?: number;
  source_type: "REK" | "GL";
  source_code: string;
  source_name: string;

  selected_sbb_code: string;
  selected_sbb_name: string;
  selected_sbb_nobb: string;
  selected_sbb_gol_acc: string;
  selected_sbb_jns_acc: string;
  selected_sbb_type_posting: string;
  selected_sbb_nonaktif: string;

  selected_label: string;

  is_active: boolean;
  is_changed: boolean;
};

export type RelasiSummary = {
  total: number;
  mapped: number;
  unmapped: number;
};