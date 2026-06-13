import { NextRequest, NextResponse } from "next/server";

const CIS_API_KEY = process.env.CIS_API_KEY || "rahasia";
const CIS_COLLECTOR_ENDPOINT =
  process.env.CIS_COLLECTOR_ENDPOINT ||
  "https://web-service-cis.medtrans.id/cis/collector/inquiry-db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const bprId = String(body?.bprId ?? body?.bpr_id ?? "").trim();

    if (!bprId) {
      return NextResponse.json(
        {
          code: "400",
          status: "error",
          message: "BPR wajib diisi.",
          data: {
            list: [],
            page: 1,
            size: 10,
            total: 0,
            total_pages: 0,
          },
        },
        { status: 400 }
      );
    }

    const payload = {
      bpr_id: bprId,
      keyword: String(body?.keyword ?? "").trim(),
      kd_kantor: String(body?.kdKantor ?? body?.kd_kantor ?? "").trim(),
      stsaktif:
        body?.statusAktif && body.statusAktif !== "ALL" && body.statusAktif !== "NON_ACTIVE"
          ? String(body.statusAktif)
          : "",
      page: Number(body?.page ?? 1),
      size: Number(body?.size ?? 100),
    };

    const response = await fetch(CIS_COLLECTOR_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CIS_API_KEY,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const json = await response.json();

    return NextResponse.json(json, {
      status: response.ok ? 200 : response.status,
    });
  } catch (error) {
    console.error("POST /api/monitoring-akun-coll-me error:", error);

    return NextResponse.json(
      {
        code: "500",
        status: "error",
        message: "Gagal mengambil data collector Coll Me.",
        data: {
          list: [],
          page: 1,
          size: 10,
          total: 0,
          total_pages: 0,
        },
      },
      { status: 500 }
    );
  }
}