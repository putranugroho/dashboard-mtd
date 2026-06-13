"use client";

import { useEffect, useState } from "react";
import { Plus, RefreshCcw, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import HorizontalDragScroll from "../shared/HorizontalDragScroll";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  getMasterPG, getSetupFeePG, getTCodes, saveAllFeePG,
  PaymentGateway, SetupFeePG, TCodeOption,
} from "@/lib/api/payment-gateway";

const EMPTY_FEE = {
  tcode_id: 0,
  nilai_transaksi: 0,
  markup_bpr: 0,
  margin_mtd: 0,
  fee_bpr: 0,
  fee_mtd: 0,
};

type FeeRow = typeof EMPTY_FEE & { _key: string };

export default function SetupFeePGPage() {
  const [pgList, setPgList] = useState<PaymentGateway[]>([]);
  const [tcodes, setTcodes] = useState<TCodeOption[]>([]);
  const [selectedPg, setSelectedPg] = useState<PaymentGateway | null>(null);
  const [fees, setFees] = useState<FeeRow[]>([]);
  const [savedFees, setSavedFees] = useState<SetupFeePG[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void loadInit();
  }, []);

  async function loadInit() {
    try {
      setLoading(true);
      const [pgs, tcs] = await Promise.all([getMasterPG(), getTCodes()]);
      setPgList(pgs);
      setTcodes(tcs);
      if (pgs.length > 0) {
        setSelectedPg(pgs[0]);
        await loadFees(pgs[0].id);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  async function loadFees(pgId: number) {
    try {
      const data = await getSetupFeePG(pgId);
      setSavedFees(data);
      setFees(
        data.map((f) => ({
          _key: String(f.tcode_id),
          tcode_id: f.tcode_id,
          nilai_transaksi: f.nilai_transaksi,
          markup_bpr: f.markup_bpr,
          margin_mtd: f.margin_mtd,
          fee_bpr: f.fee_bpr,
          fee_mtd: f.fee_mtd,
        }))
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat fee");
    }
  }

  async function handleSelectPg(pg: PaymentGateway) {
    setSelectedPg(pg);
    setLoading(true);
    await loadFees(pg.id);
    setLoading(false);
  }

  function handleAddRow() {
    setFees((prev) => [
      ...prev,
      { ...EMPTY_FEE, _key: `new_${Date.now()}` },
    ]);
  }

  function handleRemoveRow(key: string) {
    setFees((prev) => prev.filter((f) => f._key !== key));
  }

  function handleChange(key: string, field: keyof typeof EMPTY_FEE, value: number) {
    setFees((prev) =>
      prev.map((f) => (f._key === key ? { ...f, [field]: value } : f))
    );
  }

  async function handleSave() {
    if (!selectedPg) return;
    const invalid = fees.find((f) => !f.tcode_id);
    if (invalid) {
      toast.error("Pilih TCode untuk setiap baris fee");
      return;
    }
    const duplicates = fees.filter(
      (f, i) => fees.findIndex((x) => x.tcode_id === f.tcode_id) !== i
    );
    if (duplicates.length > 0) {
      toast.error("TCode tidak boleh duplikat dalam satu PG");
      return;
    }
    try {
      setSaving(true);
      await saveAllFeePG(selectedPg.id, fees);
      toast.success("Setup fee berhasil disimpan");
      await loadFees(selectedPg.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  const usedTcodeIds = fees.map((f) => f.tcode_id);
  const availableTcodes = (rowKey: string, currentId: number) =>
    tcodes.filter((t) => t.id === currentId || !usedTcodeIds.includes(t.id));

  const feeFields: { key: keyof typeof EMPTY_FEE; label: string }[] = [
    { key: "nilai_transaksi", label: "Nilai Transaksi" },
    { key: "markup_bpr", label: "Markup BPR" },
    { key: "margin_mtd", label: "Margin MTD" },
    { key: "fee_bpr", label: "Fee BPR" },
    { key: "fee_mtd", label: "Fee MTD" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Setup Fee per Payment Gateway</h1>
        <p className="text-sm text-gray-500 mt-1">
          Konfigurasi fee berdasarkan Payment Gateway dan TCode transaksi.
          Setiap PG memiliki fee berbeda untuk setiap TCode.
        </p>
      </div>

      {loading && !selectedPg ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-gray-400 shadow-sm">Memuat...</div>
      ) : (
        <div className="flex gap-6">
          {/* SIDEBAR PG LIST */}
          <div className="w-72 shrink-0 space-y-3">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Payment Gateway
              </p>
              <div className="space-y-1">
                {pgList.filter((p) => p.is_active).map((pg) => (
                  <button
                    key={pg.id}
                    onClick={() => void handleSelectPg(pg)}
                    className={`w-full text-left rounded-xl px-4 py-3 transition-colors ${
                      selectedPg?.id === pg.id
                        ? "bg-blue-50 border border-blue-200 text-blue-700"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="font-medium text-sm">{pg.nama}</div>
                    <div className="text-xs text-gray-400 mt-0.5 font-mono">{pg.kode}</div>
                    {Number(pg.global_flat_fee) > 0 && (
                      <div className="text-xs text-amber-600 mt-1">
                        Flat: Rp {Number(pg.global_flat_fee).toLocaleString("id-ID")}
                      </div>
                    )}
                  </button>
                ))}
                {pgList.filter((p) => p.is_active).length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">Belum ada PG aktif</p>
                )}
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0 space-y-4">
            {selectedPg ? (
              <>
                <div className="rounded-2xl border bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{selectedPg.nama}</h2>
                      <p className="text-sm text-gray-500">
                        <span className="font-mono bg-gray-100 rounded px-1">{selectedPg.kode}</span>
                        {Number(selectedPg.global_flat_fee) > 0 && (
                          <span className="ml-2 text-amber-600">
                            + Flat Rp {Number(selectedPg.global_flat_fee).toLocaleString("id-ID")} per transaksi
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => void loadFees(selectedPg.id)}
                        disabled={loading} className="h-8 px-3 text-xs">
                        <RefreshCcw className="mr-1 size-3.5" /> Refresh
                      </Button>
                      <Button size="sm" onClick={handleAddRow} className="h-8 px-3 text-xs">
                        <Plus className="mr-1 size-3.5" /> Tambah TCode
                      </Button>
                      <Button size="sm" onClick={() => void handleSave()} disabled={saving}
                        className="h-8 px-3 text-xs bg-green-600 hover:bg-green-700">
                        <Save className="mr-1 size-3.5" />
                        {saving ? "Menyimpan..." : "Simpan Semua"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* FEE TABLE */}
                <HorizontalDragScroll className="rounded-2xl border bg-white shadow-sm">
                  <Table className="min-w-[900px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[220px]">TCode Transaksi</TableHead>
                        <TableHead className="text-right min-w-[140px]">Nilai Transaksi</TableHead>
                        <TableHead className="text-right min-w-[130px]">Markup BPR</TableHead>
                        <TableHead className="text-right min-w-[120px]">Margin MTD</TableHead>
                        <TableHead className="text-right min-w-[110px]">Fee BPR</TableHead>
                        <TableHead className="text-right min-w-[110px]">Fee MTD</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400">Memuat...</TableCell></TableRow>
                      ) : fees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10 text-gray-400">
                            <p>Belum ada setup fee untuk PG ini.</p>
                            <p className="text-xs mt-1">Klik &ldquo;Tambah TCode&rdquo; untuk menambah fee.</p>
                          </TableCell>
                        </TableRow>
                      ) : fees.map((row) => (
                        <TableRow key={row._key}>
                          <TableCell>
                            <select
                              value={row.tcode_id || ""}
                              onChange={(e) => handleChange(row._key, "tcode_id", Number(e.target.value))}
                              className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                            >
                              <option value="">-- Pilih TCode --</option>
                              {availableTcodes(row._key, row.tcode_id).map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.tcode} - {t.keterangan}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                          {feeFields.map((field) => (
                            <TableCell key={field.key} className="text-right">
                              <input
                                type="number"
                                value={row[field.key]}
                                onChange={(e) => handleChange(row._key, field.key, Number(e.target.value))}
                                className="w-full border rounded-lg px-3 py-2 text-sm text-right"
                                min={0}
                              />
                            </TableCell>
                          ))}
                          <TableCell>
                            <Button variant="ghost" size="sm"
                              onClick={() => handleRemoveRow(row._key)}
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50">
                              <Trash2 className="size-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </HorizontalDragScroll>

                {/* SAVED DATA PREVIEW */}
                {savedFees.length > 0 && (
                  <div className="rounded-2xl border bg-gray-50 p-4 shadow-sm">
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Data tersimpan ({savedFees.length} TCode)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {savedFees.map((f) => (
                        <span key={f.tcode_id}
                          className="rounded-lg bg-white border px-3 py-1 text-xs font-mono">
                          {f.tcode} — {f.tcode_keterangan}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border bg-white p-10 text-center text-gray-400 shadow-sm">
                Pilih Payment Gateway di sebelah kiri
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
