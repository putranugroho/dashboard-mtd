import {
  CollMeCollectorItem,
  CollMeListResult,
  CollMeStatusAktif,
} from "@/modules/monitoring-akun-coll-me/types";

type ApiResponse<T> = {
  code: string;
  status?: string;
  message: string;
  data?: T;
};

type RawCollMeCollectorItem = Partial<CollMeCollectorItem> & {
  no_hp?: string;
  phone?: string;
  kdKantor?: string;
  namaSbb?: string;
  statusAktif?: string;
};

type CollMeApiData = {
  list?: RawCollMeCollectorItem[];
  page?: number;
  size?: number;
  total?: number;
  total_pages?: number;
};

function normalizeItem(item: RawCollMeCollectorItem): CollMeCollectorItem {
  return {
    id: Number(item.id ?? 0),
    backend_id: Number(item.backend_id ?? 0),
    userid: String(item.userid ?? ""),
    nama: String(item.nama ?? ""),
    bpr_id: String(item.bpr_id ?? ""),
    kd_kantor: String(item.kd_kantor ?? item.kdKantor ?? ""),
    nohp: String(item.nohp ?? item.no_hp ?? item.phone ?? ""),
    nosbb: String(item.nosbb ?? ""),
    nama_sbb: String(item.nama_sbb ?? item.namaSbb ?? ""),
    stslogin: String(item.stslogin ?? "N"),
    stsaktif: String(item.stsaktif ?? item.statusAktif ?? ""),
    pass_salah: Number(item.pass_salah ?? 0),
    blokirpass: String(item.blokirpass ?? "N"),
    created_at: String(item.created_at ?? ""),
    created_by: String(item.created_by ?? ""),
    updated_at: item.updated_at ? String(item.updated_at) : "",
  };
}

export async function getMonitoringAkunCollMe(params: {
  bprId: string;
  keyword?: string;
  kdKantor?: string;
  statusAktif?: CollMeStatusAktif;
  page?: number;
  size?: number;
}): Promise<CollMeListResult> {
  const bprId = params.bprId.trim();

  if (!bprId) {
    throw new Error("BPR wajib diisi.");
  }

  const response = await fetch("/api/monitoring-akun-coll-me", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      bprId,
      keyword: params.keyword || "",
      kdKantor: params.kdKantor || "",
      statusAktif: params.statusAktif || "A",
      page: params.page || 1,
      size: params.size || 100,
    }),
  });

  const json = (await response.json()) as ApiResponse<CollMeApiData>;

  if (!response.ok || json.code !== "000") {
    throw new Error(json.message || "Gagal mengambil data collector Coll Me.");
  }

  const rawData = json.data || {};
  const list = Array.isArray(rawData.list) ? rawData.list : [];

  return {
    items: list.map(normalizeItem),
    page: Number(rawData.page ?? params.page ?? 1),
    size: Number(rawData.size ?? params.size ?? 100),
    total: Number(rawData.total ?? list.length),
    totalPages: Number(rawData.total_pages ?? 1),
  };
}