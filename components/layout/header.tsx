"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";

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
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-white px-3 sm:px-4 lg:h-16 lg:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>

        <div className="min-w-0 truncate text-base font-semibold lg:text-lg">
          {getTitle(pathname)}
        </div>
      </div>

      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
        <div className="hidden min-w-0 text-right sm:block">
          <div className="max-w-[160px] truncate text-xs font-medium text-gray-700 lg:max-w-[240px] lg:text-sm">
            Hi, {displayName}
          </div>
          <div className="max-w-[160px] truncate text-[11px] text-gray-500 lg:max-w-[240px] lg:text-xs">
            {user?.role_name || "Dashboard User"}
          </div>
        </div>

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm text-white">
          {initial}
        </div>

        <Button variant="outline" size="sm" onClick={handleLogout} className="h-8 px-2 lg:px-3">
          <LogOut className="size-4 lg:mr-1" />
          <span className="hidden lg:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}