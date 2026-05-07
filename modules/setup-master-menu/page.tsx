"use client";

import { Plus, RefreshCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  createMasterMenu,
  deleteMasterMenu,
  getMasterMenus,
  updateMasterMenu,
} from "@/lib/api/master-menu";

import MasterMenuForm from "./MasterMenuForm";
import MasterMenuTable from "./MasterMenuTable";
import { MasterMenuFormValues, MasterMenuItem } from "./types";

export default function SetupMasterMenuPage() {
  const [data, setData] = useState<MasterMenuItem[]>([]);
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MasterMenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getMasterMenus();
      setData(result);
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal memuat master menu"
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
        item.modul.toLowerCase().includes(keyword) ||
        item.menu.toLowerCase().includes(keyword) ||
        item.submenu.toLowerCase().includes(keyword) ||
        item.subsubmenu.toLowerCase().includes(keyword)
      );
    });
  }, [data, query]);

  const totalActive = data.filter((item) => item.is_active).length;
  const totalInactive = data.filter((item) => !item.is_active).length;
  const nextOrder =
    data.length === 0 ? 1 : Math.max(...data.map((item) => Number(item.urut || 0))) + 1;

  const handleCreate = () => {
    setSelectedItem(null);
    setSheetOpen(true);
  };

  const handleEdit = (item: MasterMenuItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };

  const handleDelete = async (item: MasterMenuItem) => {
    const ok = window.confirm(
      `Yakin ingin menonaktifkan menu "${item.menu} - ${item.submenu}"?`
    );
    if (!ok) return;

    try {
      await deleteMasterMenu(item.id);
      await loadData();
      window.alert("Master menu berhasil dinonaktifkan.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal menonaktifkan master menu"
      );
    }
  };

  const handleSubmit = async (values: MasterMenuFormValues) => {
    try {
      setSubmitting(true);

      const payload = {
        ...values,
        urut: values.urut || nextOrder,
      };

      if (selectedItem) {
        await updateMasterMenu(selectedItem.id, payload);
      } else {
        await createMasterMenu(payload);
      }

      setSheetOpen(false);
      setSelectedItem(null);
      await loadData();

      window.alert(
        selectedItem
          ? "Master menu berhasil diperbarui."
          : "Master menu berhasil ditambahkan."
      );
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal menyimpan master menu"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Setup Master Menu
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola master menu CMS dari database middleware. Data ini akan
              dikonsumsi oleh CMS-IBPR melalui endpoint master_menu.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 md:flex-row xl:w-auto">
            <div className="relative min-w-[320px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari modul / menu / submenu..."
                className="pl-9"
              />
            </div>

            <Button variant="outline" onClick={loadData} disabled={loading}>
              <RefreshCcw className="mr-2 size-4" />
              Refresh
            </Button>

            <Button onClick={handleCreate}>
              <Plus className="mr-2 size-4" />
              Tambah Menu
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Menu</p>
          <p className="mt-2 text-3xl font-bold">{data.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Aktif</p>
          <p className="mt-2 text-3xl font-bold">{totalActive}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Nonaktif</p>
          <p className="mt-2 text-3xl font-bold">{totalInactive}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Urutan Berikutnya</p>
          <p className="mt-2 text-3xl font-bold">#{nextOrder}</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          Memuat master menu...
        </div>
      ) : (
        <MasterMenuTable
          data={filteredData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto rounded-l-2xl bg-white sm:max-w-[640px]"
        >
          <SheetHeader className="pb-5">
            <SheetTitle>
              {selectedItem ? "Edit Master Menu" : "Tambah Master Menu"}
            </SheetTitle>
          </SheetHeader>

          <div className="pb-6">
            <MasterMenuForm
              initialData={selectedItem}
              submitting={submitting}
              onSubmit={handleSubmit}
              onCancel={() => {
                setSheetOpen(false);
                setSelectedItem(null);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}