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

function norm(value: string | number | undefined | null): string {
  return String(value ?? "").trim();
}

function normUpper(value: string | number | undefined | null): string {
  return norm(value).toUpperCase();
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
  return norm(item.jns_rek) === "2" ? "GL" : "REK";
}

function sourceKey(sourceType: string, sourceCode: string): string {
  return `${normUpper(sourceType)}::${norm(sourceCode)}`;
}

function saldoGLKey(nosbb: string, nobb: string): string {
  return `${norm(nosbb)}::${norm(nobb)}`;
}

function buildMappingMap(mappings: RekonMappingListItem[]) {
  const map = new Map<string, RekonMappingListItem>();

  for (const mapping of mappings) {
    if (!mapping.is_active) continue;

    const key = sourceKey(mapping.source_type, mapping.source_code);
    map.set(key, mapping);
  }

  return map;
}

function buildSaldoGLMap(items: SaldoGLItem[]) {
  const map = new Map<string, SaldoGLItem>();

  for (const item of items) {
    const key = saldoGLKey(item.nosbb, item.nobb);
    map.set(key, item);
  }

  return map;
}

function buildRowFromSaldoItem({
  item,
  mapping,
  saldoGL,
  reconAt,
}: {
  item: SaldoMTDItem;
  mapping?: RekonMappingListItem;
  saldoGL?: SaldoGLItem;
  reconAt: string;
}): RekonsiliasiRow {
  const saldoBpr = toNumber(item.saldoakhir);
  const saldoAcct = saldoGL ? toNumber(saldoGL.saldo_akhir) : 0;
  const selisih = saldoAcct - saldoBpr;

  return {
    source_type: deriveSourceType(item),
    source_code: norm(item.no_rek),
    source_name: norm(item.nama),

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
}

function buildRowFromMappingOnly({
  mapping,
  saldoGL,
  reconAt,
}: {
  mapping: RekonMappingListItem;
  saldoGL?: SaldoGLItem;
  reconAt: string;
}): RekonsiliasiRow {
  const saldoBpr = 0;
  const saldoAcct = saldoGL ? toNumber(saldoGL.saldo_akhir) : 0;
  const selisih = saldoAcct - saldoBpr;

  return {
    source_type: normUpper(mapping.source_type) === "GL" ? "GL" : "REK",
    source_code: norm(mapping.source_code),
    source_name: norm(mapping.source_name),

    saldo_bpr: saldoBpr,
    saldo_acct: saldoAcct,
    selisih,

    sbb_code: mapping.sbb_code || "",
    sbb_name: mapping.sbb_name || "-",
    sbb_nobb: mapping.sbb_nobb || "",
    accounting_name: saldoGL?.nama_account || mapping.sbb_name || "-",

    status: selisih === 0 ? "MATCH" : "NOT_MATCH",
    recon_at: reconAt,
  };
}

function normalizeName(value: string | number | undefined | null): string {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
}

function buildMappingNameMap(mappings: RekonMappingListItem[]) {
  const map = new Map<string, RekonMappingListItem>();

  for (const mapping of mappings) {
    if (!mapping.is_active) continue;

    const nameKey = normalizeName(mapping.source_name);
    if (!nameKey) continue;

    if (!map.has(nameKey)) {
      map.set(nameKey, mapping);
    }
  }

  return map;
}

export function buildRekonsiliasiRows({
  saldoItems,
  mappings,
  saldoGLItems,
  reconAt,
}: RekonsiliasiBuildInput): RekonsiliasiRow[] {
  const mappingMap = buildMappingMap(mappings);
  const mappingNameMap = buildMappingNameMap(mappings);
  const saldoGLMap = buildSaldoGLMap(saldoGLItems);

  return saldoItems.map((item) => {
    const exactKey = sourceKey(deriveSourceType(item), norm(item.no_rek));

    let mapping = mappingMap.get(exactKey);

    // fallback: cocokkan berdasarkan nama rekening / GL
    if (!mapping) {
      const nameKey = normalizeName(item.nama);
      mapping = mappingNameMap.get(nameKey);
    }

    const saldoGL =
      mapping && mapping.sbb_code && mapping.sbb_nobb
        ? saldoGLMap.get(saldoGLKey(mapping.sbb_code, mapping.sbb_nobb))
        : undefined;

    return buildRowFromSaldoItem({
      item,
      mapping,
      saldoGL,
      reconAt,
    });
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