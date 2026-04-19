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