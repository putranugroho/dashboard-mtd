import { MasterGLNode } from "@/modules/setup-relasi-rekonsiliasi/types";

export async function getMasterGLSubtree(
  kodePt = process.env.NEXT_PUBLIC_DEFAULT_KODE_PT || "001"
): Promise<MasterGLNode[]> {
  const response = await fetch("/api/accounting/subtree", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kode_pt: kodePt,
    }),
    cache: "no-store",
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Gagal memuat master GL subtree");
  }

  if (json?.status && String(json.status).toLowerCase() !== "success") {
    throw new Error(json?.message || "Gagal memuat master GL subtree");
  }

  return json?.data ?? [];
}