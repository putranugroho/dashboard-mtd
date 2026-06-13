import { RefreshCw, Search } from "lucide-react";

import BprSelect from "@/components/shared/BprSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CollMeFilter } from "./types";

type Props = {
  filter: CollMeFilter;
  loading: boolean;
  canSearch?: boolean;
  onChange: (filter: CollMeFilter) => void;
  onReload: () => void;
};

export default function CollMeFilterBar({
  filter,
  loading,
  canSearch = true,
  onChange,
  onReload,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Monitoring Akun Coll Me
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Pantau data collector Coll Me berdasarkan BPR, keyword, kantor, dan status aktif.
          </p>
        </div>

        <Button
          type="button"
          onClick={onReload}
          disabled={loading || !canSearch}
          title={!canSearch ? "Anda tidak memiliki akses pencarian." : undefined}
        >
          <RefreshCw className="mr-2 size-4" />
          {loading ? "Memuat..." : "Refresh"}
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div>
          <BprSelect
            value={filter.bprId}
            label="BPR *"
            placeholder="Pilih BPR"
            disabled={loading}
            onChange={(bprId) => onChange({ ...filter, bprId })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Kantor</label>
          <Input
            value={filter.kdKantor}
            disabled={loading}
            onChange={(e) =>
              onChange({ ...filter, kdKantor: e.target.value })
            }
            placeholder="Contoh: 001"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Status Aktif
          </label>
          <select
            value={filter.statusAktif}
            disabled={loading}
            onChange={(e) =>
              onChange({
                ...filter,
                statusAktif: e.target.value as CollMeFilter["statusAktif"],
              })
            }
            className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800 disabled:bg-gray-100"
          >
            <option value="ALL">Semua Status</option>
            <option value="A">Aktif</option>
            <option value="NON_ACTIVE">Tidak Aktif</option>
          </select>
        </div>

        <div className="relative space-y-2">
          <label className="text-sm font-semibold text-gray-700">Keyword</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={filter.keyword}
              disabled={loading}
              onChange={(e) =>
                onChange({ ...filter, keyword: e.target.value })
              }
              placeholder="User ID / nama / no HP / SBB"
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </div>
  );
}