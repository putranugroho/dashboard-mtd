"use client";

import { Download } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import SaldoSearchForm from "./SaldoSearchForm";
import SaldoSummaryCards from "./SaldoSummaryCard";
import SaldoTable from "./SaldoTable";
import { saldoRekeningDummy } from "./dummy";
import { SaldoRekeningItem, SaldoSummary } from "./types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  }).format(value);
}

function toNumber(value: string) {
  const num = Number(value || 0);
  return Number.isNaN(num) ? 0 : num;
}

function buildSummary(data: SaldoRekeningItem[]): SaldoSummary {
  const rekening = data.filter((item) => item.gl_jsn === "2");
  const gl = data.filter((item) => item.gl_jsn === "1");

  const totalRekening = rekening.reduce(
    (acc, item) => acc + toNumber(item.saldoakhir),
    0
  );

  const totalGL = gl.reduce((acc, item) => acc + toNumber(item.saldoakhir), 0);

  return {
    totalRekening,
    totalGL,
    totalAll: totalRekening + totalGL,
    countRekening: rekening.length,
    countGL: gl.length,
    countAll: data.length,
  };
}

function downloadCsv(filename: string, rows: SaldoRekeningItem[]) {
  const headers = [
    "Jenis",
    "No Rekening / GL",
    "Nama",
    "Saldo Akhir",
    "Saldo Efektif",
    "Status",
  ];

  const content = rows.map((item) => [
    item.gl_jsn === "1" ? "GL" : "REKENING",
    item.no_rek,
    item.nama,
    item.saldoakhir,
    item.saldoeff,
    item.status_rek,
  ]);

  const csv = [headers, ...content]
    .map((row) =>
      row
        .map((col) => `"${String(col ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

export default function SaldoRekeningMTDPage() {
  const [bprId, setBprId] = useState("");
  const [searchedBprId, setSearchedBprId] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SaldoRekeningItem[]>([]);

  const rekeningData = useMemo(
    () => data.filter((item) => item.gl_jsn === "2"),
    [data]
  );

  const glData = useMemo(
    () => data.filter((item) => item.gl_jsn === "1"),
    [data]
  );

  const summary = useMemo(() => buildSummary(data), [data]);

  const handleSearch = async () => {
    if (!bprId.trim()) {
      window.alert("BPR ID wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      // sementara dummy dulu
      await new Promise((resolve) => setTimeout(resolve, 500));

      setData(saldoRekeningDummy);
      setSearchedBprId(bprId.trim());
    } catch (error) {
      console.error(error);
      window.alert("Gagal memuat data saldo rekening.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (data.length === 0) return;
    downloadCsv(`saldo-rekening-mtd-${searchedBprId || "data"}.csv`, data);
  };

  return (
    <div className="space-y-6">
      <SaldoSearchForm
        bprId={bprId}
        loading={loading}
        onChange={setBprId}
        onSearch={handleSearch}
      />

      {data.length > 0 && (
        <>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Hasil Inquiry BPR ID: {searchedBprId}
              </h2>
              <p className="text-sm text-gray-500">
                Data sementara masih menggunakan dummy response.
              </p>
            </div>

            <Button onClick={handleDownload}>
              <Download className="mr-2 size-4" />
              Download Excel
            </Button>
          </div>

          <SaldoSummaryCards
            summary={summary}
            formatCurrency={formatCurrency}
          />

          <SaldoTable
            title="Daftar Rekening"
            data={rekeningData}
            formatCurrency={formatCurrency}
          />

          <SaldoTable
            title="Daftar GL"
            data={glData}
            formatCurrency={formatCurrency}
          />
        </>
      )}
    </div>
  );
}