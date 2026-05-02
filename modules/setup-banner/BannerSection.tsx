"use client";

import { Plus, RefreshCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";

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
import BannerForm from "./BannerForm";
import BannerTable from "./BannerTable";
import { BannerFormValues, BannerItem, BannerScopeType } from "./types";

type Props = {
  title: string;
  description: string;
  scopeType: BannerScopeType;
  bprId?: string;
  data: BannerItem[];
  loading: boolean;
  submitting: boolean;
  onRefresh: () => Promise<void> | void;
  onSubmit: (values: BannerFormValues, selectedItem: BannerItem | null) => Promise<void> | void;
  onDelete: (item: BannerItem) => Promise<void> | void;
  onPreview: (item: BannerItem) => void;
  rightControl?: React.ReactNode;
};

function getNextOrder(data: BannerItem[]) {
  const used = new Set(
    data
      .filter((item) => item.is_active)
      .map((item) => Number(item.urutan || 0))
      .filter((value) => value > 0)
  );

  let next = 1;
  while (used.has(next)) {
    next += 1;
  }

  return next;
}

export default function BannerSection({
  title,
  description,
  scopeType,
  bprId = "",
  data,
  loading,
  submitting,
  onRefresh,
  onSubmit,
  onDelete,
  onPreview,
  rightControl,
}: Props) {
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BannerItem | null>(null);
  const disableCreate = scopeType === "BPR" && !bprId.trim();

  const filteredData = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return data;

    return data.filter((item) => {
      return (
        item.title.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.banner_type.toLowerCase().includes(keyword) ||
        item.bpr_id.toLowerCase().includes(keyword)
      );
    });
  }, [data, query]);

  const nextOrder = useMemo(() => getNextOrder(data), [data]);
  const activeCount = data.filter((item) => item.is_active).length;
  const inactiveCount = data.filter((item) => !item.is_active).length;

  const handleCreate = () => {
    if (scopeType === "BPR" && !bprId.trim()) {
      window.alert("Masukkan BPR ID terlebih dahulu untuk membuat banner khusus BPR.");
      return;
    }

    setSelectedItem(null);
    setSheetOpen(true);
  };

  const handleEdit = (item: BannerItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };

  const handleSubmit = async (values: BannerFormValues) => {
    await onSubmit(values, selectedItem);
    setSheetOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <Badge variant={scopeType === "GLOBAL" ? "default" : "secondary"}>{scopeType}</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>

        <div className="flex flex-col gap-3 xl:min-w-[520px]">
          {rightControl}

          <div className="flex flex-col gap-2 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari title / jenis / BPR..."
                className="pl-9"
              />
            </div>

            <Button type="button" variant="outline" onClick={onRefresh} disabled={loading}>
              <RefreshCcw className="mr-2 size-4" />
              Refresh
            </Button>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button type="button" onClick={handleCreate} disabled={disableCreate}>
                  <Plus className="mr-1 size-4" />
                  Tambah Banner
                </Button>
              </SheetTrigger>


              <SheetContent side="right" className="w-full overflow-y-auto rounded-l-2xl bg-white p-0 sm:max-w-[640px]">
                <SheetHeader className="border-b">
                  <SheetTitle>{selectedItem ? "Edit Banner" : "Tambah Banner"}</SheetTitle>
                </SheetHeader>

                <div className="p-6">
                  <BannerForm
                    mode={selectedItem ? "edit" : "create"}
                    scopeType={scopeType}
                    bprId={bprId}
                    nextOrder={selectedItem ? selectedItem.urutan : nextOrder}
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
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Total Banner</p>
          <p className="mt-1 text-2xl font-semibold">{data.length}</p>
        </div>
        <div className="rounded-xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Aktif</p>
          <p className="mt-1 text-2xl font-semibold">{activeCount}</p>
        </div>
        <div className="rounded-xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Nonaktif</p>
          <p className="mt-1 text-2xl font-semibold">{inactiveCount}</p>
        </div>
        <div className="rounded-xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Urutan Berikutnya</p>
          <p className="mt-1 text-2xl font-semibold">#{nextOrder}</p>
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-500">
            Memuat data banner...
          </div>
        ) : (
          <BannerTable
            data={filteredData}
            onEdit={handleEdit}
            onDelete={onDelete}
            onPreview={onPreview}
          />
        )}
      </div>
    </div>
  );
}
