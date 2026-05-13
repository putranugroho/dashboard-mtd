"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Settings,
  ChevronRight,
  ChevronDown,
  LifeBuoy,
} from "lucide-react";
import clsx from "clsx";

import { useSession } from "@/lib/auth/use-session";
import { PERMISSIONS } from "@/lib/auth/permissions";

type SidebarItem = {
  title: string;
  href?: string;
  icon?: any;
  permission?: string;
  children?: SidebarItem[];
};

const menu: SidebarItem[] = [
  {
    title: "Setup",
    icon: Settings,
    children: [
      {
        title: "Setup",
        children: [
          { title: "Setup TCode", href: "/setup/setup-tcode", permission: PERMISSIONS.SETUP_TCODE_VIEW },
          { title: "Setup Jurnal", href: "/setup/setup-jurnal", permission: PERMISSIONS.SETUP_JURNAL_VIEW },
          { title: "Data BPR", href: "/setup/data-bpr", permission: PERMISSIONS.DATA_BPR_VIEW },
          { title: "Setup Merchant", href: "/setup/setup-merchant", permission: PERMISSIONS.SETUP_MERCHANT_VIEW },
          { title: "Setup Journal Accounting", href: "/setup/setup-journal-accounting", permission: PERMISSIONS.SETUP_JOURNAL_ACCOUNTING_VIEW },
          { title: "Setup Relasi Rekonsiliasi", href: "/setup/setup-relasi-rekonsiliasi", permission: PERMISSIONS.SETUP_RELASI_REKONSILIASI_VIEW },
          { title: "Setup User", href: "/setup/setup-user", permission: PERMISSIONS.SETUP_USER_VIEW },
          { title: "Setup Banner", href: "/setup/setup-banner", permission: PERMISSIONS.SETUP_BANNER_VIEW },
          { title: "Setup Master Menu", href: "/setup/setup-master-menu", permission: PERMISSIONS.SETUP_MASTER_MENU_VIEW },
          { title: "Setup Fee", href: "/setup/setup-fee", permission: PERMISSIONS.SETUP_FEE_VIEW },
        ],
      },
      {
        title: "Monitoring",
        children: [
          { title: "Saldo Rekening MTD", href: "/monitoring/saldo-rekening-mtd", permission: PERMISSIONS.SALDO_REKENING_MTD_VIEW },
          { title: "Rekonsiliasi Saldo BPR", href: "/monitoring/rekonsiliasi-saldo-bpr", permission: PERMISSIONS.REKONSILIASI_SALDO_BPR_VIEW },
          { title: "Rekonsiliasi Saldo MTN", href: "/", permission: PERMISSIONS.REKONSILIASI_SALDO_MTN_VIEW },
          { title: "Monitoring Gateway BPR", href: "/monitoring/monitoring-gateway-bpr", permission: PERMISSIONS.MONITORING_GATEWAY_BPR_VIEW },
          { title: "Monitoring User Account", href: "/monitoring/monitoring-user-account", permission: PERMISSIONS.MONITORING_USER_ACCOUNT_VIEW },
          { title: "Monitoring Akun IBPR", href: "/monitoring/monitoring-akun-ibpr", permission: PERMISSIONS.MONITORING_AKUN_IBPR_VIEW },
        ],
      },
    ],
  },
];

function filterMenu(items: SidebarItem[], can: (permission?: string) => boolean): SidebarItem[] {
  return items
    .map((item) => {
      const children = item.children ? filterMenu(item.children, can) : undefined;
      return { ...item, children };
    })
    .filter((item) => {
      const allowed = can(item.permission);
      const hasChildren = Boolean(item.children?.length);
      return allowed && (item.href || hasChildren);
    });
}

function SubMenu({ item }: { item: SidebarItem }) {
  const pathname = usePathname();

  if (!item.href) return null;

  return (
    <Link
      href={item.href}
      className={clsx(
        "flex items-center justify-between pl-10 pr-3 py-2 text-sm rounded-md",
        pathname === item.href
          ? "text-green-600 font-medium"
          : "text-gray-500 hover:text-black"
      )}
    >
      {item.title}
      <ChevronRight size={14} />
    </Link>
  );
}

function ChildMenu({ item }: { item: SidebarItem }) {
  const pathname = usePathname();
  const hasActiveChild = item.children?.some((child) => child.href === pathname);
  const [open, setOpen] = useState(Boolean(hasActiveChild));

  if (!item.children?.length) return null;

  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between pl-6 pr-3 py-2 cursor-pointer text-gray-700 hover:bg-gray-100 rounded-md"
      >
        <span>{item.title}</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </div>

      {open && (
        <div>
          {item.children.map((sub) => (
            <SubMenu key={`${item.title}-${sub.title}`} item={sub} />
          ))}
        </div>
      )}
    </div>
  );
}

function MainMenu({ item }: { item: SidebarItem }) {
  const pathname = usePathname();
  const Icon = item.icon ?? Settings;
  const active = pathname === item.href;

  return (
    <div className="mb-1">
      {item.href ? (
        <Link
          href={item.href}
          className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-md relative",
            active
              ? "text-green-600 font-semibold bg-green-50"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          {active && <div className="absolute left-0 top-0 h-full w-1 bg-green-600 rounded-r-full" />}
          <Icon size={18} />
          {item.title}
        </Link>
      ) : (
        <div className="flex items-center gap-3 px-3 py-2 font-semibold text-black">
          <Icon size={18} />
          {item.title}
        </div>
      )}

      {item.children?.length ? (
        <div className="mt-1 space-y-1">
          {item.children.map((child) => (
            <ChildMenu key={`${item.title}-${child.title}`} item={child} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function Sidebar() {
  const { can, user } = useSession();
  const filteredMenu = useMemo(() => filterMenu(menu, can), [can]);
  const displayName = user?.full_name || user?.username || "User";
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col">
      <div className="flex flex-col h-full">
        <div>
          <div className="flex justify-center items-center px-4 py-4">
            <Image
              src="/logo-susan.png"
              alt="SUSAN"
              width={160}
              height={40}
              className="object-contain"
            />
          </div>

          <div className="mx-4 mb-4 p-3 bg-gray-50 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-semibold">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm text-gray-800 font-semibold">Hi, {displayName}</p>
              <p className="truncate text-xs text-gray-500">{user?.role_name || "Dashboard User"}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          <p className="text-xs text-gray-400 px-3 mb-2">Main Menu</p>

          {filteredMenu.length ? (
            filteredMenu.map((item) => <MainMenu key={item.title} item={item} />)
          ) : (
            <div className="mx-3 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-700">
              User belum memiliki akses menu.
            </div>
          )}
        </div>

        <div className="p-4 border-t flex items-center gap-2 text-sm text-gray-500">
          <LifeBuoy size={16} />
          IT Support
        </div>
      </div>
    </aside>
  );
}
