"use client";

import { useEffect, useMemo, useState } from "react";
import { AuthSession, getSession } from "./session";
import { hasPermission } from "./permissions";

export function useSession() {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSessionState(getSession());
      setReady(true);
    };

    sync();

    window.addEventListener("storage", sync);
    window.addEventListener("dashboard-mtd-session-changed", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("dashboard-mtd-session-changed", sync);
    };
  }, []);

  const helpers = useMemo(() => {
    return {
      session,
      ready,
      user: session?.user ?? null,
      permissions: session?.permissions ?? [],
      isLoggedIn: Boolean(session?.user),
      isSuperAdmin: Boolean(session?.user?.is_super_admin),
      can: (permission?: string) =>
        hasPermission(
          session?.permissions ?? [],
          permission,
          Boolean(session?.user?.is_super_admin)
        ),
    };
  }, [session, ready]);

  return helpers;
}
