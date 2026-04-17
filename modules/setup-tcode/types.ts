export type TcodeItem = {
  id: number;
  tcode: string;
  keterangan: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TcodeFormValues = {
  tcode: string;
  keterangan: string;
  description: string;
  is_active: boolean;
};