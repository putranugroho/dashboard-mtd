import { AccountingCoaNode, AccountingCoaOption } from "./types";

type ParentCtx = {
  namaBB: string;
  noBB: string;
  noSbbBB: string;
  golAcc: string;
};

function walkNodes(
  nodes: AccountingCoaNode[],
  parent: ParentCtx | null,
  result: AccountingCoaOption[]
) {
  for (const node of nodes ?? []) {
    const currentJns = (node.jns_acc || "").toUpperCase();
    const currentPosting = (node.type_posting || "").toUpperCase();
    const currentNonaktif = (node.nonaktif || "").toUpperCase();

    let nextParent = parent;

    if (currentJns === "B") {
      const bbCode = node.nosbb || node.nobb || "";

      nextParent = {
        namaBB: node.nama_sbb || "",
        noBB: bbCode,
        noSbbBB: bbCode,
        golAcc: node.gol_acc || "",
      };
    }

    const isLeafPosting =
      currentJns === "C" &&
      currentPosting === "Y" &&
      currentNonaktif !== "Y" &&
      !!nextParent;

    if (isLeafPosting && nextParent) {
      result.push({
        gol_acc: node.gol_acc || nextParent.golAcc || "",
        nobb: nextParent.noBB || node.nobb || "",
        nosbb_bb: nextParent.noSbbBB || "",
        nama_bb: nextParent.namaBB || "",
        nosbb: node.nosbb || "",
        nama_sbb: node.nama_sbb || "",
        jns_acc: node.jns_acc || "",
        type_posting: node.type_posting || "",
        akun_perantara: node.akun_perantara || "",
        nonaktif: node.nonaktif || "",
        hutang: node.hutang || "",
        piutang: node.piutang || "",
      });
    }

    if (node.children?.length) {
      walkNodes(node.children, nextParent, result);
    }
  }
}

export function flattenAccountingSubtree(
  nodes: AccountingCoaNode[]
): AccountingCoaOption[] {
  const result: AccountingCoaOption[] = [];
  walkNodes(nodes, null, result);
  return result;
}

export function getUniqueBB(options: AccountingCoaOption[]) {
  const map = new Map<
    string,
    { nobb: string; nosbb_bb: string; nama_bb: string; gol_acc: string }
  >();

  options.forEach((item) => {
    if (!item.nobb) return;
    if (!map.has(item.nobb)) {
      map.set(item.nobb, {
        nobb: item.nobb,
        nosbb_bb: item.nosbb_bb,
        nama_bb: item.nama_bb,
        gol_acc: item.gol_acc,
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => a.nobb.localeCompare(b.nobb));
}

export function getSbbByBB(options: AccountingCoaOption[], nobb: string) {
  return options
    .filter((item) => item.nobb === nobb)
    .sort((a, b) => a.nosbb.localeCompare(b.nosbb));
}