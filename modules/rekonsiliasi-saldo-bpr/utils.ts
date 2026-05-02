import { SaldoMTDItem } from "@/modules/saldo-rekening-mtd/types";
import {
  RekonMappingListItem,
  RekonsiliasiBuildInput,
  RekonsiliasiRow,
  SaldoGLItem,
} from "./types";

function toNumber(value: string | number | undefined | null): number {
  const num = Number(value ?? 0);
  return Number.isNaN(num) ? 0 : num;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getNowReconLabel(date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${dd}-${mm}-${yyyy} ${hh}:${mi}:${ss}`;
}

function deriveSourceType(item: SaldoMTDItem): "REK" | "GL" {
  return String(item.jns_rek) === "2" ? "GL" : "REK";
}

function findMapping(
  item: SaldoMTDItem,
  mappings: RekonMappingListItem[]
): RekonMappingListItem | undefined {
  const sourceType = deriveSourceType(item);

  return mappings.find(
    (mapping) =>
      mapping.is_active === true &&
      String(mapping.source_type).toUpperCase() === sourceType &&
      String(mapping.source_code) === String(item.no_rek)
  );
}

function buildSaldoGLMap(items: SaldoGLItem[]) {
  const map = new Map<string, SaldoGLItem>();

  for (const item of items) {
    const key = `${item.nosbb}::${item.nobb}`;
    map.set(key, item);
  }

  return map;
}

export function buildRekonsiliasiRows({
  saldoItems,
  mappings,
  saldoGLItems,
  reconAt,
}: RekonsiliasiBuildInput): RekonsiliasiRow[] {
  const saldoGLMap = buildSaldoGLMap(saldoGLItems);

  return saldoItems.map((item) => {
    const mapping = findMapping(item, mappings);

    const saldoBpr = toNumber(item.saldoakhir);
    const saldoGL = mapping
      ? saldoGLMap.get(`${mapping.sbb_code}::${mapping.sbb_nobb}`)
      : undefined;

    const saldoAcct = saldoGL ? toNumber(saldoGL.saldo_akhir) : 0;
    const selisih = saldoAcct - saldoBpr;

    return {
      source_type: deriveSourceType(item),
      source_code: String(item.no_rek ?? ""),
      source_name: String(item.nama ?? ""),

      saldo_bpr: saldoBpr,
      saldo_acct: saldoAcct,
      selisih,

      sbb_code: mapping?.sbb_code || "",
      sbb_name: mapping?.sbb_name || "-",
      sbb_nobb: mapping?.sbb_nobb || "",
      accounting_name: saldoGL?.nama_account || mapping?.sbb_name || "-",

      status: selisih === 0 ? "MATCH" : "NOT_MATCH",
      recon_at: reconAt,
    };
  });
}

export function downloadRekonsiliasiCsv(
  rows: RekonsiliasiRow[],
  bprId: string,
  reconAt: string
) {
  const headers = [
    "Rek/GL",
    "Kode Source",
    "Nama Rek / GL",
    "Saldo BPR",
    "Selisih",
    "Saldo Acct",
    "Accounting",
    "No SBB",
    "Waktu Rekon",
  ];

  const content = rows.map((row) => [
    row.source_type,
    row.source_code,
    row.source_name,
    row.saldo_bpr,
    row.selisih,
    row.saldo_acct,
    row.accounting_name || "-",
    row.sbb_code || "-",
    reconAt,
  ]);

  const csv = [headers, ...content]
    .map((row) =>
      row
        .map((col) => `"${String(col ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", `rekonsiliasi-saldo-bpr-${bprId || "data"}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}