"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCcw, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  createMasterPG, deleteMasterPG, getMasterPG, PaymentGateway, updateMasterPG,
} from "@/lib/api/payment-gateway";

const EMPTY_FORM = {
  kode: "", nama: "", deskripsi: "", global_flat_fee: 0, is_active: true,
};

export default function MasterPaymentGatewayPage() {
  const [data, setData] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState<PaymentGateway | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  async function load() {
    try {
      setLoading(true);
      setData(await getMasterPG());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  function handleAdd() {
    setSelected(null);
    setForm(EMPTY_FORM);
    setSheetOpen(true);
  }

  function handleEdit(item: PaymentGateway) {
    setSelected(item);
    setForm({
      kode: item.kode,
      nama: item.nama,
      deskripsi: item.deskripsi ?? "",
      global_flat_fee: Number(item.global_flat_fee),
      is_active: item.is_active,
    });
    setSheetOpen(true);
  }

  async function handleDelete(item: PaymentGateway) {
    if (!window.confirm(`Hapus Payment Gateway "${item.nama}"?`)) return;
    try {
      await deleteMasterPG(item.id);
      toast.success("Data berhasil dihapus");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus");
    }
  }

  async function handleSubmit() {
    if (!form.kode.trim() || !form.nama.trim()) {
      toast.error("Kode dan Nama wajib diisi");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        kode: form.kode.trim().toUpperCase(),
        nama: form.nama.trim(),
        deskripsi: form.deskripsi || undefined,
        global_flat_fee: Number(form.global_flat_fee),
        is_active: form.is_active,
      };
      if (selected) {
        await updateMasterPG(selected.id, payload);
        toast.success("Payment Gateway berhasil diperbarui");
      } else {
        await createMasterPG(payload);
        toast.success("Payment Gateway berhasil ditambahkan");
      }
      setSheetOpen(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  }

  const active = useMemo(() => data.filter((d) => d.is_active).length, [data]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Master Payment Gateway</h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola vendor Payment Gateway / Biller. Setiap PG memiliki setup fee per TCode transaksi.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void load()} disabled={loading} className="h-9 px-3 text-sm">
              <RefreshCcw className="mr-2 size-4" /> Refresh
            </Button>
            <Button onClick={handleAdd} className="h-9 px-3 text-sm">
              <Plus className="mr-2 size-4" /> Tambah PG
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total PG</p>
          <p className="mt-2 text-3xl font-bold">{data.length}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Aktif</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{active}</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Nonaktif</p>
          <p className="mt-2 text-3xl font-bold text-red-500">{data.length - active}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Nama PG</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-right">Global Flat Fee</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-gray-400">Memuat...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-gray-400">Belum ada data</TableCell></TableRow>
            ) : data.map((item, i) => (
              <TableRow key={item.id}>
                <TableCell className="text-gray-400">{i + 1}</TableCell>
                <TableCell>
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-mono text-blue-700">{item.kode}</span>
                </TableCell>
                <TableCell className="font-medium">{item.nama}</TableCell>
                <TableCell className="text-gray-500 text-sm">{item.deskripsi ?? "-"}</TableCell>
                <TableCell className="text-right font-mono">
                  Rp {Number(item.global_flat_fee).toLocaleString("id-ID")}
                </TableCell>
                <TableCell className="text-center">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {item.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="h-8 px-2">
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => void handleDelete(item)}
                      className="h-8 px-2 text-red-600 hover:bg-red-50 hover:border-red-300">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[420px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selected ? "Edit Payment Gateway" : "Tambah Payment Gateway"}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6 px-1">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Kode PG *</label>
              <input value={form.kode}
                onChange={(e) => setForm({ ...form, kode: e.target.value.toUpperCase() })}
                disabled={!!selected} placeholder="MOTION_PAY"
                className={`w-full border rounded-lg px-3 py-2 text-sm ${selected ? "bg-gray-100" : ""}`} />
              <p className="text-xs text-gray-400">Huruf kapital + underscore, tidak bisa diubah setelah disimpan</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nama PG *</label>
              <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="MotionPay" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                placeholder="Deskripsi singkat" rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm resize-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Global Flat Fee (Rp)</label>
              <input type="number" value={form.global_flat_fee}
                onChange={(e) => setForm({ ...form, global_flat_fee: Number(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
              <p className="text-xs text-gray-400">Fee flat per transaksi (semua tipe). Contoh: 500</p>
            </div>
            <div className="flex items-center gap-3">
              <input id="is_active" type="checkbox" checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300" />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Aktif</label>
            </div>
            <Button onClick={handleSubmit} disabled={submitting} className="w-full">
              {submitting ? "Menyimpan..." : selected ? "Perbarui" : "Simpan"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
