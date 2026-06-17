import { buildApiUrl, postFormData, postJson } from "./client";
import {
  BprProfile,
  BprTcodeItem,
  SandiBankSearchItem,
} from "@/modules/data-bpr/types";
import { normalizeBprProfile } from "@/modules/data-bpr/bpr-profile-factory";

type ApiResponse<T> = {
  code: string;
  status?: string;
  message: string;
  data: T;
};

type BprDetailWithTcodeResponse = {
  profile?: Partial<BprProfile> | null;
  tcodes?: BprTcodeItem[];
};

export type BprSaveProfileResponse = {
  bpr_id?: string;
  is_new_profile?: boolean;
  auto_user?: unknown[];
  create_super_admin?: boolean;
  create_system_user?: boolean;
};

export async function getBprDetailWithTcodes(bprId: string) {
  const res = await postJson<ApiResponse<BprDetailWithTcodeResponse>>(
    "/bpr_profile",
    {
      action: "detail_with_tcode",
      bpr_id: bprId,
    }
  );

  const rawProfile = res.data?.profile ?? null;

  const isExisting =
    rawProfile?.is_existing_profile === true ||
    typeof rawProfile?.id === "number";

  return {
    profile: normalizeBprProfile(rawProfile, bprId, {
      defaultExisting: isExisting,
      defaultProvisioning: !isExisting,
    }),
    tcodes: res.data?.tcodes ?? [],
  };
}

export async function saveBprProfile(payload: BprProfile, userlogin = "admin") {
  return postJson<ApiResponse<BprSaveProfileResponse>>("/bpr_profile", {
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
    url_collme: payload.url_collme,
    url_medfo: payload.url_medfo,
    url_hrm: payload.url_hrm,
    url_core: payload.url_core,
    kode_pos: payload.kode_pos,
    logo_bpr: payload.logo_bpr,
    is_active: payload.is_active,
    create_super_admin: payload.create_super_admin === true,
    create_system_user: payload.create_system_user === true,
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
  const res = await postJson<ApiResponse<Partial<BprProfile>[]>>("/bpr_profile", {
    action: "list",
  });

  return Array.isArray(res.data)
    ? res.data.map((item) =>
        normalizeBprProfile(item, item.bpr_id || "", {
          defaultExisting: true,
          defaultProvisioning: false,
        })
      )
    : [];
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

export async function searchSandiBank(term: string) {
  const res = await postJson<ApiResponse<SandiBankSearchItem[]>>(
    "/bpr_profile",
    {
      action: "search_bank",
      term,
    }
  );

  return Array.isArray(res.data) ? res.data : [];
}