"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import TcodeForm from "./TcodeForm";
import TcodeTable from "./TcodeTable";
import { TcodeFormValues, TcodeItem } from "./types";
import { createTcode, deleteTcode, getTcodes, updateTcode } from "@/lib/api/tcode";

export default function SetupTcodePage() {
  const [data, setData] = useState<TcodeItem[]>([]);
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TcodeItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getTcodes();
      setData(result);
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Gagal memuat data TCode");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredData = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return data;

    return data.filter((item) => {
      return (
        item.tcode.toLowerCase().includes(keyword) ||
        item.keterangan.toLowerCase().includes(keyword) ||
        (item.description || "").toLowerCase().includes(keyword)
      );
    });
  }, [data, query]);

  const totalActive = data.filter((item) => item.is_active).length;
  const totalInactive = data.filter((item) => !item.is_active).length;

  const handleCreateClick = () => {
    setSelectedItem(null);
    setSheetOpen(true);
  };

  const handleEditClick = (item: TcodeItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };

  const handleDeleteClick = async (item: TcodeItem) => {
    const ok = window.confirm(
      `Yakin ingin menghapus TCode ${item.tcode} - ${item.keterangan}?`
    );
    if (!ok) return;

    try {
      await deleteTcode(item.id);
      await loadData();
      window.alert("TCode berhasil dihapus.");
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Gagal menghapus TCode");
    }
  };

  const handleSubmit = async (values: TcodeFormValues) => {
    try {
      setSubmitting(true);

      if (selectedItem) {
        await updateTcode({
          id: selectedItem.id,
          tcode: values.tcode,
          keterangan: values.keterangan,
          description: values.description,
          is_active: values.is_active,
        });
      } else {
        await createTcode({
          tcode: values.tcode,
          keterangan: values.keterangan,
          description: values.description,
          is_active: values.is_active,
        });
      }

      setSheetOpen(false);
      setSelectedItem(null);
      await loadData();
      window.alert(selectedItem ? "TCode berhasil diperbarui." : "TCode berhasil ditambahkan.");
    } catch (error) {
      console.error(error);
      window.alert(error instanceof Error ? error.message : "Gagal menyimpan TCode");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Setup TCode</h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola master transaksi yang akan dipakai pada setup jurnal dan
              relasi data BPR.
            </p>
          </div>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button onClick={handleCreateClick}>
                <Plus className="mr-1 size-4" />
                Tambah TCode
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full sm:max-w-[560px] rounded-l-2xl bg-white p-0"
            >
              <SheetHeader className="border-b">
                <SheetTitle>
                  {selectedItem ? "Edit TCode" : "Tambah TCode"}
                </SheetTitle>
              </SheetHeader>

              <div className="p-6">
                <TcodeForm
                  mode={selectedItem ? "edit" : "create"}
                  initialData={selectedItem}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setSheetOpen(false);
                    setSelectedItem(null);
                  }}
                />
                {submitting && (
                  <p className="mt-3 text-sm text-gray-500">Menyimpan data...</p>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Total TCode</p>
            <p className="mt-1 text-2xl font-semibold">{data.length}</p>
          </div>

          <div className="rounded-xl border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Active</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-semibold">{totalActive}</p>
              <Badge>Aktif</Badge>
            </div>
          </div>

          <div className="rounded-xl border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Inactive</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-2xl font-semibold">{totalInactive}</p>
              <Badge variant="outline">Nonaktif</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Daftar TCode</h2>
            <p className="text-sm text-gray-500">
              Cari, edit, dan kelola status transaksi.
            </p>
          </div>

          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari kode / keterangan..."
              className="pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
            Memuat data TCode...
          </div>
        ) : (
          <TcodeTable
            data={filteredData}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </div>
    </div>
  );
}