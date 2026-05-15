export type SaldoMTDResponseItem = {
  no_rek: string | number;
  jns_rek: string | number; // "1" = GL, "2" = Rekening
  nama: string;
  saldoakhir: string | number;
  saldoeff: string | number;
  status_rek: string;
};

export type SaldoMTDItem = {
  no_rek: string;
  jns_rek: string; // "1" = GL, "2" = Rekening
  nama: string;
  saldoakhir: string;
  saldoeff: string;
  status_rek: string;
};

export type SaldoGroupType = "REKENING" | "GL";

export type SaldoSummary = {
  totalRekening: number;
  totalGL: number;
  totalAll: number;
  countRekening: number;
  countGL: number;
  countAll: number;
};

export type SaldoMTDMonitoringSummaryItem = {
  bpr_id: string;
  nama_bpr: string;

  total_rekening: number;
  total_gl: number;
  total_all: number;

  count_rekening: number;
  count_gl: number;
  count_all: number;

  snapshot_date?: string | null;
  last_sync_at?: string | null;

  sync_status: "SUCCESS" | "FAILED" | "PARTIAL" | "NO_DATA" | string;
  sync_message?: string;
};

export type SaldoMTDMonitoringDetailItem = {
  bpr_id: string;
  nama_bpr: string;

  no_rek: string;
  jns_rek: string;
  nama: string;

  saldoakhir: number;
  saldoeff: number;
  status_rek: string;

  snapshot_date?: string | null;
  last_sync_at?: string | null;
};

export type SaldoMTDMonitoringGlobalSummary = {
  totalBpr: number;
  totalBprWithData: number;
  totalBprNoData: number;

  totalRekening: number;
  totalGL: number;
  totalAll: number;

  countRekening: number;
  countGL: number;
  countAll: number;

  latestSyncAt?: string | null;
};