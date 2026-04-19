import {
  MasterGLNode,
  RekonMappingListItem,
  RelasiRow,
  RelasiSummary,
  SBBOption,
} from "./types";
import { SaldoMTDSourceItem } from "@/lib/api/saldo-mtd";

type ParentCtx = {
  bb_code: string;
  bb_name: string;
};

function walkNodes(
  nodes: MasterGLNode[],
  parent: ParentCtx | null,
  result: SBBOption[]
) {
  for (const node of nodes ?? []) {
    const currentJns = String(node.jns_acc || "").toUpperCase();
    const currentPosting = String(node.type_posting || "").toUpperCase();
    const currentNonaktif = String(node.nonaktif || "").toUpperCase();

    let nextParent = parent;

    if (currentJns === "B") {
      nextParent = {
        bb_code: node.nosbb || node.nobb || "",
        bb_name: node.nama_sbb || "",
      };
    }

    const isLeafPosting =
      currentJns === "C" &&
      currentPosting === "Y" &&
      currentNonaktif !== "Y" &&
      !!nextParent;

    if (isLeafPosting && nextParent) {
      result.push({
        bb_code: nextParent.bb_code,
        bb_name: nextParent.bb_name,
        sbb_code: node.nosbb || "",
        sbb_name: node.nama_sbb || "",
        sbb_nobb: node.nobb || "",
        sbb_gol_acc: node.gol_acc || "",
        sbb_jns_acc: node.jns_acc || "",
        sbb_type_posting: node.type_posting || "",
        sbb_nonaktif: node.nonaktif || "",
        label: `${nextParent.bb_name} -> ${node.nama_sbb || ""}`,
      });
    }

    if (node.children?.length) {
      walkNodes(node.children, nextParent, result);
    }
  }
}

export function flattenMasterGLToSBBOptions(nodes: MasterGLNode[]): SBBOption[] {
  const result: SBBOption[] = [];
  walkNodes(nodes, null, result);

  return result.sort((a, b) => {
    const byBB = a.bb_name.localeCompare(b.bb_name);
    if (byBB !== 0) return byBB;
    return a.sbb_name.localeCompare(b.sbb_name);
  });
}

export function buildRelasiRows(
  sources: SaldoMTDSourceItem[],
  mappings: RekonMappingListItem[],
  options: SBBOption[]
): RelasiRow[] {
  const safeMappings = Array.isArray(mappings) ? mappings : [];

  return sources.map((source) => {
    const mapping = safeMappings.find(
      (item) =>
        String(item.source_type).toUpperCase() ===
          String(source.source_type).toUpperCase() &&
        String(item.source_code) === String(source.source_code) &&
        item.is_active === true
    );

    const selectedOption = mapping
      ? options.find((option) => option.sbb_code === mapping.sbb_code)
      : undefined;

    return {
      id: mapping?.id,
      source_type: source.source_type,
      source_code: source.source_code,
      source_name: source.source_name,

      selected_sbb_code: mapping?.sbb_code || "",
      selected_sbb_name: mapping?.sbb_name || "",
      selected_sbb_nobb: mapping?.sbb_nobb || "",
      selected_sbb_gol_acc: mapping?.sbb_gol_acc || "",
      selected_sbb_jns_acc: mapping?.sbb_jns_acc || "",
      selected_sbb_type_posting: mapping?.sbb_type_posting || "",
      selected_sbb_nonaktif: mapping?.sbb_nonaktif || "",

      selected_label: selectedOption?.label || "",

      is_active: mapping?.is_active ?? true,
      is_changed: false,
    };
  });
}

export function buildRelasiSummary(rows: RelasiRow[]): RelasiSummary {
  const mapped = rows.filter((item) => item.selected_sbb_code).length;
  return {
    total: rows.length,
    mapped,
    unmapped: rows.length - mapped,
  };
}

export function applySBBToRow(row: RelasiRow, option: SBBOption | null): RelasiRow {
  if (!option) {
    return {
      ...row,
      selected_sbb_code: "",
      selected_sbb_name: "",
      selected_sbb_nobb: "",
      selected_sbb_gol_acc: "",
      selected_sbb_jns_acc: "",
      selected_sbb_type_posting: "",
      selected_sbb_nonaktif: "",
      selected_label: "",
      is_changed: true,
    };
  }

  return {
    ...row,
    selected_sbb_code: option.sbb_code,
    selected_sbb_name: option.sbb_name,
    selected_sbb_nobb: option.sbb_nobb,
    selected_sbb_gol_acc: option.sbb_gol_acc,
    selected_sbb_jns_acc: option.sbb_jns_acc,
    selected_sbb_type_posting: option.sbb_type_posting,
    selected_sbb_nonaktif: option.sbb_nonaktif,
    selected_label: option.label,
    is_changed: true,
  };
}