"use client";

import { useMemo, useState } from "react";

import MonitoringGatewayGrid from "./MonitoringGatewayGrid";
import MonitoringGatewayHeader from "./MonitoringGatewayHeader";
import MonitoringGatewaySummary from "./MonitoringGatewaySummary";
import { gatewayMonitorDummy } from "./dummy";
import { GatewayMonitorItem } from "./types";
import { buildGatewaySummary, sortGatewayMonitorItems } from "./utils";

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
  const [lastChecked, setLastChecked] = useState(nowString());
  const [items, setItems] = useState<GatewayMonitorItem[]>(
    sortGatewayMonitorItems(gatewayMonitorDummy)
  );

  const summary = useMemo(() => buildGatewaySummary(items), [items]);

  const handleRefresh = async () => {
    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setItems(sortGatewayMonitorItems(gatewayMonitorDummy));
      setLastChecked(nowString());
    } catch (error) {
      console.error(error);
      window.alert("Gagal me-refresh data monitoring gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <MonitoringGatewayHeader
        loading={loading}
        lastChecked={lastChecked}
        onRefresh={handleRefresh}
      />

      <MonitoringGatewaySummary summary={summary} />

      <MonitoringGatewayGrid items={items} loading={loading} />
    </div>
  );
}