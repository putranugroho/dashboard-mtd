"use client";

import { useMemo, useState } from "react";

import { getBprDetailWithTcodes } from "@/lib/api/bpr";
import { getMasterGLSubtree } from "@/lib/api/mastergl";
import { getRekonMappingList, saveRekonMapping } from "@/lib/api/rekon-mapping";
import { getSaldoMTDSources, SaldoMTDSourceItem } from "@/lib/api/saldo-mtd";

import {
  applySBBToRow,
  buildRelasiRows,
  buildRelasiSummary,
  flattenMasterGLToSBBOptions,
} from "./coa-utils";
import RelasiSearchForm from "./RelasiSearchForm";
import RelasiSummaryCards from "./RelasiSummaryCards";
import RelasiTable from "./RelasiTable";
import { RelasiRow, SBBOption } from "./types";

const DEFAULT_USERLOGIN =
  process.env.NEXT_PUBLIC_DEFAULT_USERLOGIN || "admin";

export default function SetupRelasiRekonsiliasiPage() {
  const [bprId, setBprId] = useState("");
  const [activeBprId, setActiveBprId] = useState("");
  const [bprName, setBprName] = useState("");
  const [rows, setRows] = useState<RelasiRow[]>([]);
  const [options, setOptions] = useState<SBBOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const summary = useMemo(() => buildRelasiSummary(rows), [rows]);

  const canSave = useMemo(
    () => rows.some((row) => row.selected_sbb_code),
    [rows]
  );

  const handleSearch = async () => {
    const nextBprId = bprId.trim();
    if (!nextBprId) {
      window.alert("BPR ID wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const [saldoSources, existingMappings, masterGLTree, bprDetail] =
        await Promise.all([
          getSaldoMTDSources(nextBprId),
          getRekonMappingList(nextBprId),
          getMasterGLSubtree(),
          getBprDetailWithTcodes(nextBprId),
        ]);

      const sbbOptions = flattenMasterGLToSBBOptions(masterGLTree);
      const mergedRows = buildRelasiRows(
        saldoSources,
        existingMappings,
        sbbOptions
      );

      setActiveBprId(nextBprId);
      setBprName(bprDetail?.profile?.nama_bpr || "");
      setOptions(sbbOptions);
      setRows(mergedRows);
    } catch (error) {
      console.error(error);
      setRows([]);
      setOptions([]);
      setBprName("");
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal memuat data setup relasi rekonsiliasi"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSBB = (index: number, option: SBBOption | null) => {
    setRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? applySBBToRow(row, option) : row
      )
    );
  };

  const handleSave = async () => {
    if (!activeBprId) {
      window.alert("Silakan cari BPR ID terlebih dahulu.");
      return;
    }

    const payloadRows = rows
      .filter((row) => row.selected_sbb_code)
      .map((row) => ({
        source_type: row.source_type,
        source_code: row.source_code,
        source_name: row.source_name,
        sbb_code: row.selected_sbb_code,
        sbb_name: row.selected_sbb_name,
        sbb_nobb: row.selected_sbb_nobb,
        sbb_gol_acc: row.selected_sbb_gol_acc,
        sbb_jns_acc: row.selected_sbb_jns_acc,
        sbb_type_posting: row.selected_sbb_type_posting,
        sbb_nonaktif: row.selected_sbb_nonaktif,
        is_active: row.is_active,
      }));

    if (payloadRows.length === 0) {
      window.alert("Pilih minimal 1 relasi SBB sebelum menyimpan.");
      return;
    }

    try {
      setSaving(true);

      const res = await saveRekonMapping({
        userlogin: DEFAULT_USERLOGIN,
        bpr_id: activeBprId,
        data: payloadRows,
      });

      const existingMappings = await getRekonMappingList(activeBprId);

      const sourceRows: SaldoMTDSourceItem[] = rows.map((row) => ({
        source_type: row.source_type,
        source_code: row.source_code,
        source_name: row.source_name,
      }));

      const refreshedRows = buildRelasiRows(
        sourceRows,
        existingMappings,
        options
      );

      setRows(refreshedRows);

      window.alert(res.message || "Relasi rekonsiliasi berhasil disimpan.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan relasi rekonsiliasi"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <RelasiSearchForm
        bprId={bprId}
        bprName={bprName}
        loading={loading}
        saving={saving}
        canSave={canSave}
        onChangeBprId={setBprId}
        onSearch={handleSearch}
        onSave={handleSave}
      />

      {rows.length > 0 ? <RelasiSummaryCards summary={summary} /> : null}

      <RelasiTable
        rows={rows}
        options={options}
        loading={loading}
        onSelectSBB={handleSelectSBB}
      />
    </div>
  );
}