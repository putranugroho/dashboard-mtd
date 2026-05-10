export type UserAccountRole = "NASABAH" | "STAFF";
export type DeletedFlag = "Y" | "N" | string;

export type UserAccountItem = {
  id: number;
  no_cif: string;
  username: string;
  bpr_id: string;
  kd_kantor: string;
  nama: string;
  phone: string;
  tgl_lahir: string;
  no_identitas: string;
  token: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  role: UserAccountRole;
  is_deleted: DeletedFlag;
};

export type UserAccountFilter = {
  bprId: string;
  role: "ALL" | UserAccountRole;
  statusToken: "ALL" | "WITH_TOKEN" | "WITHOUT_TOKEN";
  statusDelete: "ALL" | "ACTIVE" | "DELETED";
  keyword: string;
};

export type UserAccountSummary = {
  total: number;
  nasabah: number;
  staff: number;
  withToken: number;
  withoutToken: number;
  deleted: number;
  active: number;
};
