import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch("https://geacct.medtrans.id/mastergl/subtree", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": "123", // 🔥 sesuaikan kalau nanti dynamic
      },
      body: JSON.stringify({
        kode_pt: body.kode_pt || "001",
      }),
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          message: json?.message || "Failed fetch subtree",
          data: [],
        },
        { status: 500 }
      );
    }

    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error fetching subtree",
        data: [],
      },
      { status: 500 }
    );
  }
}