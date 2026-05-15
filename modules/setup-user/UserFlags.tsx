import { Lock, ShieldCheck, UserCheck, UserX } from "lucide-react";
import type { DashboardUser } from "./types";
import { isUserActive, isUserLocked } from "./utils";

export default function UserFlags({ user }: { user: DashboardUser }) {
  const active = isUserActive(user);
  const locked = isUserLocked(user);
  const failedCount = Number(user.failed_login_count || 0);

  return (
    <div className="flex flex-wrap gap-1.5">
      <span
        className={
          active
            ? "inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
            : "inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
        }
      >
        {active ? <UserCheck className="size-3" /> : <UserX className="size-3" />}
        {active ? "Aktif" : "Nonaktif"}
      </span>

      <span
        className={
          locked
            ? "inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700"
            : "inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
        }
      >
        <Lock className="size-3" />
        {locked ? "Terblokir" : "Normal"}
      </span>

      {user.is_super_admin ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
          <ShieldCheck className="size-3" />
          Super Admin
        </span>
      ) : null}

      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
        Salah password {failedCount}/3
      </span>
    </div>
  );
}