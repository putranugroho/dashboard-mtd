"use client";

import { Loader2, Search, Save } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import PermissionButton from "@/components/auth/PermissionButton";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { useSession } from "@/lib/auth/use-session";
import { Input } from "@/components/ui/input";

import BprForm from "./BprForm";
import BprTcodeMapping from "./BprTcodeMapping";
import {
  BprProfile,
  BprTcodeItem,
  SandiBankSearchItem,
} from "./types";
import {
  createEmptyBprProfile,
  normalizeBprProfile,
} from "./bpr-profile-factory";
import {
  getBprDetailWithTcodes,
  saveBprProfile,
  saveBprTcodes,
  searchSandiBank,
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
  const [searchResults, setSearchResults] = useState<SandiBankSearchItem[]>([]);
  const [searchingBank, setSearchingBank] = useState(false);
  const [selectedBank, setSelectedBank] = useState<SandiBankSearchItem | null>(null);
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

  const handleSearchBank = async () => {
    const term = searchCode.trim();

    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchingBank(true);
      const result = await searchSandiBank(term);
      setSearchResults(result);
    } catch (error) {
      console.error(error);
      setSearchResults([]);
      window.alert(
        error instanceof Error ? error.message : "Gagal mencari sandi bank"
      );
    } finally {
      setSearchingBank(false);
    }
  };

  useEffect(() => {
    const term = searchCode.trim();

    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = window.setTimeout(() => {
      handleSearchBank();
    }, 400);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchCode]);

  const handleSelectBank = async (item: SandiBankSearchItem) => {
    try {
      setLoading(true);
      setSelectedBank(item);
      setSearchCode(`${item.kode_bank} - ${item.nama}`);
      setSearchResults([]);

      const result = await getBprDetailWithTcodes(item.kode_bank);
      const nextProfile = result.profile ?? createEmptyBprProfile(item.kode_bank);
      const isExisting = nextProfile.is_existing_profile === true;

      setSelectedCode(item.kode_bank);
      setProfile(
        normalizeBprProfile(
          {
            ...nextProfile,
            bpr_id: item.kode_bank,
            nama_bpr: nextProfile.nama_bpr || item.nama,
          },
          item.kode_bank,
          {
            defaultExisting: isExisting,
            defaultProvisioning: !isExisting,
          }
        )
      );

      setLogoFile(null);
      setTcodes(result.tcodes ?? []);
    } catch (error) {
      console.error(error);

      const isExisting = item.is_existing_profile === true;

      setSelectedCode(item.kode_bank);
      setProfile(
        normalizeBprProfile(
          {
            bpr_id: item.kode_bank,
            nama_bpr: item.nama,
            is_existing_profile: isExisting,
          },
          item.kode_bank,
          {
            defaultExisting: isExisting,
            defaultProvisioning: !isExisting,
          }
        )
      );
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

          <div className="relative w-full lg:w-[460px]">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={searchCode}
                  onChange={(e) => {
                    setSearchCode(e.target.value);
                    setSelectedBank(null);
                  }}
                  placeholder="Cari kode / nama bank"
                  className="pl-9"
                />
              </div>

              <Button type="button" onClick={handleSearchBank} disabled={searchingBank}>
                {searchingBank ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Search className="mr-2 size-4" />
                )}
                Cari
              </Button>
            </div>

            {searchResults.length > 0 ? (
              <div className="absolute right-0 z-30 mt-2 max-h-[360px] w-full overflow-auto rounded-xl border bg-white p-2 shadow-lg">
                {searchResults.map((item) => (
                  <button
                    key={`${item.kode_bank}-${item.id}`}
                    type="button"
                    onClick={() => handleSelectBank(item)}
                    className="flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-50"
                  >
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {item.kode_bank} - {item.nama}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {item.jenis || "-"} {item.tipe ? `• ${item.tipe}` : ""}
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
                        item.is_existing_profile
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.is_existing_profile ? "Sudah Terdaftar" : "Belum Terdaftar"}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
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