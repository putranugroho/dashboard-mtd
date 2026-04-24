import { GatewayMonitorItem, GatewayMonitorSummary } from "./types";

const priorityMap: Record<GatewayMonitorItem["status"], number> = {
  ERROR: 0,
  OFFLINE: 1,
  WARNING: 2,
  NORMAL: 3,
};

export function sortGatewayMonitorItems(
  items: GatewayMonitorItem[]
): GatewayMonitorItem[] {
  return [...items].sort((a, b) => {
    const byPriority = priorityMap[a.status] - priorityMap[b.status];
    if (byPriority !== 0) return byPriority;
    return a.nama_bpr.localeCompare(b.nama_bpr);
  });
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

export function getGatewayStatusTone(status: GatewayMonitorItem["status"]) {
  switch (status) {
    case "NORMAL":
      return {
        badge:
          "border-green-500 bg-green-50 text-green-700",
        icon:
          "border-green-300 bg-green-50 text-green-700",
      };
    case "OFFLINE":
      return {
        badge:
          "border-amber-500 bg-amber-50 text-amber-700",
        icon:
          "border-amber-300 bg-amber-50 text-amber-700",
      };
    case "WARNING":
      return {
        badge:
          "border-blue-500 bg-blue-50 text-blue-700",
        icon:
          "border-blue-300 bg-blue-50 text-blue-700",
      };
    case "ERROR":
    default:
      return {
        badge:
          "border-red-500 bg-red-50 text-red-700",
        icon:
          "border-red-300 bg-red-50 text-red-700",
      };
  }
}