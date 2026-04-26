import { postJson } from "./client";
import { BprProfile } from "@/modules/data-bpr/types";
import { GatewayMonitorItem } from "@/modules/monitoring-gateway-bpr/types";

type ApiResponse<T> = {
  code: string;
  status?: string;
  message: string;
  data: T;
};

type BprListResponse = {
  profile?: BprProfile[];
  data?: BprProfile[];
};

type EchoResponseData = {
  status?: string;
  reason?: string;
};

type StsCoreResponseData = {
  bpr_id: string;
  status: string;
  tgl_sign_in?: string | null;
  tgl_sign_off?: string | null;
  url?: string | null;
};

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

function normalizeBprList(res: unknown): BprProfile[] {
  const payload = res as ApiResponse<BprListResponse | BprProfile[]>;

  if (Array.isArray(payload.data)) return payload.data;

  if (Array.isArray(payload.data?.profile)) return payload.data.profile;

  if (Array.isArray(payload.data?.data)) return payload.data.data;

  return [];
}

export async function getAllBprProfiles() {
  const res = await postJson<ApiResponse<BprListResponse | BprProfile[]>>(
    "/bpr_profile",
    {
      action: "list",
    }
  );

  return normalizeBprList(res);
}

async function checkEcho(bprId: string) {
  return postJson<ApiResponse<EchoResponseData>>("/echo", {
    bpr_id: bprId,
  });
}

async function checkStsCore(bprId: string) {
  return postJson<ApiResponse<StsCoreResponseData>>("/stscore", {
    bpr_id: bprId,
  });
}

export async function checkSingleGatewayStatus(
  profile: BprProfile
): Promise<GatewayMonitorItem> {
  const checkedAt = nowString();
  const bprId = profile.bpr_id;
  const namaBpr = profile.nama_bpr || "-";
  const gatewayUrl = profile.url_gateway || "-";

  try {
    const echo = await checkEcho(bprId);

    if (echo?.code === "000") {
      return {
        bpr_id: bprId,
        nama_bpr: namaBpr,
        gateway_url: gatewayUrl,
        status: "NORMAL",
        reason: echo.data?.reason || echo.message || "Echo success",
        checked_at: checkedAt,
        echo_success: true,
        core_status: "-",
      };
    }

    throw new Error(echo?.message || "Echo gagal.");
  } catch {
    try {
      const stscore = await checkStsCore(bprId);
      const coreStatus = String(stscore?.data?.status || "").trim();

      if (stscore?.code === "000" && coreStatus === "1") {
        return {
          bpr_id: bprId,
          nama_bpr: namaBpr,
          gateway_url: gatewayUrl,
          status: "NORMAL",
          reason: "Echo gagal, tetapi status core banking masih sign in / aktif.",
          checked_at: checkedAt,
          echo_success: false,
          core_status: coreStatus,
        };
      }

      if (stscore?.code === "000" && coreStatus === "0") {
        return {
          bpr_id: bprId,
          nama_bpr: namaBpr,
          gateway_url: gatewayUrl,
          status: "OFFLINE",
          reason: "Echo gagal dan status core banking sign off / offline.",
          checked_at: checkedAt,
          echo_success: false,
          core_status: coreStatus,
        };
      }

      return {
        bpr_id: bprId,
        nama_bpr: namaBpr,
        gateway_url: gatewayUrl,
        status: "ERROR",
        reason:
          stscore?.message ||
          "Echo gagal dan status core banking tidak valid.",
        checked_at: checkedAt,
        echo_success: false,
        core_status: coreStatus || "-",
      };
    } catch (error) {
      return {
        bpr_id: bprId,
        nama_bpr: namaBpr,
        gateway_url: gatewayUrl,
        status: "ERROR",
        reason:
          error instanceof Error
            ? `Echo dan stscore gagal: ${error.message}`
            : "Echo dan stscore gagal.",
        checked_at: checkedAt,
        echo_success: false,
        core_status: "-",
      };
    }
  }
}

export async function checkAllGatewayStatuses() {
  const profiles = await getAllBprProfiles();

  const results = await Promise.allSettled(
    profiles.map((profile) => checkSingleGatewayStatus(profile))
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") return result.value;

    const profile = profiles[index];

    return {
      bpr_id: profile?.bpr_id || "-",
      nama_bpr: profile?.nama_bpr || "-",
      gateway_url: profile?.url_gateway || "-",
      status: "ERROR" as const,
      reason: "Gagal melakukan monitoring gateway.",
      checked_at: nowString(),
      echo_success: false,
      core_status: "-",
    };
  });
}