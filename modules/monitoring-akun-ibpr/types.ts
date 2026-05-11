export type FlagYN = "Y" | "N" | string;

export type AkunIBPRItem = {
  id: number;
  users_id: string;
  bpr_id: string;
  bpr_logo: string;
  nama_lengkap: string;
  no_rekening: string;
  nomor_ponsel: string;
  no_ktp: string;
  createdDate: string;
  photo: string;
  is_lock: FlagYN;
  is_deleted: FlagYN;
  token: string;
  has_token?: boolean;
  deviceId: string;
  development: FlagYN;
};

export type AkunIBPRFilter = {
  bprId: string;
  statusToken: "ALL" | "WITH_TOKEN" | "WITHOUT_TOKEN";
  statusDelete: "ALL" | "ACTIVE" | "DELETED";
  statusLock: "ALL" | "LOCKED" | "UNLOCKED";
  development: "ALL" | "DEVELOPMENT" | "PRODUCTION";
  keyword: string;
};

export type AkunIBPRSummary = {
  total: number;
  withToken: number;
  withoutToken: number;
  deleted: number;
  active: number;
  locked: number;
  unlocked: number;
  development: number;
  production: number;
};