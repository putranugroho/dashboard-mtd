"use client";

import { Download } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getMonitoringAkunCollMe } from "@/lib/api/monitoring-akun-coll-me";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import CollMeFilterBar from "./CollMeFilterBar";
import CollMeSummaryCards from "./CollMeSummaryCards";
import CollMeTable from "./CollMeTable";
import {
  CollMeCollectorItem,
  CollMeFilter,
  CollMeSummary,
} from "./types";

const initialFilter: CollMeFilter = {
  bprId: "",
  keyword: "",
  kdKantor: "",
  statusAktif: "A",
};

function buildSummary(data: CollMeCollectorItem[]): CollMeSummary {
  return {
    total: data.length,
    active: data.filter((item) => item.stsaktif === "A").length,
    inactive: data.filter((item) => item.stsaktif !== "A").length,
    login: data.filter((item) => item.stslogin === "Y").length,
    notLogin: data.filter((item) => item.stslogin !== "Y").length,
    blocked: data.filter((item) => item.blokirpass === "Y").length,
    passwordWrong: data.filter((item) => item.pass_salah > 0).length,
  };
}

function matchKeyword(item: CollMeCollectorItem, keyword: string) {
  if (!keyword) return true;

  const normalizedKeyword = keyword.toLowerCase();

  const haystack = [
    item.userid,
    item.nama,
    item.bpr_id,
    item.kd_kantor,
    item.nohp,
    item.nosbb,
    item.nama_sbb,
    item.created_by,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedKeyword);
}

function downloadCsv(filename: string, rows: CollMeCollectorItem[]) {
  const headers = [
    "ID",
    "Backend ID",
    "User ID",
    "Nama Collector",
    "BPR ID",
    "Kantor",
    "No HP",
    "No SBB",
    "Nama SBB",
    "Status Login",
    "Status Aktif",
    "Pass Salah",
    "Blokir Pass",
    "Created At",
    "Created By",
    "Updated At",
  ];

  const content = rows.map((item) => [
    item.id,
    item.backend_id,
    item.userid,
    item.nama,
    item.bpr_id,
    item.kd_kantor,
    item.nohp,
    item.nosbb,
    item.nama_sbb,
    item.stslogin,
    item.stsaktif,
    item.pass_salah,
    item.blokirpass,
    item.created_at,
    item.created_by,
    item.updated_at,
  ]);

  const csv = [headers, ...content]
    .map((row) =>
      row.map((col) => `"${String(col ?? "").replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function MonitoringAkunCollMePage() {
  const { can } = useSession();
  const canSearch = can(PERMISSIONS.MONITORING_AKUN_COLL_ME_SEARCH);
  const canExport = can(PERMISSIONS.MONITORING_AKUN_COLL_ME_EXPORT);

  const [filter, setFilter] = useState<CollMeFilter>(initialFilter);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CollMeCollectorItem[]>([]);

  const loadData = async () => {
    const bprId = filter.bprId.trim();

    if (!bprId) {
      window.alert("BPR wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const result = await getMonitoringAkunCollMe({
        bprId,
        keyword: filter.keyword.trim(),
        kdKantor: filter.kdKantor.trim(),
        statusAktif: filter.statusAktif,
        page: 1,
        size: 100,
      });

      setData(result.items);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat data monitoring akun Coll Me."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filter.bprId && item.bpr_id !== filter.bprId) return false;

      if (
        filter.kdKantor.trim() &&
        item.kd_kantor !== filter.kdKantor.trim()
      ) {
        return false;
      }

      if (filter.statusAktif === "A" && item.stsaktif !== "A") return false;

      if (
        filter.statusAktif === "NON_ACTIVE" &&
        item.stsaktif === "A"
      ) {
        return false;
      }

      return matchKeyword(item, filter.keyword.trim());
    });
  }, [data, filter]);

  const summary = useMemo(() => buildSummary(filteredData), [filteredData]);

  const handleDownload = () => {
    if (!canExport) {
      window.alert("Anda tidak memiliki akses export monitoring akun Coll Me.");
      return;
    }

    downloadCsv(
      `monitoring-akun-coll-me-${filter.bprId || "all"}.csv`,
      filteredData
    );
  };

  return (
    <div className="space-y-6">
      <CollMeFilterBar
        filter={filter}
        loading={loading}
        canSearch={canSearch}
        onChange={setFilter}
        onReload={loadData}
      />

      <CollMeSummaryCards summary={summary} />

      <div className="flex flex-col justify-between gap-3 rounded-2xl border bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Data Collector Coll Me
          </h2>
          <p className="text-sm text-gray-500">
            Filter aktif: BPR, keyword, kantor, dan status aktif.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleDownload}
          disabled={filteredData.length === 0 || !canExport}
          title={!canExport ? "Anda tidak memiliki akses export." : undefined}
        >
          <Download className="mr-2 size-4" />
          Download Excel
        </Button>
      </div>

      <CollMeTable data={filteredData} />
    </div>
  );
}