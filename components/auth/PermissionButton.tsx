"use client";

import { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/use-session";

type PermissionButtonProps = ComponentProps<typeof Button> & {
  permission?: string;
  deniedTitle?: string;
};

export default function PermissionButton({
  permission,
  deniedTitle = "Anda tidak memiliki akses untuk menjalankan fasilitas ini.",
  disabled,
  title,
  children,
  ...props
}: PermissionButtonProps) {
  const { can } = useSession();
  const allowed = can(permission);

  return (
    <Button
      {...props}
      disabled={disabled || !allowed}
      title={!allowed ? deniedTitle : title}
    >
      {children}
    </Button>
  );
}
