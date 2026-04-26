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

import {
  createMerchant,
  deleteMerchant,
  getMerchants,
  updateMerchant,
} from "@/lib/api/merchant";
import MerchantForm from "./MerchantForm";
import MerchantTable from "./MerchantTable";
import { MerchantFormValues, MerchantItem } from "./types";

export default function SetupMerchantPage() {
  const [data, setData] = useState<MerchantItem[]>([]);
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MerchantItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getMerchants();
      setData(result);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal memuat data merchant"
      );
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
        item.merchant_id.toLowerCase().includes(keyword) ||
        item.nama_merchant.toLowerCase().includes(keyword) ||
        item.pic.toLowerCase().includes(keyword) ||
        item.no_hp.toLowerCase().includes(keyword)
      );
    });
  }, [data, query]);

  const totalActive = data.filter((item) => item.is_active).length;
  const totalInactive = data.filter((item) => !item.is_active).length;

  const handleCreateClick = () => {
    setSelectedItem(null);
    setSheetOpen(true);
  };

  const handleEditClick = (item: MerchantItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };

  const handleDeleteClick = async (item: MerchantItem) => {
    const ok = window.confirm(
      `Yakin ingin menonaktifkan merchant ${item.merchant_id} - ${item.nama_merchant}?`
    );
    if (!ok) return;

    try {
      await deleteMerchant(item.id);
      await loadData();
      window.alert("Merchant berhasil dinonaktifkan.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal menonaktifkan merchant"
      );
    }
  };

  const handleSubmit = async (values: MerchantFormValues) => {
    try {
      setSubmitting(true);

      if (selectedItem) {
        await updateMerchant(selectedItem.id, values);
      } else {
        await createMerchant(values);
      }

      setSheetOpen(false);
      setSelectedItem(null);
      await loadData();

      window.alert(
        selectedItem
          ? "Merchant berhasil diperbarui."
          : "Merchant berhasil ditambahkan."
      );
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal menyimpan data merchant"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Setup Merchant
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola data merchant, PIC, nomor kontak, dan status merchant.
            </p>
          </div>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button onClick={handleCreateClick}>
                <Plus className="mr-1 size-4" />
                Tambah Merchant
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full rounded-l-2xl bg-white p-0 sm:max-w-[560px]"
            >
              <SheetHeader className="border-b">
                <SheetTitle>
                  {selectedItem ? "Edit Merchant" : "Tambah Merchant"}
                </SheetTitle>
              </SheetHeader>

              <div className="p-6">
                <MerchantForm
                  mode={selectedItem ? "edit" : "create"}
                  initialData={selectedItem}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setSheetOpen(false);
                    setSelectedItem(null);
                  }}
                />

                {submitting && (
                  <p className="mt-3 text-sm text-gray-500">
                    Menyimpan data...
                  </p>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Total Merchant</p>
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
            <h2 className="text-lg font-semibold">Daftar Merchant</h2>
            <p className="text-sm text-gray-500">
              Cari, edit, dan kelola data merchant.
            </p>
          </div>

          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari merchant / PIC..."
              className="pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
            Memuat data merchant...
          </div>
        ) : (
          <MerchantTable
            data={filteredData}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </div>
    </div>
  );
}