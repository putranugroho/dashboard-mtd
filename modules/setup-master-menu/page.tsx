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
  getMasterMenuModules,
  getMasterMenus,
  updateMasterMenu,
} from "@/lib/api/master-menu";

import MasterMenuForm from "./MasterMenuForm";
import MasterMenuTable from "./MasterMenuTable";
import {
  MasterMenuFormValues,
  MasterMenuItem,
  MasterMenuModuleOption,
} from "./types";

const DEFAULT_MODULE = "CMS";

export default function SetupMasterMenuPage() {
  const [data, setData] = useState<MasterMenuItem[]>([]);
  const [modules, setModules] = useState<MasterMenuModuleOption[]>([]);
  const [type, setType] = useState(DEFAULT_MODULE);
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MasterMenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const moduleOptions = useMemo(() => {
    const map = new Map<string, MasterMenuModuleOption>();

    modules.forEach((item) => {
      const modul = item.modul?.trim().toUpperCase();
      if (!modul) return;

      map.set(modul, {
        modul,
        modul_urut: Number(item.modul_urut || 0),
      });
    });

    if (type && !map.has(type)) {
      map.set(type, {
        modul: type,
        modul_urut: 0,
      });
    }

    return Array.from(map.values()).sort((a, b) => {
      const urutA = Number(a.modul_urut || 0);
      const urutB = Number(b.modul_urut || 0);

      if (urutA !== urutB) return urutA - urutB;
      return a.modul.localeCompare(b.modul);
    });
  }, [modules, type]);

  const loadModules = async () => {
    try {
      setLoadingModules(true);
      const result = await getMasterMenuModules();
      setModules(result);

      const hasCurrentType = result.some(
        (item) => item.modul?.trim().toUpperCase() === type
      );

      if (!hasCurrentType && result.length > 0) {
        const firstModule = result[0].modul?.trim().toUpperCase();
        if (firstModule) {
          setType(firstModule);
          await loadData(firstModule);
        }
      }
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal memuat daftar module"
      );
    } finally {
      setLoadingModules(false);
    }
  };

  const loadData = async (targetType = type) => {
    try {
      setLoading(true);
      const normalizedType = targetType.trim().toUpperCase();
      const result = await getMasterMenus(normalizedType);
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
    void loadModules();
    void loadData(DEFAULT_MODULE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const moduleCount = new Set(data.map((item) => item.modul)).size;
  const menuCount = new Set(
    data.map((item) => `${item.modul}::${item.menu}`)
  ).size;

  const handleChangeModule = async (nextType: string) => {
    const normalizedType = nextType.trim().toUpperCase();
    setType(normalizedType);
    setQuery("");
    await loadData(normalizedType);
  };

  const handleRefresh = async () => {
    await loadModules();
    await loadData(type);
  };

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
      `Yakin ingin menonaktifkan menu "${item.modul} > ${item.menu} > ${item.submenu}${
        item.subsubmenu ? ` > ${item.subsubmenu}` : ""
      }"?`
    );

    if (!ok) return;

    try {
      await deleteMasterMenu(item.id);
      await loadModules();
      await loadData(type);
      window.alert("Master menu berhasil dinonaktifkan.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error
          ? error.message
          : "Gagal menonaktifkan master menu"
      );
    }
  };

  const handleSubmit = async (values: MasterMenuFormValues) => {
    try {
      setSubmitting(true);

      const submittedModule = (values.modul || type).trim().toUpperCase();

      const payload = {
        ...values,
        modul: submittedModule,
      };

      if (selectedItem) {
        await updateMasterMenu(selectedItem.id, payload);
      } else {
        await createMasterMenu(payload);
      }

      setSheetOpen(false);
      setSelectedItem(null);

      await loadModules();
      setType(submittedModule);
      await loadData(submittedModule);

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
    <div className="min-w-0 space-y-6">
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
  <div className="flex min-w-0 items-start justify-between gap-4">
    <div className="min-w-0 flex-1">
      <h1 className="text-lg font-semibold leading-tight text-gray-900">
        Setup Master Menu
      </h1>

      <p className="mt-1 max-w-[620px] text-xs leading-5 text-gray-500 line-clamp-2">
        Kelola master menu CMS dari database middleware dengan struktur bertingkat:
        Module → Menu → Submenu → Subsubmenu.
      </p>
    </div>

    <div className="flex min-w-0 flex-[1.4] items-center justify-end gap-2">
      <select
        value={type}
        onChange={(e) => void handleChangeModule(e.target.value)}
        disabled={loadingModules}
        className="h-9 w-[86px] shrink-0 rounded-md border border-input bg-background px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-60"
      >
        {moduleOptions.length > 0 ? (
          moduleOptions.map((item) => (
            <option key={item.modul} value={item.modul}>
              {item.modul}
            </option>
          ))
        ) : (
          <option value={type}>{type}</option>
        )}
      </select>

      <div className="relative min-w-[260px] flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari module / menu / submenu..."
          className="h-9 pl-9 text-xs"
        />
      </div>

      <Button
        variant="outline"
        onClick={() => void handleRefresh()}
        disabled={loading || loadingModules}
        className="h-9 shrink-0 px-3 text-xs"
      >
        <RefreshCcw className="mr-2 size-4" />
        Refresh
      </Button>

      <Button onClick={handleCreate} className="h-9 shrink-0 px-3 text-xs">
        <Plus className="mr-2 size-4" />
        Tambah Menu
      </Button>
    </div>
  </div>
</div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Row</p>
          <p className="mt-2 text-3xl font-bold">{data.length}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Module</p>
          <p className="mt-2 text-3xl font-bold">{moduleCount}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Menu</p>
          <p className="mt-2 text-3xl font-bold">{menuCount}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Aktif / Nonaktif</p>
          <p className="mt-2 text-2xl font-bold">
            {totalActive} / {totalInactive}
          </p>
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
          className="w-full overflow-y-auto rounded-l-2xl bg-white sm:max-w-[720px]"
        >
          <SheetHeader className="pb-5">
            <SheetTitle>
              {selectedItem ? "Edit Master Menu" : "Tambah Master Menu"}
            </SheetTitle>
          </SheetHeader>

          <div className="pb-6">
            <MasterMenuForm
              initialData={selectedItem}
              allData={data}
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