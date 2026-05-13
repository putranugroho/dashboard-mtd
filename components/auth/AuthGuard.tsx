"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { useSession } from "@/lib/auth/use-session";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, isLoggedIn } = useSession();

  useEffect(() => {
    if (!ready) return;
    if (!isLoggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [ready, isLoggedIn, pathname, router]);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Memuat session...
      </div>
    );
  }

  if (!isLoggedIn) return null;

  return <>{children}</>;
}
