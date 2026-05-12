export type AccountingHistoryItem = {
  id?: number;
  tgl_trans?: string;
  tgl_val?: string;
  trans_user?: string;
  batch?: string;
  no_trans?: number;
  debet_acc?: string;
  nama_debet?: string;
  credit_acc?: string;
  nama_credit?: string;
  rrn?: string;
  nomor_dok?: string;
  nomor_ref?: string;
  nominal?: string | number;
  keterangan?: string;
  merchant?: string;
  source_trx?: string;
};

type AccountingDirectResponse = {
  code?: string;
  status?: string;
  message?: string;
  data?: AccountingHistoryItem[];
};

type AccountingWrappedResponse = {
  status?: string;
  message?: string;
  data?: AccountingDirectResponse;
};

type AccountingHistoryResponse =
  | AccountingDirectResponse
  | AccountingWrappedResponse;

function unwrapAccountingResponse(
  json: AccountingHistoryResponse
): AccountingDirectResponse {
  if (Array.isArray((json as AccountingDirectResponse)?.data)) {
    return json as AccountingDirectResponse;
  }

  const wrappedData = (json as AccountingWrappedResponse)?.data;

  if (wrappedData && Array.isArray(wrappedData.data)) {
    return wrappedData;
  }

  return {
    code: (json as AccountingDirectResponse)?.code,
    status: json?.status,
    message: json?.message,
    data: [],
  };
}

function buildAccountingHistoryPayload(params: {
  nosbb: string;
  dateFrom: string;
  dateTo: string;
}) {
  return {
    filter: {
      general: {
        batch: null,
        userinput: "",
        userotor: "",
        otorrev: "",
        chguser: "",
        status_transaksi: "",
        kode_pt: "",
        kode_kantor: "",
        kode_induk: "",
        rrn: null,
        no_dokumen: null,
        no_reff: null,
        flag_trn: "0",
        acquirer: null,
        merchant: "MOTION_PAY",
      },
      range_tanggal: {
        from: "",
        to: "",
      },
      range_tanggal_valuta: {
        from: params.dateFrom,
        to: params.dateTo,
      },
      akun: {
        dracc: params.nosbb,
        cracc: params.nosbb,
      },
      range_nominal: {
        min: null,
        max: null,
      },
    },
    pagination: {
      page: 1,
    },
    sort: {
      by: "tgl_transaksi",
      order: "desc",
    },
  };
}

export async function getAccountingHistory(params: {
  nosbb: string;
  dateFrom: string;
  dateTo: string;
}): Promise<AccountingHistoryItem[]> {
  const payload = buildAccountingHistoryPayload(params);

  const response = await fetch("/api/accounting/transaksi-search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const json: AccountingHistoryResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      json?.message || "Gagal mengambil history transaksi accounting"
    );
  }

  const result = unwrapAccountingResponse(json);

  if (result?.code && result.code !== "000") {
    throw new Error(
      result?.message || "Gagal mengambil history transaksi accounting"
    );
  }

  if (String(result?.status || "").toLowerCase() === "error") {
    throw new Error(
      result?.message || "Gagal mengambil history transaksi accounting"
    );
  }

  return Array.isArray(result.data) ? result.data : [];
}