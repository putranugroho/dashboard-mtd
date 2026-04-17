"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BprProfile } from "./types";

type Props = {
  value: BprProfile;
  onChange: (patch: Partial<BprProfile>) => void;
};

export default function BprForm({ value, onChange }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Profile BPR</h2>
          <p className="text-sm text-gray-500">
            Kelola data detail BPR berdasarkan bpr_id existing.
          </p>
        </div>

        <Badge variant={value.is_active ? "default" : "outline"}>
          {value.is_active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>BPR ID</Label>
          <Input value={value.bpr_id} readOnly disabled />
        </div>

        <div className="grid gap-2">
          <Label>Nama BPR</Label>
          <Input
            value={value.nama_bpr}
            onChange={(e) => onChange({ nama_bpr: e.target.value })}
            placeholder="Nama BPR"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <Label>Alamat</Label>
        <Textarea
          className="min-h-[100px]"
          value={value.alamat}
          onChange={(e) => onChange({ alamat: e.target.value })}
          placeholder="Alamat lengkap BPR"
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-gray-50 p-4">
          <h3 className="mb-4 text-sm font-semibold">Direktur</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Nama Direktur</Label>
              <Input
                value={value.direktur_nama}
                onChange={(e) => onChange({ direktur_nama: e.target.value })}
                placeholder="Nama direktur"
              />
            </div>
            <div className="grid gap-2">
              <Label>No. HP Direktur</Label>
              <Input
                value={value.direktur_hp}
                onChange={(e) => onChange({ direktur_hp: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-gray-50 p-4">
          <h3 className="mb-4 text-sm font-semibold">PIC</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Nama PIC</Label>
              <Input
                value={value.pic_nama}
                onChange={(e) => onChange({ pic_nama: e.target.value })}
                placeholder="Nama PIC"
              />
            </div>
            <div className="grid gap-2">
              <Label>No. HP PIC</Label>
              <Input
                value={value.pic_hp}
                onChange={(e) => onChange({ pic_hp: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border bg-gray-50 p-4">
          <h3 className="mb-4 text-sm font-semibold">Head Teller</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Nama Head Teller</Label>
              <Input
                value={value.head_teller_nama}
                onChange={(e) => onChange({ head_teller_nama: e.target.value })}
                placeholder="Nama head teller"
              />
            </div>
            <div className="grid gap-2">
              <Label>No. HP Head Teller</Label>
              <Input
                value={value.head_teller_hp}
                onChange={(e) => onChange({ head_teller_hp: e.target.value })}
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-gray-50 p-4">
          <h3 className="mb-4 text-sm font-semibold">Informasi Tambahan</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                value={value.email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder="email@domain.com"
              />
            </div>

            <div className="grid gap-2">
              <Label>Kode Pos</Label>
              <Input
                value={value.kode_pos}
                onChange={(e) => onChange({ kode_pos: e.target.value })}
                placeholder="Kode Pos"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Tanggal Bergabung</Label>
          <Input
            type="date"
            value={value.tanggal_bergabung}
            onChange={(e) => onChange({ tanggal_bergabung: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label>URL Gateway</Label>
          <Input
            value={value.url_gateway}
            onChange={(e) => onChange({ url_gateway: e.target.value })}
            placeholder="https://gateway.example.com"
          />
        </div>
      </div>

      <div className="mt-5 rounded-xl border bg-gray-50 p-4">
        <h3 className="mb-4 text-sm font-semibold">Logo BPR</h3>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label>Upload Logo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                onChange({ logo_bpr: file ? file.name : "" });
              }}
            />
            <p className="text-xs text-gray-500">
              Untuk saat ini baru disiapkan tempat upload dulu. Belum tersambung ke backend upload file.
            </p>
          </div>

          <div className="rounded-lg border border-dashed bg-white p-4 text-sm text-gray-600">
            {value.logo_bpr ? (
              <>
                <span className="font-medium">File terpilih:</span> {value.logo_bpr}
              </>
            ) : (
              "Belum ada logo yang dipilih"
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        <Label>Status</Label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`rounded-lg border px-3 py-2 text-sm ${
              value.is_active
                ? "border-green-600 bg-green-50 text-green-700"
                : "border-gray-200 text-gray-600"
            }`}
            onClick={() => onChange({ is_active: true })}
          >
            Active
          </button>

          <button
            type="button"
            className={`rounded-lg border px-3 py-2 text-sm ${
              !value.is_active
                ? "border-red-600 bg-red-50 text-red-700"
                : "border-gray-200 text-gray-600"
            }`}
            onClick={() => onChange({ is_active: false })}
          >
            Inactive
          </button>
        </div>
      </div>
    </div>
  );
}