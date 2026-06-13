"use client";

import { Download } from "lucide-react";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { getMonitoringUserAccounts } from "@/lib/api/user-account-monitoring";
import UserAccountFilterBar from "./UserAccountFilterBar";
import UserAccountSummaryCards from "./UserAccountSummaryCards";
import UserAccountTable from "./UserAccountTable";
import { UserAccountFilter, UserAccountItem, UserAccountSummary } from "./types";

const initialFilter: UserAccountFilter = {
  bprId: "",
  role: "ALL",
  statusToken: "ALL",
  statusDelete: "ACTIVE",
  keyword: "",
};

function buildSummary(data: UserAccountItem[]): UserAccountSummary {
  return {
    total: data.length,
    nasabah: data.filter((item) => item.role === "NASABAH").length,
    staff: data.filter((item) => item.role === "STAFF").length,
    withToken: data.filter((item) => item.token.trim().length > 0).length,
    withoutToken: data.filter((item) => item.token.trim().length === 0).length,
    deleted: data.filter((item) => item.is_deleted === "Y" || Boolean(item.deleted_at)).length,
    active: data.filter((item) => item.is_deleted !== "Y" && !item.deleted_at).length,
  };
}

function matchKeyword(item: UserAccountItem, keyword: string) {
  if (!keyword) return true;
  const haystack = [
    item.no_cif,
    item.username,
    item.bpr_id,
    item.kd_kantor,
    item.nama,
    item.phone,
    item.no_identitas,
    item.role,
    item.is_deleted,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(keyword.toLowerCase());
}

function downloadCsv(filename: string, rows: UserAccountItem[]) {
  const headers = [
    "ID",
    "Role",
    "Username",
    "Nama",
    "BPR ID",
    "KD Kantor",
    "No CIF",
    "Phone",
    "No Identitas",
    "Has Token",
    "Token",
    "Status",
    "Created At",
    "Updated At",
    "Deleted At",
  ];

  const content = rows.map((item) => [
    item.id,
    item.role,
    item.username,
    item.nama,
    item.bpr_id,
    item.kd_kantor,
    item.no_cif,
    item.phone,
    item.no_identitas,
    item.token.trim() ? "Y" : "N",
    item.token,
    item.is_deleted,
    item.created_at,
    item.updated_at,
    item.deleted_at,
  ]);

  const csv = [headers, ...content]
    .map((row) => row.map((col) => `"${String(col ?? "").replace(/"/g, '""')}"`).join(","))
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

export default function MonitoringUserAccountPage() {
  const { can } = useSession();
  const canSearch = can(PERMISSIONS.MONITORING_USER_ACCOUNT_SEARCH);
  const canExport = can(PERMISSIONS.MONITORING_USER_ACCOUNT_EXPORT);
  const [filter, setFilter] = useState<UserAccountFilter>(initialFilter);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UserAccountItem[]>([]);

  const loadData = async () => {
    const bprId = filter.bprId.trim();

    if (!bprId) {
      window.alert("BPR wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      const result = await getMonitoringUserAccounts({
        bprId,
        role: filter.role,
      });
      setData(result);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat data monitoring user account."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const deleted = item.is_deleted === "Y" || Boolean(item.deleted_at);
      const hasToken = item.token.trim().length > 0;

      if (filter.bprId && item.bpr_id !== filter.bprId) return false;
      if (filter.role !== "ALL" && item.role !== filter.role) return false;
      if (filter.statusToken === "WITH_TOKEN" && !hasToken) return false;
      if (filter.statusToken === "WITHOUT_TOKEN" && hasToken) return false;
      if (filter.statusDelete === "ACTIVE" && deleted) return false;
      if (filter.statusDelete === "DELETED" && !deleted) return false;

      return matchKeyword(item, filter.keyword.trim());
    });
  }, [data, filter]);

  const summary = useMemo(() => buildSummary(filteredData), [filteredData]);
  const nasabahData = useMemo(
    () => filteredData.filter((item) => item.role === "NASABAH"),
    [filteredData]
  );
  const staffData = useMemo(
    () => filteredData.filter((item) => item.role === "STAFF"),
    [filteredData]
  );

  const handleDownload = () => {
    if (!canExport) { window.alert("Anda tidak memiliki akses export monitoring user account."); return; }
    downloadCsv(
      `monitoring-user-account-${filter.bprId || "all"}-${filter.role.toLowerCase()}.csv`,
      filteredData
    );
  };

  return (
    <div className="space-y-6">
      <UserAccountFilterBar
        filter={filter}
        loading={loading}
        onChange={setFilter}
        onReload={loadData}
        canSearch={canSearch}
      />

      <UserAccountSummaryCards summary={summary} />

      {(filter.role === "ALL" || filter.role === "NASABAH") && (
        <UserAccountTable title="Account NASABAH" role="NASABAH" data={nasabahData} />
      )}

      {(filter.role === "ALL" || filter.role === "STAFF") && (
        <UserAccountTable title="Account STAFF" role="STAFF" data={staffData} />
      )}
    </div>
  );
}
