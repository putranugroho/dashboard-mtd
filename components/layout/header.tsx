"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { clearSession } from "@/lib/auth/session";
import { useSession } from "@/lib/auth/use-session";

function getTitle(pathname: string) {
  if (pathname === "/dashboard") return "Dashboard";
  const last = pathname.split("/").filter(Boolean).pop() || "Dashboard";
  return last
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSession();
  const displayName = user?.full_name || user?.username || "User";
  const initial = displayName.slice(0, 1).toUpperCase();

  const handleLogout = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="text-lg font-semibold">{getTitle(pathname)}</div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium text-gray-700">Hi, {displayName}</div>
          <div className="text-xs text-gray-500">{user?.role_name || "Dashboard User"}</div>
        </div>

        <div className="w-8 h-8 bg-green-600 text-white flex items-center justify-center rounded-full">
          {initial}
        </div>

        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="mr-1 size-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}
