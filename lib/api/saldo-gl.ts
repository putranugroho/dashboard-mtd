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

type SaldoGLDirectResponse = {
  code?: string;
  status?: string;
  message?: string;
  data?: SaldoGLItem[];
};

type SaldoGLWrappedResponse = {
  status?: string;
  message?: string;
  data?: SaldoGLDirectResponse;
};

type SaldoGLResponse = SaldoGLDirectResponse | SaldoGLWrappedResponse;

function dedupeMappingItems(
  mappings: RekonMappingListItem[]
): RekonMappingListItem[] {
  const map = new Map<string, RekonMappingListItem>();

  for (const item of mappings) {
    if (!item.is_active) continue;
    if (!item.sbb_code || !item.sbb_nobb) continue;

    const key = `${String(item.sbb_code).trim()}::${String(item.sbb_nobb).trim()}`;

    if (!map.has(key)) {
      map.set(key, item);
    }
  }

  return Array.from(map.values());
}

function buildSaldoGLPayload(mappings: RekonMappingListItem[]) {
  const uniqueMappings = dedupeMappingItems(mappings);

  const data: SaldoGLRequestItem[] = uniqueMappings.map((item) => ({
    nosbb: String(item.sbb_code).trim(),
    nobb: String(item.sbb_nobb).trim(),
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

function unwrapSaldoGLResponse(json: SaldoGLResponse): SaldoGLDirectResponse {
  if (Array.isArray((json as SaldoGLDirectResponse)?.data)) {
    return json as SaldoGLDirectResponse;
  }

  const wrappedData = (json as SaldoGLWrappedResponse)?.data;

  if (wrappedData && Array.isArray(wrappedData.data)) {
    return wrappedData;
  }

  return {
    code: (json as SaldoGLDirectResponse)?.code,
    status: json?.status,
    message: json?.message,
    data: [],
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
      "api-key": "123",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const json: SaldoGLResponse = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Gagal mengambil saldo accounting");
  }

  const result = unwrapSaldoGLResponse(json);

  if (result?.code && result.code !== "000") {
    throw new Error(result?.message || "Gagal mengambil saldo accounting");
  }

  if (result?.status && String(result.status).toLowerCase() === "error") {
    throw new Error(result?.message || "Gagal mengambil saldo accounting");
  }

  return Array.isArray(result.data) ? result.data : [];
}