"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MasterMenuFormValues, MasterMenuItem } from "./types";

type Props = {
  initialData?: MasterMenuItem | null;
  allData: MasterMenuItem[];
  submitting?: boolean;
  onSubmit: (values: MasterMenuFormValues) => Promise<void> | void;
  onCancel: () => void;
};

const DEFAULT_USERLOGIN = process.env.NEXT_PUBLIC_DEFAULT_USERLOGIN || "admin";

type SelectMode = "existing" | "new";

const emptyForm: MasterMenuFormValues = {
  modul: "CMS",
  menu: "",
  submenu: "",
  subsubmenu: "",

  urut: 1,
  modul_urut: 1,
  menu_urut: 1,
  submenu_urut: 1,
  subsubmenu_urut: 1,

  is_active: true,
  userlogin: DEFAULT_USERLOGIN,
};

function upper(value: string) {
  return String(value || "").trim().toUpperCase();
}

function uniqueBy<T>(items: T[], keyFn: (item: T) => string): T[] {
  const map = new Map<string, T>();

  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, item);
  }

  return Array.from(map.values());
}

function nextNumber(values: number[]) {
  const valid = values.filter((v) => Number(v) > 0);
  if (valid.length === 0) return 1;
  return Math.max(...valid) + 1;
}

function resetFromMenu() {
  return {
    menu: "",
    menu_urut: 1,
    submenu: "",
    submenu_urut: 1,
    subsubmenu: "",
    subsubmenu_urut: 1,
    urut: 1,
  };
}

function resetFromSubmenu() {
  return {
    submenu: "",
    submenu_urut: 1,
    subsubmenu: "",
    subsubmenu_urut: 1,
    urut: 1,
  };
}

function resetFromSubsubmenu() {
  return {
    subsubmenu: "",
    subsubmenu_urut: 1,
    urut: 1,
  };
}

export default function MasterMenuForm({
  initialData,
  allData,
  submitting = false,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState<MasterMenuFormValues>(emptyForm);

  const [moduleMode, setModuleMode] = useState<SelectMode>("existing");
  const [menuMode, setMenuMode] = useState<SelectMode>("existing");
  const [submenuMode, setSubmenuMode] = useState<SelectMode>("existing");

  const modules = useMemo(() => {
    return uniqueBy(
      allData
        .filter((item) => item.modul)
        .sort((a, b) => Number(a.modul_urut || 0) - Number(b.modul_urut || 0)),
      (item) => item.modul
    ).map((item) => ({
      modul: item.modul,
      modul_urut: Number(item.modul_urut || 1),
    }));
  }, [allData]);

  const selectedModule = upper(form.modul);

  const menus = useMemo(() => {
    return uniqueBy(
      allData
        .filter((item) => upper(item.modul) === selectedModule)
        .filter((item) => item.menu)
        .sort((a, b) => Number(a.menu_urut || 0) - Number(b.menu_urut || 0)),
      (item) => item.menu
    ).map((item) => ({
      menu: item.menu,
      menu_urut: Number(item.menu_urut || 1),
    }));
  }, [allData, selectedModule]);

  const selectedMenu = upper(form.menu);

  const submenus = useMemo(() => {
    return uniqueBy(
      allData
        .filter((item) => upper(item.modul) === selectedModule)
        .filter((item) => upper(item.menu) === selectedMenu)
        .filter((item) => item.submenu)
        .sort(
          (a, b) => Number(a.submenu_urut || 0) - Number(b.submenu_urut || 0)
        ),
      (item) => item.submenu
    ).map((item) => ({
      submenu: item.submenu,
      submenu_urut: Number(item.submenu_urut || 1),
    }));
  }, [allData, selectedModule, selectedMenu]);

  const selectedSubmenu = upper(form.submenu);
  const hasModule = Boolean(selectedModule);
  const hasMenu = Boolean(selectedMenu);
  const hasSubmenu = Boolean(selectedSubmenu);

  const nextModuleUrut = useMemo(
    () => nextNumber(modules.map((item) => item.modul_urut)),
    [modules]
  );

  const nextMenuUrut = useMemo(
    () => nextNumber(menus.map((item) => item.menu_urut)),
    [menus]
  );

  const nextSubmenuUrut = useMemo(
    () => nextNumber(submenus.map((item) => item.submenu_urut)),
    [submenus]
  );

  const nextSubsubmenuUrut = useMemo(() => {
    const values = allData
      .filter((item) => upper(item.modul) === selectedModule)
      .filter((item) => upper(item.menu) === selectedMenu)
      .filter((item) => upper(item.submenu) === selectedSubmenu)
      .map((item) => Number(item.subsubmenu_urut || 0));

    return nextNumber(values);
  }, [allData, selectedModule, selectedMenu, selectedSubmenu]);

  useEffect(() => {
    if (initialData) {
      setForm({
        modul: initialData.modul || "CMS",
        menu: initialData.menu || "",
        submenu: initialData.submenu || "",
        subsubmenu: initialData.subsubmenu || "",

        urut: Number(initialData.urut || initialData.subsubmenu_urut || 1),
        modul_urut: Number(initialData.modul_urut || 1),
        menu_urut: Number(initialData.menu_urut || 1),
        submenu_urut: Number(initialData.submenu_urut || 1),
        subsubmenu_urut: Number(initialData.subsubmenu_urut || 1),

        is_active: Boolean(initialData.is_active),
        userlogin: DEFAULT_USERLOGIN,
      });

      setModuleMode("existing");
      setMenuMode("existing");
      setSubmenuMode("existing");
      return;
    }

    const firstModule = modules[0];

    setForm({
      ...emptyForm,
      modul: firstModule?.modul || "CMS",
      modul_urut: firstModule?.modul_urut || 1,
    });

    setModuleMode(firstModule ? "existing" : "new");
    setMenuMode("new");
    setSubmenuMode("new");
  }, [initialData, modules]);

  useEffect(() => {
    if (!hasModule) {
      setMenuMode("new");
      setSubmenuMode("new");

      setForm((prev) => ({
        ...prev,
        ...resetFromMenu(),
      }));

      return;
    }

    if (!hasMenu) {
      setSubmenuMode("new");

      setForm((prev) => ({
        ...prev,
        ...resetFromSubmenu(),
      }));

      return;
    }

    if (!hasSubmenu) {
      setForm((prev) => ({
        ...prev,
        ...resetFromSubsubmenu(),
      }));
    }
  }, [hasModule, hasMenu, hasSubmenu]);

  const applyExistingModule = (modul: string) => {
    const selected = modules.find((item) => item.modul === modul);

    setForm((prev) => ({
      ...prev,
      modul,
      modul_urut: selected?.modul_urut || 1,
      ...resetFromMenu(),
    }));

    setMenuMode("existing");
    setSubmenuMode("new");
  };

  const applyExistingMenu = (menu: string) => {
    const selected = menus.find((item) => item.menu === menu);

    setForm((prev) => ({
      ...prev,
      menu,
      menu_urut: selected?.menu_urut || 1,
      ...resetFromSubmenu(),
    }));

    setSubmenuMode("existing");
  };

  const applyExistingSubmenu = (submenu: string) => {
    const selected = submenus.find((item) => item.submenu === submenu);

    setForm((prev) => ({
      ...prev,
      submenu,
      submenu_urut: selected?.submenu_urut || 1,
      ...resetFromSubsubmenu(),
    }));
  };

  const handleSubmit = async () => {
    const modul = upper(form.modul);
    const menu = upper(form.menu);
    const submenu = upper(form.submenu);
    const subsubmenu = upper(form.subsubmenu);

    if (!modul) {
      window.alert("Module wajib diisi.");
      return;
    }

    if (!menu) {
      window.alert("Menu wajib diisi.");
      return;
    }

    if (!submenu) {
      window.alert("Submenu wajib diisi minimal.");
      return;
    }

    const finalSubsubmenuUrut = subsubmenu
      ? Number(form.subsubmenu_urut || nextSubsubmenuUrut)
      : 1;

    await onSubmit({
      ...form,
      modul,
      menu,
      submenu,
      subsubmenu,

      modul_urut: Number(form.modul_urut || 1),
      menu_urut: Number(form.menu_urut || 1),
      submenu_urut: Number(form.submenu_urut || 1),
      subsubmenu_urut: finalSubsubmenuUrut,

      urut: finalSubsubmenuUrut,
      userlogin: DEFAULT_USERLOGIN,
    });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-gray-50 p-4">
        <p className="text-base font-semibold text-gray-900">
          {initialData ? "Edit Master Menu" : "Tambah Master Menu"}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Struktur menu dibuat bertingkat: Module → Menu → Submenu →
          Subsubmenu. Minimal data yang wajib dikirim adalah Module, Menu, dan
          Submenu.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Level 1</p>
            <p className="text-xs text-gray-500">Module</p>
          </div>

          {!initialData ? (
            <div className="flex rounded-lg border bg-gray-50 p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setModuleMode("existing");

                  const first = modules[0];
                  setForm((prev) => ({
                    ...prev,
                    modul: first?.modul || "",
                    modul_urut: first?.modul_urut || 1,
                    ...resetFromMenu(),
                  }));

                  setMenuMode("existing");
                  setSubmenuMode("new");
                }}
                className={`rounded-md px-3 py-1 ${
                  moduleMode === "existing" ? "bg-white shadow-sm" : ""
                }`}
              >
                Existing
              </button>
              <button
                type="button"
                onClick={() => {
                  setModuleMode("new");
                  setMenuMode("new");
                  setSubmenuMode("new");

                  setForm((prev) => ({
                    ...prev,
                    modul: "",
                    modul_urut: nextModuleUrut,
                    ...resetFromMenu(),
                  }));
                }}
                className={`rounded-md px-3 py-1 ${
                  moduleMode === "new" ? "bg-white shadow-sm" : ""
                }`}
              >
                Baru
              </button>
            </div>
          ) : null}
        </div>

        {moduleMode === "existing" && !initialData ? (
          <select
            value={form.modul}
            onChange={(e) => applyExistingModule(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Pilih Module</option>
            {modules.map((item) => (
              <option key={item.modul} value={item.modul}>
                #{item.modul_urut} - {item.modul}
              </option>
            ))}
          </select>
        ) : (
          <div className="grid gap-3 md:grid-cols-[1fr_120px]">
            <Input
              value={form.modul}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, modul: e.target.value }))
              }
              placeholder="Contoh: CMS"
              disabled={Boolean(initialData)}
            />
            <Input
              type="number"
              min={1}
              value={form.modul_urut}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  modul_urut: Number(e.target.value || 1),
                }))
              }
              placeholder="Urut"
            />
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Level 2</p>
            <p className="text-xs text-gray-500">Menu</p>
          </div>

          {!initialData ? (
            <div className="flex rounded-lg border bg-gray-50 p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMenuMode("existing");

                  const first = menus[0];
                  setForm((prev) => ({
                    ...prev,
                    menu: first?.menu || "",
                    menu_urut: first?.menu_urut || 1,
                    ...resetFromSubmenu(),
                  }));

                  setSubmenuMode("existing");
                }}
                disabled={!hasModule}
                className={`rounded-md px-3 py-1 disabled:opacity-40 ${
                  menuMode === "existing" ? "bg-white shadow-sm" : ""
                }`}
              >
                Existing
              </button>
              <button
                type="button"
                disabled={!hasModule}
                onClick={() => {
                  setMenuMode("new");
                  setSubmenuMode("new");

                  setForm((prev) => ({
                    ...prev,
                    menu: "",
                    menu_urut: nextMenuUrut,
                    ...resetFromSubmenu(),
                  }));
                }}
                className={`rounded-md px-3 py-1 ${
                  menuMode === "new" ? "bg-white shadow-sm" : ""
                }`}
              >
                Baru
              </button>
            </div>
          ) : null}
        </div>

        {menuMode === "existing" && !initialData ? (
          <select
            value={form.menu}
            onChange={(e) => applyExistingMenu(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            disabled={!hasModule}
          >
            <option value="">Pilih Menu</option>
            {menus.map((item) => (
              <option key={item.menu} value={item.menu}>
                #{item.menu_urut} - {item.menu}
              </option>
            ))}
          </select>
        ) : (
          <div className="grid gap-3 md:grid-cols-[1fr_120px]">
            <Input
              disabled={!hasModule}
              value={form.menu}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, menu: e.target.value }))
              }
              placeholder="Contoh: SETUP"
            />
            <Input
              type="number"
              disabled={!hasModule}
              min={1}
              value={form.menu_urut}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  menu_urut: Number(e.target.value || 1),
                }))
              }
              placeholder="Urut"
            />
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Level 3</p>
            <p className="text-xs text-gray-500">
              Submenu wajib diisi minimal.
            </p>
          </div>

          {!initialData ? (
            <div className="flex rounded-lg border bg-gray-50 p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSubmenuMode("existing");

                  const first = submenus[0];
                  setForm((prev) => ({
                    ...prev,
                    submenu: first?.submenu || "",
                    submenu_urut: first?.submenu_urut || 1,
                    ...resetFromSubsubmenu(),
                  }));
                }}
                disabled={!hasMenu || !submenus.length}
                className={`rounded-md px-3 py-1 disabled:opacity-40 ${
                  submenuMode === "existing" ? "bg-white shadow-sm" : ""
                }`}
              >
                Existing
              </button>

              <button
                type="button"
                disabled={!hasMenu}
                onClick={() => {
                  setSubmenuMode("new");

                  setForm((prev) => ({
                    ...prev,
                    submenu: "",
                    submenu_urut: nextSubmenuUrut,
                    ...resetFromSubsubmenu(),
                  }));
                }}
                className={`rounded-md px-3 py-1 ${
                  submenuMode === "new" ? "bg-white shadow-sm" : ""
                }`}
              >
                Baru
              </button>
            </div>
          ) : null}
        </div>

        {submenuMode === "existing" && !initialData ? (
          <select
            value={form.submenu}
            onChange={(e) => applyExistingSubmenu(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            disabled={!hasMenu}
          >
            <option value="">Pilih Submenu</option>

            {submenus.map((item) => (
              <option key={item.submenu} value={item.submenu}>
                #{item.submenu_urut} - {item.submenu}
              </option>
            ))}
          </select>
        ) : (
          <div className="grid gap-3 md:grid-cols-[1fr_120px]">
            <Input
              value={form.submenu}
              disabled={!hasMenu}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  submenu: e.target.value,
                  submenu_urut:
                    prev.submenu_urut || nextSubmenuUrut,
                }))
              }
              placeholder="Contoh: USER ACCESS"
            />

            <Input
              type="number"
              disabled={!hasMenu}
              min={1}
              value={form.submenu_urut || nextSubmenuUrut}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  submenu_urut: Number(e.target.value || 1),
                }))
              }
              placeholder="Urut"
            />
          </div>
        )}

        {submenus.length > 0 && submenuMode === "new" ? (
          <div className="mt-3 text-xs text-gray-500">
            Existing submenu pada menu ini:{" "}
            {submenus.map((item) => item.submenu).join(", ")}
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-900">Level 4</p>
          <p className="text-xs text-gray-500">Subsubmenu optional.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_120px]">
          <Input
            value={form.subsubmenu}
            disabled={!hasSubmenu}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                subsubmenu: e.target.value,
                subsubmenu_urut: prev.subsubmenu_urut || nextSubsubmenuUrut,
              }))
            }
            placeholder="Contoh: TAMBAH / UBAH / HAPUS"
          />
          <Input
            type="number"
            min={1}
            value={form.subsubmenu_urut || nextSubsubmenuUrut}
            disabled={!hasSubmenu}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                subsubmenu_urut: Number(e.target.value || 1),
              }))
            }
            placeholder="Urut"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border bg-gray-50 p-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Status Menu</p>
          <p className="text-xs text-gray-500">
            Menu nonaktif tidak akan muncul pada CMS.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setForm((prev) => ({ ...prev, is_active: !prev.is_active }))
          }
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            form.is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {form.is_active ? "Aktif" : "Nonaktif"}
        </button>
      </div>

      <div className="flex justify-end gap-3 border-t pt-5">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? "Menyimpan..."
            : initialData
              ? "Simpan Perubahan"
              : "Tambah Menu"}
        </Button>
      </div>
    </div>
  );
}