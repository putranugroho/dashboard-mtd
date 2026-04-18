export type SignStatus = {
  bpr_id: string;
  status: "ONLINE" | "OFFLINE";
  updated_at?: string;
  updated_by?: string;
  message?: string;
};