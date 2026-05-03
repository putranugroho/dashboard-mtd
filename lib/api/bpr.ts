import { buildApiUrl, postFormData, postJson } from "./client";
import { BprProfile, BprTcodeItem } from "@/modules/data-bpr/types";

type ApiResponse<T> = {
  code: string;
  status?: string;
  message: string;
  data: T;
};

type BprDetailWithTcodeResponse = {
  profile: BprProfile;
  tcodes: BprTcodeItem[];
};

export async function getBprDetailWithTcodes(bprId: string) {
  const res = await postJson<ApiResponse<BprDetailWithTcodeResponse>>(
    "/bpr_profile",
    {
      action: "detail_with_tcode",
      bpr_id: bprId,
    }
  );

  return res.data;
}

export async function saveBprProfile(payload: BprProfile, userlogin = "admin") {
  return postJson<ApiResponse<null>>("/bpr_profile", {
    action: "upsert",
    bpr_id: payload.bpr_id,
    nama_bpr: payload.nama_bpr,
    alamat: payload.alamat,
    direktur_nama: payload.direktur_nama,
    direktur_hp: payload.direktur_hp,
    pic_nama: payload.pic_nama,
    pic_hp: payload.pic_hp,
    head_teller_nama: payload.head_teller_nama,
    head_teller_hp: payload.head_teller_hp,
    email: payload.email,
    tanggal_bergabung: payload.tanggal_bergabung,
    url_gateway: payload.url_gateway,
    kode_pos: payload.kode_pos,
    logo_bpr: payload.logo_bpr,
    is_active: payload.is_active,
    userlogin,
  });
}

export async function saveBprTcodes(
  bprId: string,
  tcodeIds: number[],
  userlogin = "admin"
) {
  return postJson<ApiResponse<{ bpr_id: string; count: number }>>(
    "/bpr_profile",
    {
      action: "save_tcode",
      bpr_id: bprId,
      tcode_ids: tcodeIds,
      userlogin,
    }
  );
}

export type ListBprItem = BprProfile;

export async function getListBpr() {
  const res = await postJson<ApiResponse<BprProfile[]>>("/bpr_profile", {
    action: "list",
  });

  return Array.isArray(res.data) ? res.data : [];
}

export type UploadBprLogoResponse = {
  file_name: string;
  path: string;
  type: string;
};

export async function uploadBprLogo(file: File): Promise<UploadBprLogoResponse> {
  const formData = new FormData();
  formData.append("type", "logo_bpr");
  formData.append("file", file);

  const json = await postFormData<any>("/photo/upload-single", formData);

  const payload = json?.data?.data ?? json?.data ?? json;

  if (payload?.code === "001" || json?.code === "001") {
    throw new Error(json?.message || payload?.message || "Gagal upload logo BPR");
  }

  return payload;
}

export function resolveBprLogoUrl(fileName?: string) {
  const name = String(fileName || "").trim();
  if (!name) return "";

  if (name.startsWith("http://") || name.startsWith("https://")) {
    return name;
  }

  return buildApiUrl(`/photo/view?type=logo_bpr&file=${encodeURIComponent(name)}`);
}