"use client";

import { Download, RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import {
  getTrxLogDetail,
  getTrxLogList,
  getTrxLogTimeline,
  syncGatewayLogByRRN,
} from "@/lib/api/trx-log";

import TrxLogDetailDrawer from "./TrxLogDetailDrawer";
import TrxLogFilter from "./TrxLogFilter";
import TrxLogSummaryCards from "./TrxLogSummaryCards";
import TrxLogTable from "./TrxLogTable";
import type {
  TrxLogDetailPayload,
  TrxLogFilterState,
  TrxLogItem,
  TrxLogSummary,
  TrxLogTimelineItem,
} from "./types";

function getTodayYmd() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createDefaultFilter(): TrxLogFilterState {
  const today = getTodayYmd();

  return {
    trxCategory: "ALL",
    bprId: "",
    rrn: "",
    status: "ALL",
    tglAwal: today,
    tglAkhir: today,
    limit: 50,
    offset: 0,
  };
}

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

function buildSummary(rows: TrxLogItem[]): TrxLogSummary {
  return {
    total: rows.length,
    success: rows.filter((item) => item.final_status === "SUCCESS").length,
    failed: rows.filter((item) => item.final_status === "FAILED").length,
    timeout: rows.filter((item) => item.final_status === "TIMEOUT").length,
    pending: rows.filter((item) => item.final_status === "PENDING").length,
    totalAmount: rows.reduce((sum, item) => sum + Number(item.amount || 0), 0),
  };
}

function downloadCsv(rows: TrxLogItem[]) {
  const headers = [
    "ID",
    "Jenis",
    "Direction",
    "BPR ID",
    "Nama BPR",
    "RRN",
    "Ref ID",
    "No Rek",
    "No HP",
    "TCode",
    "Produk",
    "Amount",
    "Status",
    "Code",
    "Message",
    "Failed Layer",
    "Failed Step",
    "Created At",
  ];

  const csv = [
    headers,
    ...rows.map((item) => [
      item.id,
      item.trx_category,
      item.trx_direction,
      item.bpr_id,
      item.nama_bpr,
      item.rrn,
      item.ref_id,
      item.no_rek,
      item.no_hp,
      item.trx_code,
      item.product_name,
      item.amount,
      item.final_status,
      item.final_code,
      item.final_message,
      item.failed_at_layer,
      item.failed_at_step,
      item.created_at || "",
    ]),
  ]
    .map((row) =>
      row.map((col) => `"${String(col ?? "").replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", "log-transaksi.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

export default function LogTransaksiPage() {
  const { can } = useSession();

  const canView = can(PERMISSIONS.LOG_TRANSAKSI_VIEW);
  const canDetail = can(PERMISSIONS.LOG_TRANSAKSI_DETAIL);
  const canExport = can(PERMISSIONS.LOG_TRANSAKSI_EXPORT);
  const canSyncGateway = can(PERMISSIONS.LOG_TRANSAKSI_SYNC_GATEWAY);

  const [filter, setFilter] = useState<TrxLogFilterState>(createDefaultFilter);
  const [rows, setRows] = useState<TrxLogItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<TrxLogItem | null>(null);
  const [detail, setDetail] = useState<TrxLogDetailPayload | null>(null);
  const [timeline, setTimeline] = useState<TrxLogTimelineItem[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [syncingGateway, setSyncingGateway] = useState(false);

  const summary = useMemo(() => buildSummary(rows), [rows]);

  const loadData = async (nextFilter = filter) => {
    if (!canView) return;

    const normalizedFilter = {
      ...nextFilter,
      bprId: nextFilter.bprId.trim(),
    };

    if (!normalizedFilter.bprId) {
      window.alert("BPR ID wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      const result = await getTrxLogList(normalizedFilter);
      setRows(result);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat log transaksi."
      );
    } finally {
      setLoading(false);
    }
  };

  const openDetail = async (item: TrxLogItem) => {
    if (!canDetail) {
      window.alert("Anda tidak memiliki akses detail log transaksi.");
      return;
    }

    try {
      setSelected(item);
      setLoadingDetail(true);
      setDetail(null);
      setTimeline([]);

      const [detailRes, timelineRes] = await Promise.all([
        getTrxLogDetail(item.id),
        getTrxLogTimeline({ id: item.id, rrn: item.rrn }),
      ]);

      setDetail(detailRes);
      setTimeline(timelineRes);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat detail log transaksi."
      );
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSyncGatewayLog = async () => {
    if (!selected) return;

    if (!canSyncGateway) {
      window.alert("Anda tidak memiliki akses sync gateway log.");
      return;
    }

    const ok = window.confirm(`Sync gateway log untuk RRN ${selected.rrn}?`);
    if (!ok) return;

    try {
      setSyncingGateway(true);

      const result = await syncGatewayLogByRRN({
        id: selected.id,
        rrn: selected.rrn,
        trx_category: selected.trx_category,
      });

      if (result?.timeline) {
        setTimeline(result.timeline);
      } else {
        const refreshed = await getTrxLogTimeline({
          id: selected.id,
          rrn: selected.rrn,
        });
        setTimeline(refreshed);
      }

      window.alert(
        result
          ? `Sync gateway log berhasil. Total event: ${result.synced_count}`
          : "Sync gateway log berhasil."
      );
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal sync gateway log."
      );
    } finally {
      setSyncingGateway(false);
    }
  };

  if (!canView) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-red-600 shadow-sm">
        Anda tidak memiliki akses untuk melihat Log Transaksi.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Log Transaksi
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-gray-500">
              Pantau transaksi Transfer dan PPOB dari titik awal middleware.
              Detail transaksi dapat menampilkan timeline sampai Gateway IBPR.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => void loadData()}
              disabled={loading}
            >
              <RefreshCcw className="mr-2 size-4" />
              Refresh
            </Button>

            <Button
              disabled={!canExport || rows.length === 0}
              onClick={() => downloadCsv(rows)}
            >
              <Download className="mr-2 size-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <TrxLogFilter
        filter={filter}
        loading={loading}
        onChange={setFilter}
        onSearch={() => void loadData(filter)}
        onReset={() => {
          setFilter(createDefaultFilter());
          setRows([]);
        }}
      />

      <TrxLogSummaryCards summary={summary} formatCurrency={formatCurrency} />

      <TrxLogTable
        data={rows}
        loading={loading}
        canDetail={canDetail}
        formatCurrency={formatCurrency}
        formatDateTime={formatDateTime}
        onDetail={(item) => void openDetail(item)}
      />

      <TrxLogDetailDrawer
        open={Boolean(selected)}
        item={selected}
        detail={detail}
        timeline={timeline}
        loading={loadingDetail}
        syncing={syncingGateway}
        canSyncGateway={canSyncGateway}
        formatCurrency={formatCurrency}
        formatDateTime={formatDateTime}
        onClose={() => {
          setSelected(null);
          setDetail(null);
          setTimeline([]);
        }}
        onSyncGateway={handleSyncGatewayLog}
      />
    </div>
  );
}