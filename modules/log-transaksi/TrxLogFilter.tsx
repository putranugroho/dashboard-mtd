"use client";

import { Search } from "lucide-react";

import BprSelect from "@/components/shared/BprSelect";
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
      <div className="grid gap-4">
        {/* Baris 1 */}
        <div className="grid gap-3 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <BprSelect
              value={filter.bprId}
              label="BPR *"
              placeholder="Pilih BPR"
              disabled={loading}
              onChange={(bprId) => onChange({ ...filter, bprId })}
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              RRN / Ref ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={filter.rrn}
                disabled={loading}
                onChange={(e) => onChange({ ...filter, rrn: e.target.value })}
                placeholder="Cari RRN / Ref ID..."
                className="h-10 w-full rounded-md border border-gray-300 px-9 text-sm outline-none focus:border-gray-600 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Baris 2 */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(140px,1fr)_minmax(140px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)_auto_auto] lg:items-end">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Jenis
            </label>
            <select
              value={filter.trxCategory}
              disabled={loading}
              onChange={(e) =>
                onChange({
                  ...filter,
                  trxCategory:
                    e.target.value as TrxLogFilterState["trxCategory"],
                })
              }
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-600 disabled:bg-gray-100"
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
              disabled={loading}
              onChange={(e) =>
                onChange({
                  ...filter,
                  status: e.target.value as TrxLogFilterState["status"],
                })
              }
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-600 disabled:bg-gray-100"
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
              Tgl Awal
            </label>
            <input
              type="date"
              value={filter.tglAwal}
              disabled={loading}
              onChange={(e) =>
                onChange({ ...filter, tglAwal: e.target.value })
              }
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-600 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tgl Akhir
            </label>
            <input
              type="date"
              value={filter.tglAkhir}
              disabled={loading}
              onChange={(e) =>
                onChange({ ...filter, tglAkhir: e.target.value })
              }
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-600 disabled:bg-gray-100"
            />
          </div>

          <Button type="button" onClick={onSearch} disabled={loading}>
            <Search className="mr-2 size-4" />
            Cari
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={loading}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}