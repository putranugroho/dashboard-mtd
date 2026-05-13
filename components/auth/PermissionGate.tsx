"use client";

import { ReactNode } from "react";
import { useSession } from "@/lib/auth/use-session";

type PermissionGateProps = {
  permission?: string;
  fallback?: ReactNode;
  children: ReactNode;
};

export default function PermissionGate({
  permission,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { can } = useSession();

  if (!can(permission)) return <>{fallback}</>;

  return <>{children}</>;
}
