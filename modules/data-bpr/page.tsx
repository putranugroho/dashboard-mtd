"use client";

import { Search, Save } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import PermissionButton from "@/components/auth/PermissionButton";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import { Input } from "@/components/ui/input";

import BprForm from "./BprForm";
import BprTcodeMapping from "./BprTcodeMapping";
import { BprProfile, BprTcodeItem } from "./types";
import {
  createEmptyBprProfile,
  normalizeBprProfile,
} from "./bpr-profile-factory";
import {
  getBprDetailWithTcodes,
  saveBprProfile,
  saveBprTcodes,
  uploadBprLogo,
} from "@/lib/api/bpr";

const emptyProfile = (bprId: string): BprProfile => ({
  bpr_id: bprId,
  nama_bpr: "",
  alamat: "",
  direktur_nama: "",
  direktur_hp: "",
  pic_nama: "",
  pic_hp: "",
  head_teller_nama: "",
  head_teller_hp: "",
  email: "",
  tanggal_bergabung: "",
  url_gateway: "",
  url_collme: "",
  url_medfo: "",
  url_hrm: "",
  url_core: "",
  kode_pos: "",
  logo_bpr: "",
  is_active: true,
  is_existing_profile: false,
  create_super_admin: true,
  create_system_user: true,
});

export default function DataBprPage() {
  const [searchCode, setSearchCode] = useState("");
  const [selectedCode, setSelectedCode] = useState("");
  const [profile, setProfile] = useState<BprProfile>(createEmptyBprProfile(""));
  const [tcodes, setTcodes] = useState<BprTcodeItem[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { can } = useSession();
  const canSave = can(PERMISSIONS.DATA_BPR_SAVE);
  const canRelasi = can(PERMISSIONS.DATA_BPR_RELASI);

  const handleSearch = async () => {
    const code = searchCode.trim();
    if (!code) return;

    try {
      setLoading(true);
      const result = await getBprDetailWithTcodes(code);

      const nextProfile = result.profile ?? createEmptyBprProfile(code);
      const isExisting = nextProfile.is_existing_profile === true;

      setSelectedCode(code);
      setProfile(
        normalizeBprProfile(nextProfile, code, {
          defaultExisting: isExisting,
          defaultProvisioning: !isExisting,
        })
      );
      setLogoFile(null);
      setTcodes(result.tcodes ?? []);
    } catch (error) {
      console.error(error);
      setSelectedCode(code);
      setProfile(createEmptyBprProfile(code));
      setTcodes([]);
      window.alert(
        error instanceof Error ? error.message : "Gagal memuat data BPR"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (patch: Partial<BprProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  const handleToggleTcode = (tcodeId: number) => {
    if (!canRelasi) return;
    setTcodes((prev) =>
      prev.map((item) => {
        if (item.id !== tcodeId) return item;

        if (!item.is_linked && !item.journal) {
          window.alert(
            `TCode ${item.tcode} belum memiliki setup journal di Dashboard MTD. Relasi belum bisa diaktifkan.`
          );
          return item;
        }

        if (
          item.is_linked &&
          (item.journal_ready && item.accounting_ready)
        ) {
          const ok = window.confirm(
            `TCode ${item.tcode} sudah memiliki setup lanjutan:\n\n` +
              `Journal CMS: ${item.journal_ready ? "Sudah" : "Belum"}\n` +
              `Rekonsiliasi: ${item.accounting_ready ? "Sudah" : "Belum"}\n\n` +
              `Relasi akan dinonaktifkan, tetapi data lama tetap disimpan dan bisa dipulihkan saat diaktifkan kembali.\n\n` +
              `Lanjutkan?`
          );

          if (!ok) return item;
        }

        return {
          ...item,
          is_linked: !item.is_linked,
        };
      })
    );
  };

  const handleSaveProfile = async () => {
    if (!canSave) {
      window.alert("Anda tidak memiliki akses untuk menyimpan profile BPR.");
      return;
    }
    try {
      let nextProfile = profile;

      if (logoFile) {
        const uploaded = await uploadBprLogo(logoFile);

        nextProfile = {
          ...profile,
          logo_bpr: uploaded.file_name,
        };

        setProfile(nextProfile);
      }

      const saveResult = await saveBprProfile(nextProfile);
      setLogoFile(null);

      setProfile((prev) =>
        normalizeBprProfile(
          {
            ...prev,
            logo_bpr: nextProfile.logo_bpr,
            is_existing_profile: true,
            create_super_admin: false,
            create_system_user: false,
          },
          prev.bpr_id || selectedCode,
          {
            defaultExisting: true,
            defaultProvisioning: false,
          }
        )
      );

      const autoUser = saveResult.data?.auto_user;
      if (Array.isArray(autoUser) && autoUser.length > 0) {
        const failed = autoUser.filter((item: any) => item?.success === false);

        if (failed.length > 0) {
          window.alert(
            `Profile BPR berhasil disimpan, tetapi ada ${failed.length} proses auto user yang gagal.`
          );
          return;
        }
      }

      window.alert("Profile BPR berhasil disimpan.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal menyimpan profile BPR"
      );
    }
  };

  const handleSaveTcode = async () => {
    if (!canRelasi) {
      window.alert("Anda tidak memiliki akses relasi TCode BPR.");
      return;
    }
    try {
      const linkedIds = tcodes
        .filter((item) => item.is_linked)
        .map((item) => item.id);

      await saveBprTcodes(profile.bpr_id || selectedCode, linkedIds);

      const refreshed = await getBprDetailWithTcodes(
        profile.bpr_id || selectedCode
      );
      setProfile(
        normalizeBprProfile(
          refreshed.profile,
          profile.bpr_id || selectedCode,
          {
            defaultExisting: true,
            defaultProvisioning: false,
          }
        )
      );
      setTcodes(refreshed.tcodes ?? []);

      window.alert("Relasi TCode berhasil disimpan.");
    } catch (error) {
      console.error(error);
      window.alert(
        error instanceof Error ? error.message : "Gagal menyimpan relasi TCode"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Data BPR</h1>
            <p className="mt-1 text-sm text-gray-500">
              Kelola profile BPR dan relasi transaksi code yang aktif untuk
              masing-masing BPR.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <div className="relative min-w-[260px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Masukkan BPR ID"
                className="pl-9"
              />
            </div>

            <Button onClick={handleSearch}>Cari BPR</Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          Memuat data BPR...
        </div>
      ) : (
        <>
          <BprForm
            value={profile}
            onChange={handleProfileChange}
            logoFile={logoFile}
            onLogoFileChange={setLogoFile}
          />

          <div className="flex justify-end">
            <PermissionButton permission={PERMISSIONS.DATA_BPR_SAVE} onClick={handleSaveProfile}>
              <Save className="mr-1 size-4" />
              Simpan Profile BPR
            </PermissionButton>
          </div>

          <BprTcodeMapping
            data={tcodes}
            onToggle={handleToggleTcode}
            onSave={handleSaveTcode}
            canRelasi={canRelasi}
          />
        </>
      )}
    </div>
  );
}