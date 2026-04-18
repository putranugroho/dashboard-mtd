"use client";

import { LogIn, LogOut, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignStatus } from "./types";

type Props = {
  bprId: string;
  loading?: boolean;
  currentStatus: SignStatus | null;
  onChangeBprId: (value: string) => void;
  onCheckStatus: () => void;
  onSignIn: () => void;
  onSignOff: () => void;
};

export default function SignActionForm({
  bprId,
  loading = false,
  currentStatus,
  onChangeBprId,
  onCheckStatus,
  onSignIn,
  onSignOff,
}: Props) {
  const isOnline = currentStatus?.status === "ONLINE";
  const isOffline = currentStatus?.status === "OFFLINE";

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Sign in - Sign off
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola status online dan offline BPR untuk menentukan apakah BPR
            dapat menerima transaksi.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={bprId}
              onChange={(e) => onChangeBprId(e.target.value)}
              placeholder="Masukkan BPR ID"
              className="pl-9"
            />
          </div>

          <Button onClick={onCheckStatus} disabled={loading}>
            {loading ? "Memuat..." : "Cek Status"}
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          onClick={onSignIn}
          disabled={!currentStatus || loading || isOnline}
        >
          <LogIn className="mr-2 size-4" />
          Sign In
        </Button>

        <Button
          variant="destructive"
          onClick={onSignOff}
          disabled={!currentStatus || loading || isOffline}
        >
          <LogOut className="mr-2 size-4" />
          Sign Off
        </Button>
      </div>
    </div>
  );
}