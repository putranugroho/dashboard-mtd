"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { JournalAccountingTcodeSummary } from "./types";
import clsx from "clsx";

type Props = {
  data: JournalAccountingTcodeSummary[];
  query: string;
  onQueryChange: (value: string) => void;
  selectedTcode: string | null;
  onSelect: (item: JournalAccountingTcodeSummary) => void;
};

export default function AccountingJournalTcodeList({
  data,
  query,
  onQueryChange,
  selectedTcode,
  onSelect,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Daftar TCode</h2>
          <p className="text-sm text-gray-500">
            Pilih relasi TCode untuk setup journal accounting.
          </p>
        </div>

        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Cari TCode / keterangan..."
        />
      </div>

      <div className="mt-4 space-y-3">
        {data.length === 0 ? (
          <div className="rounded-xl border border-dashed p-4 text-sm text-gray-500">
            Tidak ada TCode yang sesuai.
          </div>
        ) : (
          data.map((item) => {
            const isSelected = selectedTcode === item.tcode;

            return (
              <button
                key={item.tcode}
                type="button"
                onClick={() => onSelect(item)}
                className={clsx(
                  "w-full rounded-2xl border p-4 text-left transition",
                  isSelected
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {item.tcode}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {item.keterangan}
                    </div>
                  </div>

                  <Badge variant="outline">
                    {item.accounting_journal_count} jurnal
                  </Badge>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}