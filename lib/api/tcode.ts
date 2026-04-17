import { postJson } from "./client";
import { TcodeItem } from "@/modules/setup-tcode/types";

type ApiResponse<T> = {
  code: string;
  status?: string;
  message: string;
  data: T;
};

export async function getTcodes() {
  const res = await postJson<ApiResponse<TcodeItem[]>>("/tcode", {
    action: "list",
  });

  return res.data ?? [];
}

export async function createTcode(payload: {
  tcode: string;
  keterangan: string;
  description: string;
  is_active: boolean;
  userlogin?: string;
}) {
  return postJson<ApiResponse<null>>("/tcode", {
    action: "insert",
    tcode: payload.tcode,
    keterangan: payload.keterangan,
    description: payload.description,
    is_active: payload.is_active,
    userlogin: payload.userlogin || "admin",
  });
}

export async function updateTcode(payload: {
  id: number;
  tcode: string;
  keterangan: string;
  description: string;
  is_active: boolean;
  userlogin?: string;
}) {
  return postJson<ApiResponse<null>>("/tcode", {
    action: "update",
    id: payload.id,
    tcode: payload.tcode,
    keterangan: payload.keterangan,
    description: payload.description,
    is_active: payload.is_active,
    userlogin: payload.userlogin || "admin",
  });
}

export async function deleteTcode(id: number, userlogin = "admin") {
  return postJson<ApiResponse<null>>("/tcode", {
    action: "delete",
    id,
    userlogin,
  });
}