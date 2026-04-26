"use client";

import { Copy, Mail, MessageCircle, Phone, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BprProfile } from "@/modules/data-bpr/types";
import { GatewayMonitorItem } from "./types";
import { getGatewayStatusLabel, getGatewayStatusTone } from "./utils";

type Props = {
  open: boolean;
  loading: boolean;
  item: GatewayMonitorItem | null;
  profile: BprProfile | null;
  errorMessage: string;
  onClose: () => void;
};

function normalizePhone(phone: string) {
  const raw = String(phone || "").replace(/\D/g, "");

  if (!raw) return "";

  if (raw.startsWith("62")) return raw;
  if (raw.startsWith("0")) return `62${raw.slice(1)}`;

  return raw;
}

async function copyText(value: string, label: string) {
  const text = String(value || "").trim();

  if (!text) {
    window.alert(`${label} tidak tersedia.`);
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    window.alert(`${label} berhasil disalin.`);
  } catch {
    window.alert(`Gagal menyalin ${label}.`);
  }
}

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-xl border bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium text-gray-900">
        {value?.trim() || "-"}
      </p>
    </div>
  );
}

export default function BprContactDialog({
  open,
  loading,
  item,
  profile,
  errorMessage,
  onClose,
}: Props) {
  if (!open) return null;

  const statusTone = item ? getGatewayStatusTone(item.status) : null;
  const picPhone = profile?.pic_hp || "";
  const email = profile?.email || "";
  const waPhone = normalizePhone(picPhone);

  const waMessage = encodeURIComponent(
    `Halo ${profile?.pic_nama || "PIC"}, kami dari admin dashboard MTD ingin menginformasikan terdapat kendala pada gateway ${profile?.nama_bpr || item?.nama_bpr || ""} (${item?.bpr_id || ""}). Mohon dapat dibantu pengecekannya.`
  );

  const whatsappUrl = waPhone
    ? `https://wa.me/${waPhone}?text=${waMessage}`
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b p-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Detail Kontak PIC
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Data kontak teknis BPR untuk penanganan kendala gateway.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-92px)] overflow-y-auto p-6">
          {loading ? (
            <div className="rounded-xl border border-dashed p-10 text-center text-sm text-gray-500">
              Memuat detail PIC...
            </div>
          ) : (
            <div className="space-y-5">
                {errorMessage ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        {errorMessage}
                    </div>
                ) : null}
              <div className="rounded-2xl border bg-white p-5">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Nama BPR</p>
                    <h3 className="mt-1 text-lg font-semibold text-gray-900">
                      {profile?.nama_bpr || item?.nama_bpr || "-"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      BPR ID: {profile?.bpr_id || item?.bpr_id || "-"}
                    </p>
                  </div>

                  {item && statusTone ? (
                    <Badge
                      variant="outline"
                      className={`w-fit border ${statusTone.badge}`}
                    >
                      {getGatewayStatusLabel(item.status)}
                    </Badge>
                  ) : null}
                </div>

                {item?.reason ? (
                  <div className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                    <span className="font-semibold">Keterangan:</span>{" "}
                    {item.reason}
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nama PIC" value={profile?.pic_nama} />
                <Field label="No HP PIC" value={profile?.pic_hp} />
                <Field label="Email" value={profile?.email} />
                <Field label="Gateway URL" value={profile?.url_gateway || item?.gateway_url} />
              </div>

              <Field label="Alamat" value={profile?.alamat} />

              <div className="flex flex-col gap-3 border-t pt-5 md:flex-row md:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => copyText(picPhone, "No HP PIC")}
                >
                  <Copy className="mr-2 size-4" />
                  Copy No HP
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => copyText(email, "Email PIC")}
                >
                  <Mail className="mr-2 size-4" />
                  Copy Email
                </Button>

                <Button
                  type="button"
                  disabled={!whatsappUrl}
                  onClick={() => {
                    if (!whatsappUrl) {
                      window.alert("Nomor HP PIC tidak tersedia.");
                      return;
                    }

                    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  <MessageCircle className="mr-2 size-4" />
                  Pesan WhatsApp
                </Button>

                <Button type="button" variant="ghost" onClick={onClose}>
                  <Phone className="mr-2 size-4" />
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}