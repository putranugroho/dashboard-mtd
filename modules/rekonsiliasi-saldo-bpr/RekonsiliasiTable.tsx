"use client";

import { RekonsiliasiRow } from "./types";
import { formatCurrency } from "./utils";

type Props = {
  rows: RekonsiliasiRow[];
  loading: boolean;
  onOpenDetail?: (row: RekonsiliasiRow) => void;
};

function CellBox({
  children,
  className = "",
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "selisih" | "acct";
}) {
  const toneClass =
    tone === "selisih"
      ? "bg-[#f1d2bb]"
      : tone === "acct"
      ? "bg-[#dce7f1]"
      : "bg-white";

  return (
    <div
      className={`rounded-md border border-gray-500 px-4 py-3 ${toneClass} ${className}`}
    >
      {children}
    </div>
  );
}

function TypePill({ value }: { value: "REK" | "GL" }) {
  return (
    <span className="inline-flex min-w-[38px] items-center justify-center rounded-md border border-green-500 bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
      {value}
    </span>
  );
}

export default function RekonsiliasiTable({
  rows,
  loading,
  onOpenDetail,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        Rekonsiliasi Saldo
      </h2>

      <div className="grid grid-cols-[70px_1.15fr_140px_140px_140px_1fr_130px] gap-x-3 gap-y-3">
        <div className="text-center text-sm font-semibold text-gray-700">
          Rek/GL
        </div>
        <div className="text-left text-sm font-semibold text-gray-700">
          Nama Rek / GL
        </div>
        <div className="text-center text-sm font-semibold text-gray-700">
          Saldo BPR
        </div>
        <div className="text-center text-sm font-semibold text-gray-700">
          Selisih
        </div>
        <div className="text-center text-sm font-semibold text-gray-700">
          Saldo Acct
        </div>
        <div className="text-left text-sm font-semibold text-gray-700">
          Accounting
        </div>
        <div className="text-left text-sm font-semibold text-gray-700">
          No SBB
        </div>

        {!loading && rows.length === 0 ? (
          <div className="col-span-7 rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
            Belum ada data. Masukkan BPR ID lalu klik Rekon.
          </div>
        ) : null}

        {rows.map((row, index) => (
          <>
            <CellBox
              key={`type-${row.source_code}-${index}`}
              className="flex items-center justify-center"
            >
              {row.source_type}
            </CellBox>

            <CellBox key={`name-${row.source_code}-${index}`} className="text-left">
              {row.source_name}
            </CellBox>

            <CellBox
              key={`saldo-bpr-${row.source_code}-${index}`}
              className="text-right font-medium"
            >
              {formatCurrency(row.saldo_bpr)}
            </CellBox>

            <CellBox
              key={`selisih-${row.source_code}-${index}`}
              tone="selisih"
              className={`text-right font-semibold ${
                row.selisih !== 0 ? "cursor-pointer hover:ring-2 hover:ring-red-300" : ""
              }`}
            >
              <button
                type="button"
                disabled={row.selisih === 0}
                onClick={() => onOpenDetail?.(row)}
                className="w-full text-right disabled:cursor-default"
                title={
                  row.selisih !== 0
                    ? "Klik untuk melihat detail selisih transaksi"
                    : "Tidak ada selisih"
                }
              >
                {formatCurrency(row.selisih)}
              </button>
            </CellBox>

            <CellBox
              key={`saldo-acct-${row.source_code}-${index}`}
              tone="acct"
              className="text-right font-medium"
            >
              {formatCurrency(row.saldo_acct)}
            </CellBox>

            <CellBox
              key={`acct-label-${row.source_code}-${index}`}
              className="text-left"
            >
              {row.accounting_name || "-"}
            </CellBox>

            <CellBox
              key={`sbb-code-${row.source_code}-${index}`}
              className="text-left"
            >
              {row.sbb_code || "-"}
            </CellBox>
          </>
        ))}
      </div>
    </div>
  );
}