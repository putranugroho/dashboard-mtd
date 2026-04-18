"use client";

import { Badge } from "@/components/ui/badge";
import { SignStatus } from "./types";

type Props = {
  data: SignStatus | null;
};

export default function SignStatusCard({ data }: Props) {
  if (!data) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
        Masukkan BPR ID lalu klik <span className="font-medium">Cek Status</span>.
      </div>
    );
  }

  const isOnline = data.status === "ONLINE";

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Status BPR</h2>
          <p className="text-sm text-gray-500">
            Informasi status koneksi transaksi BPR saat ini.
          </p>
        </div>

        <Badge variant={isOnline ? "default" : "destructive"}>
          {data.status}
        </Badge>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-500">BPR ID</p>
          <p className="mt-1 text-base font-semibold text-gray-900">
            {data.bpr_id}
          </p>
        </div>

        <div className="rounded-xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Status</p>
          <p
            className={`mt-1 text-base font-semibold ${
              isOnline ? "text-green-700" : "text-red-700"
            }`}
          >
            {data.status}
          </p>
        </div>

        <div className="rounded-xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Updated At</p>
          <p className="mt-1 text-base font-semibold text-gray-900">
            {data.updated_at || "-"}
          </p>
        </div>

        <div className="rounded-xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Updated By</p>
          <p className="mt-1 text-base font-semibold text-gray-900">
            {data.updated_by || "-"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border bg-gray-50 p-4">
        <p className="text-sm text-gray-500">Keterangan</p>
        <p className="mt-1 text-sm text-gray-800">{data.message || "-"}</p>
      </div>
    </div>
  );
}