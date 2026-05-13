"use client";

import { Download } from "lucide-react";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getMonitoringAkunIBPR } from "@/lib/api/monitoring-akun-ibpr";
import AkunIBPRFilterBar from "./AkunIBPRFilterBar";
import AkunIBPRSummaryCards from "./AkunIBPRSummaryCards";
import AkunIBPRTable from "./AkunIBPRTable";
import { AkunIBPRFilter, AkunIBPRItem, AkunIBPRSummary } from "./types";

const initialFilter: AkunIBPRFilter = {
  bprId: "",
  statusToken: "ALL",
  statusDelete: "ALL",
  statusLock: "ALL",
  development: "ALL",
  keyword: "",
};

function buildSummary(data: AkunIBPRItem[]): AkunIBPRSummary {
  return {
    total: data.length,
    withToken: data.filter((item) => item.token.trim().length > 0).length,
    withoutToken: data.filter((item) => item.token.trim().length === 0).length,
    deleted: data.filter((item) => item.is_deleted === "Y").length,
    active: data.filter((item) => item.is_deleted !== "Y").length,
    locked: data.filter((item) => item.is_lock === "Y").length,
    unlocked: data.filter((item) => item.is_lock !== "Y").length,
    development: data.filter((item) => item.development === "Y").length,
    production: data.filter((item) => item.development !== "Y").length,
  };
}

function matchKeyword(item: AkunIBPRItem, keyword: string) {
  if (!keyword) return true;

  const haystack = [
    item.users_id,
    item.bpr_id,
    item.nama_lengkap,
    item.no_rekening,
    item.nomor_ponsel,
    item.no_ktp,
    item.is_lock,
    item.is_deleted,
    item.deviceId,
    item.development,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(keyword.toLowerCase());
}

function downloadCsv(filename: string, rows: AkunIBPRItem[]) {
  const headers = [
    "ID",
    "User ID",
    "Nama Lengkap",
    "BPR ID",
    "No Rekening",
    "Nomor Ponsel",
    "No KTP",
    "Has Token",
    "Token",
    "Is Lock",
    "Is Deleted",
    "Device ID",
    "Development",
    "Created Date",
  ];

  const content = rows.map((item) => [
    item.id,
    item.users_id,
    item.nama_lengkap,
    item.bpr_id,
    item.no_rekening,
    item.nomor_ponsel,
    item.no_ktp,
    item.token.trim() ? "Y" : "N",
    item.token,
    item.is_lock,
    item.is_deleted,
    item.deviceId,
    item.development,
    item.createdDate,
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

export default function MonitoringAkunIBPRPage() {
  const { can } = useSession();
  const canSearch = can(PERMISSIONS.MONITORING_AKUN_IBPR_SEARCH);
  const canExport = can(PERMISSIONS.MONITORING_AKUN_IBPR_EXPORT);
  const [filter, setFilter] = useState<AkunIBPRFilter>(initialFilter);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AkunIBPRItem[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);

      const result = await getMonitoringAkunIBPR({
        bprId: filter.bprId,
      });

      setData(result);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat data monitoring akun IBPR."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const deleted = item.is_deleted === "Y";
      const hasToken = item.token.trim().length > 0;
      const locked = item.is_lock === "Y";
      const isDevelopment = item.development === "Y";

      if (filter.bprId && item.bpr_id !== filter.bprId) return false;
      if (filter.statusToken === "WITH_TOKEN" && !hasToken) return false;
      if (filter.statusToken === "WITHOUT_TOKEN" && hasToken) return false;
      if (filter.statusDelete === "ACTIVE" && deleted) return false;
      if (filter.statusDelete === "DELETED" && !deleted) return false;
      if (filter.statusLock === "LOCKED" && !locked) return false;
      if (filter.statusLock === "UNLOCKED" && locked) return false;
      if (filter.development === "DEVELOPMENT" && !isDevelopment) return false;
      if (filter.development === "PRODUCTION" && isDevelopment) return false;

      return matchKeyword(item, filter.keyword.trim());
    });
  }, [data, filter]);

  const summary = useMemo(() => buildSummary(filteredData), [filteredData]);

  const handleDownload = () => {
    if (!canExport) { window.alert("Anda tidak memiliki akses export monitoring akun IBPR."); return; }
    downloadCsv(
      `monitoring-akun-ibpr-${filter.bprId || "all"}.csv`,
      filteredData
    );
  };

  return (
    <div className="space-y-6">
      <AkunIBPRFilterBar
        filter={filter}
        loading={loading}
        onChange={setFilter}
        onReload={loadData}
      />

      <AkunIBPRSummaryCards summary={summary} />

      <div className="flex flex-col justify-between gap-3 rounded-2xl border bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Hasil Monitoring Akun IBPR
          </h2>
          <p className="text-sm text-gray-500">
            Data ditampilkan dalam satu tabel karena users_ibpr tidak memiliki role.
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

      <AkunIBPRTable data={filteredData} />
    </div>
  );
}