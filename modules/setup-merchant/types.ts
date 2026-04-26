export type MerchantItem = {
  id: number;
  merchant_id: string;
  nama_merchant: string;
  pic: string;
  no_hp: string;
  is_active: boolean;
};

export type MerchantFormValues = {
  merchant_id: string;
  nama_merchant: string;
  pic: string;
  no_hp: string;
  is_active: boolean;
};