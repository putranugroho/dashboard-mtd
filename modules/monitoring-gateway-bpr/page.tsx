"use client";

import { useEffect, useMemo, useState } from "react";

import { getBprDetailWithTcodes } from "@/lib/api/bpr";
import { checkAllGatewayStatuses } from "@/lib/api/monitoring-gateway";
import { BprProfile } from "@/modules/data-bpr/types";
import BprContactDialog from "./BprContactDialog";
import MonitoringGatewayGrid from "./MonitoringGatewayGrid";
import MonitoringGatewayHeader from "./MonitoringGatewayHeader";
import MonitoringGatewaySummary from "./MonitoringGatewaySummary";
import { GatewayMonitorItem, GatewayMonitorSortBy } from "./types";
import {
  buildGatewaySummary,
  filterGatewayMonitorItems,
  sortGatewayMonitorItems,
  splitGatewayMonitorItems,
} from "./utils";

function nowString() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();

  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `${dd}-${mm}-${yyyy} ${hh}:${mi}:${ss}`;
}

export default function MonitoringGatewayBPRPage() {
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<GatewayMonitorSortBy>("severity");
  const [items, setItems] = useState<GatewayMonitorItem[]>([]);

  const [picOpen, setPicOpen] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [picError, setPicError] = useState("");
  const [selectedItem, setSelectedItem] = useState<GatewayMonitorItem | null>(
    null
  );
  const [selectedProfile, setSelectedProfile] = useState<BprProfile | null>(
    null
  );

  const loadMonitoring = async () => {
    try {
      setLoading(true);

      const result = await checkAllGatewayStatuses();

      setItems(sortGatewayMonitorItems(result, "severity"));
      setLastChecked(nowString());
    } catch (error) {
      console.error(error);
      window.alert("Gagal mengambil data monitoring gateway.");
      setItems([]);
      setLastChecked(nowString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonitoring();
  }, []);

  const summary = useMemo(() => buildGatewaySummary(items), [items]);

  const visibleItems = useMemo(() => {
    const filtered = filterGatewayMonitorItems(items, query);
    return sortGatewayMonitorItems(filtered, sortBy);
  }, [items, query, sortBy]);

  const { problemItems, normalItems } = useMemo(
    () => splitGatewayMonitorItems(visibleItems),
    [visibleItems]
  );

  const handleRefresh = async () => {
    await loadMonitoring();
  };

  const handleOpenPIC = async (item: GatewayMonitorItem) => {
    setSelectedItem(item);
    setSelectedProfile(null);
    setPicError("");
    setPicOpen(true);

    try {
      setPicLoading(true);

      const detail = await getBprDetailWithTcodes(item.bpr_id);

      if (!detail?.profile) {
        setPicError("Data PIC BPR tidak ditemukan.");
        return;
      }

      setSelectedProfile(detail.profile);
    } catch (error) {
      console.error(error);

      setSelectedProfile({
        bpr_id: item.bpr_id,
        nama_bpr: item.nama_bpr,
        alamat: "-",
        email: "-",
        kode_pos: "",
        tanggal_bergabung: "",
        pic_nama: "-",
        pic_hp: "-",
        head_teller_nama: "",
        head_teller_hp: "",
        direktur_nama: "",
        direktur_hp: "",
        url_gateway: item.gateway_url,
        logo_bpr: "",
        is_active: true,
      });

      setPicError(
        error instanceof Error
          ? `Gagal mengambil detail dari API: ${error.message}`
          : "Gagal mengambil detail PIC BPR."
      );
    } finally {
      setPicLoading(false);
    }
  };

  const handleClosePIC = () => {
    setPicOpen(false);
    setPicLoading(false);
    setPicError("");
    setSelectedItem(null);
    setSelectedProfile(null);
  };

  return (
    <div className="space-y-6">
      <MonitoringGatewayHeader
        loading={loading}
        lastChecked={lastChecked}
        query={query}
        sortBy={sortBy}
        onChangeQuery={setQuery}
        onChangeSortBy={setSortBy}
        onRefresh={handleRefresh}
      />

      <MonitoringGatewaySummary summary={summary} />

      <MonitoringGatewayGrid
        problemItems={problemItems}
        normalItems={normalItems}
        loading={loading}
        onOpenPIC={handleOpenPIC}
      />

      <BprContactDialog
        open={picOpen}
        loading={picLoading}
        item={selectedItem}
        profile={selectedProfile}
        errorMessage={picError}
        onClose={handleClosePIC}
      />
    </div>
  );
}