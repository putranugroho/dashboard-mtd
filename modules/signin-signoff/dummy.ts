import { SignStatus } from "./types";

export const signStatusDummyMap: Record<string, SignStatus> = {
  "600931": {
    bpr_id: "600931",
    status: "ONLINE",
    updated_at: "2026-04-17 10:15:00",
    updated_by: "admin",
    message: "BPR sedang online dan dapat menerima transaksi",
  },
  "609999": {
    bpr_id: "609999",
    status: "OFFLINE",
    updated_at: "2026-04-17 09:40:00",
    updated_by: "admin",
    message: "BPR sedang offline dan tidak dapat menerima transaksi",
  },
};