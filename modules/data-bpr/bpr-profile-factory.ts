import { BprProfile } from "./types";

export const createEmptyBprProfile = (bprId = ""): BprProfile => ({
  bpr_id: bprId,
  nama_bpr: "",
  alamat: "",
  direktur_nama: "",
  direktur_hp: "",
  pic_nama: "",
  pic_hp: "",
  head_teller_nama: "",
  head_teller_hp: "",
  email: "",
  tanggal_bergabung: "",
  url_gateway: "",
  url_collme: "",
  url_medfo: "",
  url_hrm: "",
  url_core: "",
  kode_pos: "",
  logo_bpr: "",
  is_active: true,
  is_existing_profile: false,
  create_super_admin: true,
  create_system_user: true,
});

type NormalizeOptions = {
  defaultExisting?: boolean;
  defaultProvisioning?: boolean;
};

export function normalizeBprProfile(
  input?: Partial<BprProfile> | null,
  fallbackBprId = "",
  options: NormalizeOptions = {}
): BprProfile {
  const raw = input ?? {};
  const bprId = raw.bpr_id || fallbackBprId;

  const isExisting =
    raw.is_existing_profile ??
    options.defaultExisting ??
    false;

  const defaultProvisioning =
    options.defaultProvisioning ?? !isExisting;

  return {
    ...createEmptyBprProfile(bprId),
    ...raw,
    bpr_id: bprId,
    nama_bpr: raw.nama_bpr ?? "",
    alamat: raw.alamat ?? "",
    direktur_nama: raw.direktur_nama ?? "",
    direktur_hp: raw.direktur_hp ?? "",
    pic_nama: raw.pic_nama ?? "",
    pic_hp: raw.pic_hp ?? "",
    head_teller_nama: raw.head_teller_nama ?? "",
    head_teller_hp: raw.head_teller_hp ?? "",
    email: raw.email ?? "",
    tanggal_bergabung: raw.tanggal_bergabung ?? "",
    url_gateway: raw.url_gateway ?? "",
    url_collme: raw.url_collme ?? "",
    url_medfo: raw.url_medfo ?? "",
    url_hrm: raw.url_hrm ?? "",
    url_core: raw.url_core ?? "",
    kode_pos: raw.kode_pos ?? "",
    logo_bpr: raw.logo_bpr ?? "",
    is_active: raw.is_active ?? true,
    is_existing_profile: isExisting,
    create_super_admin: raw.create_super_admin ?? defaultProvisioning,
    create_system_user: raw.create_system_user ?? defaultProvisioning,
  };
}