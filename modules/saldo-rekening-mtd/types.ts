export type SaldoRekeningItem = {
  no_rek: string;
  nama: string;
  saldoakhir: string;
  saldoeff: string;
  status_rek: string;
  gl_jsn: string; // "1" = GL, "2" = Rekening
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