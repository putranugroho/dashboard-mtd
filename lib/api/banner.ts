import { postJson } from "./client";
import { BannerFormValues, BannerItem, BannerScopeType, BannerType } from "@/modules/setup-banner/types";

type ApiResponse<T> = {
  code: string;
  status?: string;
  message: string;
  data: T;
};

type UploadBannerResponse = {
  type: "image" | "video";
  file_name: string;
  path: string;
  view_url: string;
};

const DEFAULT_USERLOGIN = process.env.NEXT_PUBLIC_DEFAULT_USERLOGIN || "admin";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || window.location.origin;
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "";
}

export function resolveBannerAssetUrl(urlOrPath: string) {
  if (!urlOrPath) return "";
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;

  const base = getBaseUrl().replace(/\/$/, "");
  const path = urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
  return `${base}${path}`;
}

export async function getBanners(params?: {
  scopeType?: BannerScopeType;
  bprId?: string;
  bannerType?: BannerType | "";
  isActive?: boolean;
}): Promise<BannerItem[]> {
  const res = await postJson<ApiResponse<BannerItem[]>>("/banner", {
    action: "list",
    scope_type: params?.scopeType || "",
    bpr_id: params?.bprId || "",
    banner_type: params?.bannerType || "",
    is_active: params?.isActive,
  });

  return res.data ?? [];
}

export async function uploadBannerAsset(type: "image" | "video", file: File) {
  const baseUrl = getBaseUrl();
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${baseUrl}/banner/upload?type=${type}`, {
    method: "POST",
    body: form,
  });

  const json = (await response.json()) as ApiResponse<UploadBannerResponse>;

  if (!response.ok) {
    throw new Error(json?.message || "Upload banner gagal");
  }

  if (json?.code && json.code !== "000") {
    throw new Error(json?.message || "Upload banner gagal");
  }

  return json.data;
}

export async function createBanner(
  values: BannerFormValues,
  userlogin = DEFAULT_USERLOGIN
): Promise<ApiResponse<{ id: number }>> {
  return postJson<ApiResponse<{ id: number }>>("/banner", {
    action: "insert",
    scope_type: values.scope_type,
    bpr_id: values.scope_type === "BPR" ? values.bpr_id : "",
    banner_type: values.banner_type,
    title: values.title,
    description: values.description,
    image_file: values.image_file,
    video_file: values.banner_type === "VIDEO" ? values.video_file : "",
    text_content: values.banner_type === "TEXT" ? values.text_content : "",
    urutan: values.urutan,
    is_active: values.is_active,
    userlogin,
  });
}

export async function updateBanner(
  id: number,
  values: BannerFormValues,
  userlogin = DEFAULT_USERLOGIN
): Promise<ApiResponse<{ id: number }>> {
  return postJson<ApiResponse<{ id: number }>>("/banner", {
    action: "update",
    id,
    scope_type: values.scope_type,
    bpr_id: values.scope_type === "BPR" ? values.bpr_id : "",
    banner_type: values.banner_type,
    title: values.title,
    description: values.description,
    image_file: values.image_file,
    video_file: values.banner_type === "VIDEO" ? values.video_file : "",
    text_content: values.banner_type === "TEXT" ? values.text_content : "",
    urutan: values.urutan,
    is_active: values.is_active,
    userlogin,
  });
}

export async function deleteBanner(
  id: number,
  userlogin = DEFAULT_USERLOGIN
): Promise<ApiResponse<{ id: number }>> {
  return postJson<ApiResponse<{ id: number }>>("/banner", {
    action: "delete",
    id,
    userlogin,
  });
}
