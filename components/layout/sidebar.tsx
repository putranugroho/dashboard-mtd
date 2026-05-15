"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Settings, ChevronRight, ChevronDown, LifeBuoy } from "lucide-react";
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
    title: "DASHBOARD",
    icon: Settings,
    children: [
      {
        title: "SETUP",
        children: [
          { title: "Setup TCode", href: "/setup/setup-tcode", permission: PERMISSIONS.SETUP_TCODE_VIEW },
          { title: "Setup Jurnal", href: "/setup/setup-jurnal", permission: PERMISSIONS.SETUP_JURNAL_VIEW },
          { title: "Setup Merchant", href: "/setup/setup-merchant", permission: PERMISSIONS.SETUP_MERCHANT_VIEW },
          { title: "Setup Relasi Rekonsiliasi", href: "/setup/setup-relasi-rekonsiliasi", permission: PERMISSIONS.SETUP_RELASI_REKONSILIASI_VIEW },
          { title: "Setup Journal Accounting", href: "/setup/setup-journal-accounting", permission: PERMISSIONS.SETUP_JOURNAL_ACCOUNTING_VIEW },
          { title: "Setup Fee", href: "/setup/setup-fee", permission: PERMISSIONS.SETUP_FEE_VIEW },
          { title: "Setup Master Menu", href: "/setup/setup-master-menu", permission: PERMISSIONS.SETUP_MASTER_MENU_VIEW },
        ],
      },
      {
        title: "MASTER",
        children: [
          { title: "Data BPR", href: "/setup/data-bpr", permission: PERMISSIONS.DATA_BPR_VIEW },
          { title: "Setup User", href: "/setup/setup-user", permission: PERMISSIONS.SETUP_USER_VIEW },
          { title: "Setup Banner", href: "/setup/setup-banner", permission: PERMISSIONS.SETUP_BANNER_VIEW },
        ],
      },
      {
        title: "MONITORING",
        children: [
          { title: "Saldo Rekening MTD", href: "/monitoring/saldo-rekening-mtd", permission: PERMISSIONS.SALDO_REKENING_MTD_VIEW },
          { title: "Rekonsiliasi Saldo BPR", href: "/monitoring/rekonsiliasi-saldo-bpr", permission: PERMISSIONS.REKONSILIASI_SALDO_BPR_VIEW },
          { title: "Rekonsiliasi Saldo MTN", href: "/", permission: PERMISSIONS.REKONSILIASI_SALDO_MTN_VIEW },
          { title: "Gateway BPR", href: "/monitoring/monitoring-gateway-bpr", permission: PERMISSIONS.MONITORING_GATEWAY_BPR_VIEW },
        ],
      },
      {
        title: "LAPORAN",
        children: [
          { title: "User Akun IBPR", href: "/monitoring/monitoring-akun-ibpr", permission: PERMISSIONS.MONITORING_AKUN_IBPR_VIEW },
          { title: "User Akun Medfo", href: "/monitoring/monitoring-user-account", permission: PERMISSIONS.MONITORING_USER_ACCOUNT_VIEW },
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
        "flex items-center justify-between rounded-md py-1.5 pl-8 pr-2 text-[12px] leading-tight transition-colors lg:py-2 lg:pl-10 lg:pr-3 lg:text-sm",
        pathname === item.href
          ? "font-medium text-green-600"
          : "text-gray-500 hover:text-black"
      )}
      title={item.title}
    >
      <span className="min-w-0 truncate">{item.title}</span>
      <ChevronRight className="ml-2 shrink-0" size={14} />
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
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-md py-1.5 pl-5 pr-2 text-left text-[12px] text-gray-700 hover:bg-gray-100 lg:py-2 lg:pl-6 lg:pr-3 lg:text-sm"
      >
        <span className="min-w-0 truncate">{item.title}</span>
        {open ? (
          <ChevronDown className="ml-2 shrink-0" size={14} />
        ) : (
          <ChevronRight className="ml-2 shrink-0" size={14} />
        )}
      </button>

      {open ? (
        <div>
          {item.children.map((sub) => (
            <SubMenu key={`${item.title}-${sub.title}`} item={sub} />
          ))}
        </div>
      ) : null}
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
            "relative flex items-center gap-2 rounded-md px-3 py-2 text-sm",
            active
              ? "bg-green-50 font-semibold text-green-600"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          {active ? <div className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-green-600" /> : null}
          <Icon className="shrink-0" size={18} />
          <span className="min-w-0 truncate">{item.title}</span>
        </Link>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-black">
          <Icon className="shrink-0" size={18} />
          <span className="min-w-0 truncate">{item.title}</span>
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
    <aside className="hidden h-full w-[210px] shrink-0 flex-col overflow-hidden border-r bg-white md:flex lg:w-64">
      <div className="shrink-0">
        <div className="flex items-center justify-center px-3 pt-3 pb-1 lg:px-4 lg:pt-4 lg:pb-1">
          <div className="h-[60px] w-[150px] overflow-hidden">
            <Image
              src="/Logo-mtd.png"
              alt="MTD"
              width={260}
              height={260}
              priority
              className="-mt-[55px] h-auto w-[150px] max-w-none object-contain"
            />
          </div>
        </div>

        <div className="mx-3 mb-3 flex items-center gap-2 rounded-xl bg-gray-50 p-2 lg:mx-4 lg:mb-4 lg:gap-3 lg:p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-200 text-sm font-semibold text-green-700 lg:h-10 lg:w-10">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-gray-800 lg:text-sm">Hi, {displayName}</p>
            <p className="truncate text-[11px] text-gray-500 lg:text-xs">{user?.role_name || "Dashboard User"}</p>
          </div>
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        <p className="mb-2 px-3 text-[11px] text-gray-400 lg:text-xs">Main Menu</p>

        {filteredMenu.length ? (
          filteredMenu.map((item) => <MainMenu key={item.title} item={item} />)
        ) : (
          <div className="mx-3 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-700">
            User belum memiliki akses menu.
          </div>
        )}
      </nav>

      <div className="shrink-0 border-t p-3 text-xs text-gray-500 lg:p-4 lg:text-sm">
        <div className="flex items-center gap-2">
          <LifeBuoy className="shrink-0" size={16} />
          <span className="truncate">IT Support</span>
        </div>
      </div>
    </aside>
  );
}