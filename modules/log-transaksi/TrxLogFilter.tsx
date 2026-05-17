"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrxLogFilterState } from "./types";

type Props = {
  filter: TrxLogFilterState;
  loading?: boolean;
  onChange: (filter: TrxLogFilterState) => void;
  onSearch: () => void;
  onReset: () => void;
};

export default function TrxLogFilter({
  filter,
  loading = false,
  onChange,
  onSearch,
  onReset,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="grid gap-3 xl:grid-cols-[160px_160px_1fr_160px_160px_160px_auto_auto] xl:items-end">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Jenis
          </label>
          <select
            value={filter.trxCategory}
            onChange={(e) =>
              onChange({ ...filter, trxCategory: e.target.value as TrxLogFilterState["trxCategory"] })
            }
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-600"
          >
            <option value="ALL">Semua</option>
            <option value="TRANSFER">Transfer</option>
            <option value="PPOB">PPOB</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={filter.status}
            onChange={(e) =>
              onChange({ ...filter, status: e.target.value as TrxLogFilterState["status"] })
            }
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-600"
          >
            <option value="ALL">Semua</option>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="TIMEOUT">Timeout</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            RRN / Ref ID
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              value={filter.rrn}
              onChange={(e) => onChange({ ...filter, rrn: e.target.value })}
              placeholder="Cari RRN..."
              className="h-10 w-full rounded-md border border-gray-300 px-9 text-sm outline-none focus:border-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            BPR ID
          </label>
          <input
            value={filter.bprId}
            onChange={(e) => onChange({ ...filter, bprId: e.target.value })}
            placeholder="609999"
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tgl Awal
          </label>
          <input
            type="date"
            value={filter.tglAwal}
            onChange={(e) => onChange({ ...filter, tglAwal: e.target.value })}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-600"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Tgl Akhir
          </label>
          <input
            type="date"
            value={filter.tglAkhir}
            onChange={(e) => onChange({ ...filter, tglAkhir: e.target.value })}
            className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-600"
          />
        </div>

        <Button onClick={onSearch} disabled={loading}>
          <Search className="mr-2 size-4" />
          Cari
        </Button>

        <Button variant="outline" onClick={onReset} disabled={loading}>
          Reset
        </Button>
      </div>
    </div>
  );
}