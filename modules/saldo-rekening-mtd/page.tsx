"use client";

import { ArrowLeft, Download, RefreshCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import {
  getSaldoMTDMonitoringDetail,
  getSaldoMTDMonitoringSummary,
  refreshSaldoMTDMonitoringBpr,
  refreshSaldoMTDMonitoringAll,
  getSaldoMTDMonitoringSyncLog,
  type SaldoMTDSyncLogItem,
} from "@/lib/api/saldo-mtd";

import MonitoringDetailTable from "./MonitoringDetailTable";
import MonitoringSummaryCards from "./MonitoringSummaryCards";
import MonitoringSummaryTable from "./MonitoringSummaryTable";
import MonitoringSyncLogTable from "./MonitoringSyncLogTable";
import type {
  SaldoMTDMonitoringDetailItem,
  SaldoMTDMonitoringGlobalSummary,
  SaldoMTDMonitoringSummaryItem,
} from "./types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function formatDateTime(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function toNumber(value: unknown) {
  const num = Number(value || 0);
  return Number.isNaN(num) ? 0 : num;
}

function buildGlobalSummary(
  data: SaldoMTDMonitoringSummaryItem[]
): SaldoMTDMonitoringGlobalSummary {
  const latestSync = data
    .map((item) => item.last_sync_at)
    .filter(Boolean)
    .sort()
    .pop();

  return {
    totalBpr: data.length,
    totalBprWithData: data.filter((item) => Number(item.count_all || 0) > 0)
      .length,
    totalBprNoData: data.filter((item) => Number(item.count_all || 0) <= 0)
      .length,

    totalRekening: data.reduce(
      (acc, item) => acc + toNumber(item.total_rekening),
      0
    ),
    totalGL: data.reduce((acc, item) => acc + toNumber(item.total_gl), 0),
    totalAll: data.reduce((acc, item) => acc + toNumber(item.total_all), 0),

    countRekening: data.reduce(
      (acc, item) => acc + Number(item.count_rekening || 0),
      0
    ),
    countGL: data.reduce((acc, item) => acc + Number(item.count_gl || 0), 0),
    countAll: data.reduce((acc, item) => acc + Number(item.count_all || 0), 0),

    latestSyncAt: latestSync || null,
  };
}

function downloadSummaryCsv(rows: SaldoMTDMonitoringSummaryItem[]) {
  const headers = [
    "BPR ID",
    "Nama BPR",
    "Total Rekening",
    "Total GL",
    "Total Saldo",
    "Count Rekening",
    "Count GL",
    "Count All",
    "Snapshot Date",
    "Last Sync",
    "Sync Status",
    "Sync Message",
  ];

  const content = rows.map((item) => [
    item.bpr_id,
    item.nama_bpr,
    item.total_rekening,
    item.total_gl,
    item.total_all,
    item.count_rekening,
    item.count_gl,
    item.count_all,
    item.snapshot_date || "",
    item.last_sync_at || "",
    item.sync_status || "",
    item.sync_message || "",
  ]);

  downloadCsv("monitoring-saldo-mtd-summary.csv", headers, content);
}

function downloadDetailCsv(
  bprId: string,
  rows: SaldoMTDMonitoringDetailItem[]
) {
  const headers = [
    "BPR ID",
    "Nama BPR",
    "Jenis",
    "No Rek / GL",
    "Nama",
    "Saldo Akhir",
    "Saldo Efektif",
    "Status",
    "Snapshot Date",
    "Last Sync",
  ];

  const content = rows.map((item) => [
    item.bpr_id,
    item.nama_bpr,
    item.jns_rek === "1" ? "GL" : "REKENING",
    item.no_rek,
    item.nama,
    item.saldoakhir,
    item.saldoeff,
    item.status_rek,
    item.snapshot_date || "",
    item.last_sync_at || "",
  ]);

  downloadCsv(`monitoring-saldo-mtd-detail-${bprId}.csv`, headers, content);
}

function downloadCsv(
  filename: string,
  headers: string[],
  content: Array<Array<string | number>>
) {
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
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

export default function SaldoRekeningMTDPage() {
  const { can } = useSession();

  const canView = can(PERMISSIONS.SALDO_REKENING_MTD_VIEW);
  const canExport = can(PERMISSIONS.SALDO_REKENING_MTD_EXPORT);
  const canDetail =
    can(PERMISSIONS.SALDO_REKENING_MTD_DETAIL) ||
    can(PERMISSIONS.SALDO_REKENING_MTD_SEARCH);
  const canRefreshBpr = can(PERMISSIONS.SALDO_REKENING_MTD_REFRESH_BPR);
  const canRefreshAll = can(PERMISSIONS.SALDO_REKENING_MTD_REFRESH_ALL);

  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [refreshingBprId, setRefreshingBprId] = useState("");
  const [refreshingAll, setRefreshingAll] = useState(false);
  const [syncLogs, setSyncLogs] = useState<SaldoMTDSyncLogItem[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("nama_bpr");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [summaryData, setSummaryData] = useState<
    SaldoMTDMonitoringSummaryItem[]
  >([]);

  const [selectedBpr, setSelectedBpr] =
    useState<SaldoMTDMonitoringSummaryItem | null>(null);

  const [detailData, setDetailData] = useState<
    SaldoMTDMonitoringDetailItem[]
  >([]);

  const [detailKeyword, setDetailKeyword] = useState("");
  const [detailJenis, setDetailJenis] = useState<"ALL" | "REKENING" | "GL">(
    "ALL"
  );

  const globalSummary = useMemo(
    () => buildGlobalSummary(summaryData),
    [summaryData]
  );

  const rekeningDetail = useMemo(
    () => detailData.filter((item) => item.jns_rek === "2"),
    [detailData]
  );

  const glDetail = useMemo(
    () => detailData.filter((item) => item.jns_rek === "1"),
    [detailData]
  );

  const loadSummary = async () => {
    if (!canView) return;

    try {
      setLoadingSummary(true);

      const result = await getSaldoMTDMonitoringSummary({
        keyword,
        sort_by: sortBy,
        sort_dir: sortDir,
        limit: 1000,
        offset: 0,
      });

      setSummaryData(result);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat summary saldo MTD."
      );
    } finally {
      setLoadingSummary(false);
    }
  };

  const loadDetail = async (
    item: SaldoMTDMonitoringSummaryItem,
    nextKeyword = detailKeyword,
    nextJenis = detailJenis
  ) => {
    if (!canDetail) {
      window.alert("Anda tidak memiliki akses detail saldo MTD.");
      return;
    }

    try {
      setLoadingDetail(true);
      setSelectedBpr(item);

      const result = await getSaldoMTDMonitoringDetail({
        bpr_id: item.bpr_id,
        keyword: nextKeyword,
        jenis: nextJenis,
        limit: 2000,
        offset: 0,
      });

      setDetailData(result);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat detail saldo MTD."
      );
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleRefreshBpr = async (item: SaldoMTDMonitoringSummaryItem) => {
    if (!canRefreshBpr) {
      window.alert("Anda tidak memiliki akses refresh saldo BPR.");
      return;
    }

    const ok = window.confirm(
      `Refresh saldo MTD untuk BPR "${item.nama_bpr || item.bpr_id}" sekarang?`
    );

    if (!ok) return;

    try {
      setRefreshingBprId(item.bpr_id);

      await refreshSaldoMTDMonitoringBpr(item.bpr_id);

      window.alert("Refresh saldo MTD BPR berhasil.");

      await loadSummary();

      if (selectedBpr?.bpr_id === item.bpr_id) {
        await loadDetail(item, detailKeyword, detailJenis);
      }
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal refresh saldo MTD BPR."
      );
    } finally {
      setRefreshingBprId("");
    }
  };

  const loadSyncLogs = async () => {
    try {
      setLoadingLogs(true);

      const result = await getSaldoMTDMonitoringSyncLog({
        limit: 30,
        offset: 0,
      });

      setSyncLogs(result);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat sync log saldo MTD."
      );
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleRefreshAll = async () => {
    if (!canRefreshAll) {
      window.alert("Anda tidak memiliki akses refresh semua BPR.");
      return;
    }

    const ok = window.confirm(
      "Refresh saldo MTD untuk seluruh BPR aktif sekarang? Proses ini dapat memakan waktu cukup lama."
    );

    if (!ok) return;

    try {
      setRefreshingAll(true);

      const result = await refreshSaldoMTDMonitoringAll("MANUAL_ALL");

      window.alert(
        result
          ? `Refresh all selesai. Success: ${result.success_bpr}, Failed: ${result.failed_bpr}`
          : "Refresh all selesai."
      );

      await loadSummary();
      await loadSyncLogs();
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal refresh saldo semua BPR."
      );
    } finally {
      setRefreshingAll(false);
    }
  };

  const handleToggleLogs = async () => {
    const nextShow = !showLogs;
    setShowLogs(nextShow);

    if (nextShow) {
      await loadSyncLogs();
    }
  };

  useEffect(() => {
    void loadSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSummary = () => {
    void loadSummary();
  };

  const handleRefreshSummary = () => {
    void loadSummary();
  };

  const handleChangeDetailJenis = (value: "ALL" | "REKENING" | "GL") => {
    setDetailJenis(value);
    if (selectedBpr) {
      void loadDetail(selectedBpr, detailKeyword, value);
    }
  };

  const handleSearchDetail = () => {
    if (selectedBpr) {
      void loadDetail(selectedBpr, detailKeyword, detailJenis);
    }
  };

  const backToSummary = () => {
    setSelectedBpr(null);
    setDetailData([]);
    setDetailKeyword("");
    setDetailJenis("ALL");
  };

  if (!canView) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-red-600 shadow-sm">
        Anda tidak memiliki akses untuk melihat Monitoring Saldo Rekening MTD.
      </div>
    );
  }

  if (selectedBpr) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <Button variant="outline" size="sm" onClick={backToSummary}>
                <ArrowLeft className="mr-2 size-4" />
                Kembali
              </Button>

              <div className="mt-4 min-w-0">
                <h1 className="break-words text-xl font-semibold leading-tight text-gray-900 sm:text-2xl">
                  Detail Saldo MTD - {selectedBpr.nama_bpr || selectedBpr.bpr_id}
                </h1>

                <p className="mt-1 text-sm leading-5 text-gray-500">
                  BPR ID: {selectedBpr.bpr_id}
                  <span className="mx-2 p-2 text-gray-300">•</span>
                  Last sync: {formatDateTime(selectedBpr.last_sync_at)}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                variant="outline"
                disabled={!canRefreshBpr || refreshingBprId === selectedBpr.bpr_id}
                onClick={() => handleRefreshBpr(selectedBpr)}
                title={!canRefreshBpr ? "Anda tidak memiliki akses refresh BPR." : undefined}
              >
                <RefreshCcw className="mr-2 size-4" />
                {refreshingBprId === selectedBpr.bpr_id ? "Refreshing..." : "Refresh BPR"}
              </Button>

              <Button
                disabled={!canExport || detailData.length === 0}
                onClick={() => downloadDetailCsv(selectedBpr.bpr_id, detailData)}
                title={!canExport ? "Anda tidak memiliki akses export." : undefined}
              >
                <Download className="mr-2 size-4" />
                Export Detail
              </Button>
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_120px] lg:items-end">
            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium leading-5 text-gray-700">
                Cari detail no rekening / nama / status
              </label>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={detailKeyword}
                  onChange={(event) => setDetailKeyword(event.target.value)}
                  className="h-10 w-full rounded-md border border-gray-300 px-9 text-sm outline-none focus:border-gray-600"
                />
              </div>
            </div>

            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium leading-5 text-gray-700">
                Jenis
              </label>

              <select
                value={detailJenis}
                onChange={(event) =>
                  handleChangeDetailJenis(
                    event.target.value as "ALL" | "REKENING" | "GL"
                  )
                }
                className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-600"
              >
                <option value="ALL">Semua</option>
                <option value="REKENING">Rekening</option>
                <option value="GL">GL</option>
              </select>
            </div>

            <Button
              onClick={handleSearchDetail}
              disabled={loadingDetail}
              className="h-10 w-full lg:w-auto"
            >
              <Search className="mr-2 size-4" />
              Cari Detail
            </Button>
          </div>
        </div>

        <MonitoringSummaryCards
          summary={buildGlobalSummary([selectedBpr])}
          formatCurrency={formatCurrency}
          formatDateTime={formatDateTime}
        />

        {showLogs ? (
          <MonitoringSyncLogTable
            data={syncLogs}
            loading={loadingLogs}
            formatDateTime={formatDateTime}
          />
        ) : null}

        {(detailJenis === "ALL" || detailJenis === "REKENING") && (
          <MonitoringDetailTable
            title="Daftar Rekening"
            data={rekeningDetail}
            loading={loadingDetail}
            formatCurrency={formatCurrency}
          />
        )}

        {(detailJenis === "ALL" || detailJenis === "GL") && (
          <MonitoringDetailTable
            title="Daftar GL"
            data={glDetail}
            loading={loadingDetail}
            formatCurrency={formatCurrency}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Monitoring Saldo Rekening MTD
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-gray-500">
              Menampilkan snapshot saldo rekening dan GL MTD dari seluruh BPR.
              Data di halaman ini dibaca dari database middleware, bukan inquiry
              live ke setiap gateway BPR.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={handleRefreshSummary}
              disabled={loadingSummary}
            >
              <RefreshCcw className="mr-2 size-4" />
              Refresh View
            </Button>

            <Button
              variant="outline"
              onClick={handleToggleLogs}
              disabled={loadingLogs}
            >
              {showLogs ? "Hide Sync Log" : "Sync Log"}
            </Button>

            <Button
              variant="outline"
              onClick={handleRefreshAll}
              disabled={!canRefreshAll || refreshingAll}
              title={!canRefreshAll ? "Anda tidak memiliki akses refresh semua BPR." : undefined}
            >
              <RefreshCcw className="mr-2 size-4" />
              {refreshingAll ? "Refreshing All..." : "Refresh All"}
            </Button>

            <Button
              disabled={!canExport || summaryData.length === 0}
              onClick={() => downloadSummaryCsv(summaryData)}
              title={!canExport ? "Anda tidak memiliki akses export." : undefined}
            >
              <Download className="mr-2 size-4" />
              Export Summary
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_180px_160px_auto] lg:items-end">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Cari ID / Nama BPR
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                className="h-10 w-full rounded-md border border-gray-300 px-9 text-sm outline-none focus:border-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-600"
            >
              <option value="nama_bpr">Nama BPR</option>
              <option value="bpr_id">BPR ID</option>
              <option value="total_all">Total Saldo</option>
              <option value="total_rekening">Saldo Rekening</option>
              <option value="total_gl">Saldo GL</option>
              <option value="count_all">Jumlah Data</option>
              <option value="last_sync_at">Last Sync</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Arah
            </label>
            <select
              value={sortDir}
              onChange={(event) => setSortDir(event.target.value as "asc" | "desc")}
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-600"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <Button onClick={handleSearchSummary} disabled={loadingSummary}>
            <Search className="mr-2 size-4" />
            Cari
          </Button>
        </div>
      </div>

      <MonitoringSummaryCards
        summary={globalSummary}
        formatCurrency={formatCurrency}
        formatDateTime={formatDateTime}
      />

      <MonitoringSummaryTable
        data={summaryData}
        loading={loadingSummary}
        canDetail={canDetail}
        canRefreshBpr={canRefreshBpr}
        refreshingBprId={refreshingBprId}
        formatCurrency={formatCurrency}
        formatDateTime={formatDateTime}
        onDetail={(item) => void loadDetail(item)}
        onRefreshBpr={(item) => void handleRefreshBpr(item)}
      />
    </div>
  );
}