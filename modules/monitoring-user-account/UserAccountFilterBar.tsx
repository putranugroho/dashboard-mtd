import { RefreshCw, Search } from "lucide-react";

import BprSelect from "@/components/shared/BprSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAccountFilter } from "./types";

type Props = {
  filter: UserAccountFilter;
  loading: boolean;
  onChange: (filter: UserAccountFilter) => void;
  onReload: () => void;
};

export default function UserAccountFilterBar({
  filter,
  loading,
  onChange,
  onReload,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Monitoring User Account
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Pantau account dari tabel users_info berdasarkan role, token, dan status delete.
          </p>
        </div>

        <Button type="button" onClick={onReload} disabled={loading}>
          <RefreshCw className="mr-2 size-4" />
          {loading ? "Memuat..." : "Refresh"}
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-5">
        <div className="md:col-span-2">
          <BprSelect
            value={filter.bprId}
            label="Filter BPR"
            placeholder="Semua BPR"
            disabled={loading}
            onChange={(bprId) => onChange({ ...filter, bprId })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Role</label>
          <select
            value={filter.role}
            disabled={loading}
            onChange={(e) =>
              onChange({
                ...filter,
                role: e.target.value as UserAccountFilter["role"],
              })
            }
            className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800 disabled:bg-gray-100"
          >
            <option value="ALL">Semua Role</option>
            <option value="NASABAH">NASABAH</option>
            <option value="STAFF">STAFF</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Token</label>
          <select
            value={filter.statusToken}
            disabled={loading}
            onChange={(e) =>
              onChange({
                ...filter,
                statusToken: e.target.value as UserAccountFilter["statusToken"],
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
          <label className="text-sm font-semibold text-gray-700">Deleted</label>
          <select
            value={filter.statusDelete}
            disabled={loading}
            onChange={(e) =>
              onChange({
                ...filter,
                statusDelete: e.target.value as UserAccountFilter["statusDelete"],
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

      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={filter.keyword}
          disabled={loading}
          onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
          placeholder="Cari nama, username, CIF, no identitas, phone, BPR ID..."
          className="pl-9"
        />
      </div>
    </div>
  );
}
