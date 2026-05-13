import { postJson } from "./client";
import { AuthSession } from "@/lib/auth/session";

type ApiResponse<T> = {
  code?: string;
  status?: string;
  message?: string;
  data?: T;
};

export type DashboardLoginPayload = {
  username: string;
  password: string;
};

export async function loginDashboard(payload: DashboardLoginPayload) {
  const res = await postJson<ApiResponse<AuthSession>>("/dashboard_login", payload);

  if (!res.data?.user) {
    throw new Error(res.message || "Response login tidak valid");
  }

  return res.data;
}
