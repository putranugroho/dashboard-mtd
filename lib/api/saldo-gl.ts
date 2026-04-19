import { RekonMappingListItem } from "@/modules/rekonsiliasi-saldo-bpr/types";

export type SaldoGLRequestItem = {
  nosbb: string;
  nobb: string;
  kode_pt: string;
  kode_kantor: string;
  kode_induk: string;
};

export type SaldoGLItem = {
  golongan: string;
  jenis: string;
  nobb: string;
  nosbb: string;
  nama_account: string;
  posting_type: string;
  saldo_awal: string;
  mutasi_debet: string;
  mutasi_credit: string;
  saldo_akhir: string;
};

type SaldoGLResponse = {
  code?: string;
  status?: string;
  message?: string;
  data?: SaldoGLItem[];
};

function dedupeMappingItems(mappings: RekonMappingListItem[]): RekonMappingListItem[] {
  const map = new Map<string, RekonMappingListItem>();

  for (const item of mappings) {
    if (!item.is_active) continue;

    const key = `${item.sbb_code}::${item.sbb_nobb}`;
    if (!map.has(key)) {
      map.set(key, item);
    }
  }

  return Array.from(map.values());
}

function buildSaldoGLPayload(mappings: RekonMappingListItem[]) {
  const uniqueMappings = dedupeMappingItems(mappings);

  const data: SaldoGLRequestItem[] = uniqueMappings
    .filter((item) => item.sbb_code && item.sbb_nobb)
    .map((item) => ({
      nosbb: item.sbb_code,
      nobb: item.sbb_nobb,
      kode_pt: "001",
      kode_kantor: "001",
      kode_induk: "001",
    }));

  return {
    kode_pt: "100",
    kode_kantor: "02",
    kode_induk: "03",
    userinput: "fadly",
    userterm: "PC accounting",
    data,
  };
}

export async function getSaldoGL(
  mappings: RekonMappingListItem[]
): Promise<SaldoGLItem[]> {
  const payload = buildSaldoGLPayload(mappings);

  if (!payload.data.length) {
    return [];
  }

  const response = await fetch("/api/accounting/saldogl", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const json: SaldoGLResponse = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Gagal mengambil saldo accounting");
  }

  if (json?.code && json.code !== "000") {
    throw new Error(json?.message || "Gagal mengambil saldo accounting");
  }

  if (json?.status && String(json.status).toLowerCase() === "error") {
    throw new Error(json?.message || "Gagal mengambil saldo accounting");
  }

  return json?.data ?? [];
}