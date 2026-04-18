"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BprTcodeItem } from "./types";
import BprTcodeTable from "./BprTcodeTable";

type Props = {
  data: BprTcodeItem[];
  onToggle: (tcodeId: number) => void;
  onSave: () => void;
};

export default function BprTcodeMapping({ data, onToggle, onSave }: Props) {
  const linkedCount = data.filter((item) => item.is_linked).length;
  const unlinkedCount = data.filter((item) => !item.is_linked).length;
  const journalCount = data.filter((item) => item.journal).length;
  const journalReadyCount = data.filter((item) => item.journal_ready).length;

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Relasi TCode</h2>
          <p className="text-sm text-gray-500">
            Pilih transaksi code yang aktif dan dapat digunakan untuk BPR ini.
            Relasi hanya bisa diaktifkan jika setup journal pada dashboard MTD
            untuk TCode tersebut sudah dibuat.
          </p>
        </div>

        <Button onClick={onSave}>Simpan Relasi TCode</Button>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Total TCode</p>
          <p className="mt-1 text-2xl font-semibold">{data.length}</p>
        </div>

        <div className="rounded-xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Linked</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-2xl font-semibold">{linkedCount}</p>
            <Badge>Aktif</Badge>
          </div>
        </div>

        <div className="rounded-xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Journal</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-2xl font-semibold">{journalCount}</p>
            <Badge variant="secondary">Setup MTD</Badge>
          </div>
        </div>

        <div className="rounded-xl border bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Journal Ready</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-2xl font-semibold">{journalReadyCount}</p>
            <Badge variant="outline">Setup CMS</Badge>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <span className="font-semibold">Catatan:</span> Status <b>Journal</b>{" "}
        menandakan admin sudah membuat setup journal di dashboard MTD. Status{" "}
        <b>Journal Ready</b> menandakan user di CMS-IBPR sudah berhasil
        menyimpan setup journal transaksi sesuai aturan yang dibuat di dashboard
        MTD.
      </div>

      <BprTcodeTable data={data} onToggle={onToggle} />
    </div>
  );
}