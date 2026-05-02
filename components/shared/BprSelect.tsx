"use client";

import { useEffect, useMemo, useState } from "react";
import { getListBpr, ListBprItem } from "@/lib/api/bpr";

type Props = {
  value: string;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  onChange: (bprId: string, item?: ListBprItem) => void;
};

export default function BprSelect({
  value,
  disabled = false,
  label = "BPR",
  placeholder = "Pilih BPR",
  onChange,
}: Props) {
  const [items, setItems] = useState<ListBprItem[]>([]);
  const [loading, setLoading] = useState(false);

  const selected = useMemo(
    () => items.find((item) => item.bpr_id === value),
    [items, value]
  );

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const result = await getListBpr();
        setItems(result);
      } catch (error) {
        console.error(error);
        window.alert(
          error instanceof Error ? error.message : "Gagal memuat list BPR"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">{label}</label>

      <select
        value={value}
        disabled={disabled || loading}
        onChange={(e) => {
          const nextId = e.target.value;
          const found = items.find((item) => item.bpr_id === nextId);
          onChange(nextId, found);
        }}
        className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-800 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        <option value="">
          {loading ? "Memuat BPR..." : placeholder}
        </option>

        {items.map((item) => (
          <option key={item.bpr_id} value={item.bpr_id}>
            {item.bpr_id} - {item.nama_bpr || "-"}
          </option>
        ))}
      </select>
    </div>
  );
}