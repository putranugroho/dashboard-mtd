import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.ACCOUNTING_API_KEY || "123";
const BASE_URL =
  process.env.ACCOUNTING_API_BASE_URL || "http://103.96.147.187:6002";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${BASE_URL}/saldogl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const json = await response.json();

    return NextResponse.json(json, {
      status: response.ok ? 200 : response.status,
    });
  } catch (error) {
    console.error("POST /api/accounting/saldogl error:", error);

    return NextResponse.json(
      {
        code: "500",
        status: "error",
        message: "Gagal mengambil saldo accounting",
        data: [],
      },
      { status: 500 }
    );
  }
}