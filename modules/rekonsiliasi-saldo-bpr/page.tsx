"use client";

import { useState } from "react";

import { getBprDetailWithTcodes } from "@/lib/api/bpr";
import { getRekonMappingList } from "@/lib/api/rekon-mapping";
import { getSaldoGL } from "@/lib/api/saldo-gl";
import { getSaldoMTD } from "@/lib/api/saldo-mtd";

import RekonsiliasiSearchForm from "./RekonsiliasiSearchForm";
import RekonsiliasiTable from "./RekonsiliasiTable";
import RekonsiliasiDetailPage from "./RekonsiliasiDetailPage";
import { RekonsiliasiRow } from "./types";
import {
  buildRekonsiliasiRows,
  downloadRekonsiliasiCsv,
  getNowReconLabel,
} from "./utils";

export default function RekonsiliasiSaldoBPRPage() {
  const [bprId, setBprId] = useState("");
  const [bprName, setBprName] = useState("");
  const [reconAt, setReconAt] = useState("");
  const [rows, setRows] = useState<RekonsiliasiRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDiffRow, setSelectedDiffRow] = useState<RekonsiliasiRow | null>(null);

  const handleRekon = async () => {
    const nextBprId = bprId.trim();

    if (!nextBprId) {
      window.alert("BPR ID wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const nowLabel = getNowReconLabel();

      const [bprDetail, saldoItems, mappings] = await Promise.all([
        getBprDetailWithTcodes(nextBprId),
        getSaldoMTD(nextBprId),
        getRekonMappingList(nextBprId),
      ]);

      const saldoGLItems = await getSaldoGL(mappings);

      const resultRows = buildRekonsiliasiRows({
        saldoItems,
        mappings,
        saldoGLItems,
        reconAt: nowLabel,
      });

      setBprName(bprDetail?.profile?.nama_bpr || "");
      setReconAt(nowLabel);
      setRows(resultRows);
      setSelectedDiffRow(null);
    } catch (error) {
      console.error(error);
      setRows([]);
      setBprName("");
      setReconAt("");

      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat data rekonsiliasi saldo BPR"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!rows.length) {
      window.alert("Belum ada data rekonsiliasi untuk diunduh.");
      return;
    }

    downloadRekonsiliasiCsv(rows, bprId.trim(), reconAt);
  };

  return (
    <div className="space-y-6">
      {selectedDiffRow ? (
        <RekonsiliasiDetailPage
          row={selectedDiffRow}
          onBack={() => setSelectedDiffRow(null)}
        />
      ) : (
        <>
          <RekonsiliasiSearchForm
            bprId={bprId}
            bprName={bprName}
            reconAt={reconAt}
            loading={loading}
            canDownload={rows.length > 0}
            onChangeBprId={(value, item) => {
              setBprId(value);
              setBprName(item?.nama_bpr || "");
              setRows([]);
              setReconAt("");
              setSelectedDiffRow(null);
            }}
            onRekon={handleRekon}
            onDownload={handleDownload}
          />

          <RekonsiliasiTable
            rows={rows}
            loading={loading}
            onOpenDetail={setSelectedDiffRow}
          />
        </>
      )}
    </div>
  );
}