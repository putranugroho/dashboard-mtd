import {
  GatewayMonitorItem,
  GatewayMonitorSortBy,
  GatewayMonitorSummary,
  GatewayMonitorStatus,
} from "./types";

export const gatewayStatusPriority: Record<GatewayMonitorStatus, number> = {
  ERROR: 0,
  OFFLINE: 1,
  WARNING: 2,
  NORMAL: 3,
};

export function isProblemGateway(item: GatewayMonitorItem) {
  return item.status === "ERROR" || item.status === "OFFLINE" || item.status === "WARNING";
}

export function filterGatewayMonitorItems(
  items: GatewayMonitorItem[],
  keyword: string
): GatewayMonitorItem[] {
  const q = keyword.trim().toLowerCase();

  if (!q) return items;

  return items.filter((item) => {
    return (
      item.bpr_id.toLowerCase().includes(q) ||
      item.nama_bpr.toLowerCase().includes(q) ||
      item.gateway_url.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q) ||
      item.reason.toLowerCase().includes(q) ||
      item.checked_at.toLowerCase().includes(q)
    );
  });
}

export function sortGatewayMonitorItems(
  items: GatewayMonitorItem[],
  sortBy: GatewayMonitorSortBy = "severity"
): GatewayMonitorItem[] {
  return [...items].sort((a, b) => {
    if (sortBy === "severity") {
      const byPriority = gatewayStatusPriority[a.status] - gatewayStatusPriority[b.status];
      if (byPriority !== 0) return byPriority;
      return a.nama_bpr.localeCompare(b.nama_bpr);
    }

    if (sortBy === "nama_bpr") {
      return a.nama_bpr.localeCompare(b.nama_bpr);
    }

    if (sortBy === "bpr_id") {
      return a.bpr_id.localeCompare(b.bpr_id);
    }

    if (sortBy === "status") {
      const byStatus = a.status.localeCompare(b.status);
      if (byStatus !== 0) return byStatus;
      return a.nama_bpr.localeCompare(b.nama_bpr);
    }

    if (sortBy === "checked_at") {
      return b.checked_at.localeCompare(a.checked_at);
    }

    return 0;
  });
}

export function splitGatewayMonitorItems(items: GatewayMonitorItem[]) {
  return {
    problemItems: items.filter(isProblemGateway),
    normalItems: items.filter((item) => item.status === "NORMAL"),
  };
}

export function buildGatewaySummary(
  items: GatewayMonitorItem[]
): GatewayMonitorSummary {
  return {
    total: items.length,
    normal: items.filter((item) => item.status === "NORMAL").length,
    offline: items.filter((item) => item.status === "OFFLINE").length,
    warning: items.filter((item) => item.status === "WARNING").length,
    error: items.filter((item) => item.status === "ERROR").length,
  };
}

export function getGatewayStatusTone(status: GatewayMonitorStatus) {
  switch (status) {
    case "NORMAL":
      return {
        badge: "border-green-500 bg-green-50 text-green-700",
        row: "bg-green-50/30",
        dot: "bg-green-500",
      };
    case "OFFLINE":
      return {
        badge: "border-amber-500 bg-amber-50 text-amber-700",
        row: "bg-amber-50/40",
        dot: "bg-amber-500",
      };
    case "WARNING":
      return {
        badge: "border-blue-500 bg-blue-50 text-blue-700",
        row: "bg-blue-50/40",
        dot: "bg-blue-500",
      };
    case "ERROR":
    default:
      return {
        badge: "border-red-500 bg-red-50 text-red-700",
        row: "bg-red-50/40",
        dot: "bg-red-500",
      };
  }
}

export function getGatewayStatusLabel(status: GatewayMonitorStatus) {
  switch (status) {
    case "NORMAL":
      return "Normal";
    case "OFFLINE":
      return "Offline";
    case "WARNING":
      return "Warning";
    case "ERROR":
    default:
      return "Bermasalah";
  }
}