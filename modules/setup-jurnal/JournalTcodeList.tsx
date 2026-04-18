"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { JournalTcodeSummary } from "./types-new";

type Props = {
  data: JournalTcodeSummary[];
  query: string;
  onQueryChange: (value: string) => void;
  selectedTcode: string | null;
  onSelect: (item: JournalTcodeSummary) => void;
};

export default function JournalTcodeList({
  data,
  query,
  onQueryChange,
  selectedTcode,
  onSelect,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold">Daftar TCode</h2>
        <p className="text-sm text-gray-500">
          Pilih TCode untuk melihat dan mengubah setup jurnal.
        </p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari tcode / keterangan..."
          className="pl-9"
        />
      </div>

      <div className="space-y-2">
        {data.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
            Data TCode tidak ditemukan
          </div>
        ) : (
          data.map((item) => {
            const active = selectedTcode === item.tcode;

            return (
              <button
                key={item.tcode}
                type="button"
                onClick={() => onSelect(item)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  active
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {item.tcode}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {item.keterangan}
                    </p>
                  </div>

                  <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {item.jml_jurnal} jurnal
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}