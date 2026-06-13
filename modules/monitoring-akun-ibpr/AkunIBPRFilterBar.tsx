import { RefreshCw, Search } from "lucide-react";

import BprSelect from "@/components/shared/BprSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AkunIBPRFilter } from "./types";

type Props = {
  filter: AkunIBPRFilter;
  loading: boolean;
  onChange: (filter: AkunIBPRFilter) => void;
  onReload: () => void;
  canSearch?: boolean;
};

export default function AkunIBPRFilterBar({
  filter,
  loading,
  onChange,
  onReload,
  canSearch = true,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Monitoring Akun IBPR
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Pantau account dari tabel users_ibpr berdasarkan token, lock, status,
            device, dan server.
          </p>
        </div>

        <Button type="button" onClick={onReload} disabled={loading || !canSearch} title={!canSearch ? "Anda tidak memiliki akses pencarian." : undefined}>
          <RefreshCw className="mr-2 size-4" />
          {loading ? "Memuat..." : "Refresh"}
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-5">
        <div className="md:col-span-2">
          <BprSelect
            value={filter.bprId}
            label="BPR *"
            placeholder="Pilih BPR"
            disabled={loading}
            onChange={(bprId) => onChange({ ...filter, bprId })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Token</label>
          <select
            value={filter.statusToken}
            disabled={loading}
            onChange={(e) =>
              onChange({
                ...filter,
                statusToken: e.target.value as AkunIBPRFilter["statusToken"],
              })
            }
            className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800 disabled:bg-gray-100"
          >
            <option value="ALL">Semua Token</option>
            <option value="WITH_TOKEN">Sudah Ada Token</option>
            <option value="WITHOUT_TOKEN">Belum Ada Token</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Blokir</label>
          <select
            value={filter.statusLock}
            disabled={loading}
            onChange={(e) =>
              onChange({
                ...filter,
                statusLock: e.target.value as AkunIBPRFilter["statusLock"],
              })
            }
            className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800 disabled:bg-gray-100"
          >
            <option value="LOCKED">Yes</option>
            <option value="UNLOCKED">No</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Status</label>
          <select
            value={filter.statusDelete}
            disabled={loading}
            onChange={(e) =>
              onChange({
                ...filter,
                statusDelete: e.target.value as AkunIBPRFilter["statusDelete"],
              })
            }
            className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800 disabled:bg-gray-100"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif</option>
            <option value="DELETED">Deleted</option>
          </select>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Server
          </label>
          <select
            value={filter.development}
            disabled={loading}
            onChange={(e) =>
              onChange({
                ...filter,
                development: e.target.value as AkunIBPRFilter["development"],
              })
            }
            className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800 disabled:bg-gray-100"
          >
            <option value="DEVELOPMENT">Development</option>
            <option value="PRODUCTION">Production</option>
          </select>
        </div>

        <div className="relative md:col-span-4">
          <label className="text-sm font-semibold text-gray-700">Keyword</label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={filter.keyword}
              disabled={loading}
              onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
              placeholder="Cari user ID, nama, no rekening, no ponsel, no KTP, BPR ID..."
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}