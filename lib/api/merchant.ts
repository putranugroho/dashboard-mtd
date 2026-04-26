import { postJson } from "./client";
import { MerchantFormValues, MerchantItem } from "@/modules/setup-merchant/types";

type ApiResponse<T> = {
  code: string;
  status?: string;
  message: string;
  data: T;
};

const DEFAULT_USERLOGIN =
  process.env.NEXT_PUBLIC_DEFAULT_USERLOGIN || "admin";

export async function getMerchants(): Promise<MerchantItem[]> {
  const res = await postJson<ApiResponse<MerchantItem[]>>("/merchant", {
    action: "list",
  });

  return res.data ?? [];
}

export async function createMerchant(
  values: MerchantFormValues,
  userlogin = DEFAULT_USERLOGIN
): Promise<ApiResponse<{ id: number }>> {
  return postJson<ApiResponse<{ id: number }>>("/merchant", {
    action: "insert",
    merchant_id: values.merchant_id,
    nama_merchant: values.nama_merchant,
    pic: values.pic,
    no_hp: values.no_hp,
    is_active: values.is_active,
    userlogin,
  });
}

export async function updateMerchant(
  id: number,
  values: MerchantFormValues,
  userlogin = DEFAULT_USERLOGIN
): Promise<ApiResponse<null>> {
  return postJson<ApiResponse<null>>("/merchant", {
    action: "update",
    id,
    merchant_id: values.merchant_id,
    nama_merchant: values.nama_merchant,
    pic: values.pic,
    no_hp: values.no_hp,
    is_active: values.is_active,
    userlogin,
  });
}

export async function deleteMerchant(
  id: number,
  userlogin = DEFAULT_USERLOGIN
): Promise<ApiResponse<null>> {
  return postJson<ApiResponse<null>>("/merchant", {
    action: "delete",
    id,
    userlogin,
  });
}