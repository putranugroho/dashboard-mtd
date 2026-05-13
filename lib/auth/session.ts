import { hasPermission } from "./permissions";

export type AuthUser = {
  id: number;
  username: string;
  full_name?: string;
  email?: string;
  role_name?: string;
  is_super_admin?: boolean;
};

export type AuthSession = {
  token?: string;
  user: AuthUser;
  permissions: string[];
};

const SESSION_KEY = "dashboard_mtd_auth_session";

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    clearSession();
    return null;
  }
}

export function setSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("dashboard-mtd-session-changed"));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("dashboard-mtd-session-changed"));
}

export function getCurrentUserLogin() {
  return getSession()?.user?.username || "ADMIN";
}

export function can(permission?: string) {
  const session = getSession();
  if (!session) return false;

  return hasPermission(
    session.permissions,
    permission,
    Boolean(session.user?.is_super_admin)
  );
}
