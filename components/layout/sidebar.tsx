"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Settings,
    Wallet,
    ShoppingCart,
    ChevronRight,
    ChevronDown,
    Leaf,
    Factory,
    Truck,
    Users,
    FileText,
    Gavel,
    Shield,
    Map,
    LifeBuoy,
    User,
    BarChart3,
    Megaphone,
} from "lucide-react";

import clsx from "clsx";

/* ================= MENU ERP ================= */
const menu = [

    {
        title: "Setup",
        icon: Settings,
        children: [
            {
                title: "Setup",
                children: [
                    { title: "Setup TCode", href: "/setup/setup-tcode" },
                    { title: "Setup Jurnal", href: "/setup/setup-jurnal" },
                    { title: "Data BPR", href: "/setup/data-bpr" },
                    { title: "Setup Merchant", href: "/setup/setup-merchant" },
                    { title: "Setup Journal Accounting", href: "/setup/setup-journal-accounting" },
                    { title: "Setup Relasi Rekonsiliasi", href: "/setup/setup-relasi-rekonsiliasi" },
                    { title: "Setup User", href: "/setup/setup-user" },
                    { title: "Setup Banner", href: "/setup/setup-banner" },
                    { title: "Setup Master Menu", href: "/setup/setup-master-menu" },
                    { title: "Setup Fee", href: "/setup/setup-fee" },
                ],
            },
            {
                title: "Monitoring",
                children: [
                    { title: "Saldo Rekening MTD", href: "/monitoring/saldo-rekening-mtd" },
                    { title: "Rekonsiliasi Saldo BPR", href: "/monitoring/rekonsiliasi-saldo-bpr" },
                    { title: "Rekonsiliasi Saldo MTN", href: "/" },
                    { title: "Monitoring Gateway BPR", href: "/monitoring/monitoring-gateway-bpr" },
                    { title: "Monitoring User Account", href: "/monitoring/monitoring-user-account" },
                    { title: "Monitoring Akun IBPR", href: "/monitoring/monitoring-akun-ibpr"},
                ],
            },
        ],
    },
];

/* ================= LEVEL 3 ================= */

function SubMenu({ item }: any) {
    const pathname = usePathname();

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

/* ================= LEVEL 2 ================= */

function ChildMenu({ item }: any) {
    const [open, setOpen] = useState(false);

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
                    {item.children?.map((sub: any, idx: number) => (
                        <SubMenu key={idx} item={sub} />
                    ))}
                </div>
            )}
        </div>
    );
}

/* ================= LEVEL 1 ================= */


function MainMenu({ item }: any) {
    const pathname = usePathname();
    const Icon = item.icon;

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
                    {/* ACTIVE BORDER */}
                    {active && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-green-600 rounded-r-full" />
                    )}

                    <Icon size={18} />
                    {item.title}
                </Link>
            ) : (
                <div className="flex items-center gap-3 px-3 py-2 font-semibold text-black">
                    <Icon size={18} />
                    {item.title}
                </div>
            )}

            {item.children && (
                <div className="mt-1 space-y-1">
                    {item.children.map((child: any, idx: number) => (
                        <ChildMenu key={idx} item={child} />
                    ))}
                </div>
            )}
        </div>
    );
}


// function MainMenu({ item }: any) {
//     const pathname = usePathname();
//     const Icon = item.icon;

//     return (
//         <div className="mb-2">
//             {/* MAIN */}
//             {item.href ? (
//                 <Link
//                     href={item.href}
//                     className={clsx(
//                         "flex items-center gap-2 px-3 py-2 rounded-lg font-semibold",
//                         pathname === item.href
//                             ? "bg-green-100 text-green-600"
//                             : "text-black hover:bg-gray-100"
//                     )}
//                 >
//                     <Icon size={16} />
//                     {item.title}
//                 </Link>
//             ) : (
//                 <div className="flex items-center gap-2 px-3 py-2 font-semibold text-black">
//                     <Icon size={16} />
//                     {item.title}
//                 </div>
//             )}

//             {/* CHILD */}
//             {item.children && (
//                 <div className="mt-1 space-y-1">
//                     {item.children.map((child: any, idx: number) => (
//                         <ChildMenu key={idx} item={child} />
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

/* ================= SIDEBAR ================= */

export default function Sidebar() {
    return (
        <aside className="w-64 h-screen bg-white border-r flex flex-col">

            {/* TOP */}
            <div className="flex flex-col h-full">

                {/* HEADER (FIXED) */}
                <div>
                    {/* LOGO */}
                    <div className="flex justify-center items-center px-4 py-4">
                        <Image
                            src="/logo-susan.png"
                            alt="SUSAN"
                            width={160}
                            height={40}
                            className="object-contain"
                        />
                    </div>

                    {/* USER */}
                    <div className="mx-4 mb-4 p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-semibold">
                            A
                        </div>
                        <div>
                            <p className="text-sm text-gray-800 font-semibold">Hi, Admin</p>
                            <p className="text-xs text-gray-500">ERP User</p>
                        </div>
                    </div>

                    {/* BUTTON */}
                    {/* <div className="px-4 mb-4">
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium">
                            + Request
                        </button>
                    </div> */}
                </div>

                {/* 🔥 SCROLL AREA */}
                <div className="flex-1 overflow-y-auto px-2">
                    <p className="text-xs text-gray-400 px-3 mb-2">Main Menu</p>

                    {menu.map((item, idx) => (
                        <MainMenu key={idx} item={item} />
                    ))}
                </div>

                {/* FOOTER (FIXED) */}
                <div className="p-4 border-t flex items-center gap-2 text-sm text-gray-500">
                    <LifeBuoy size={16} />
                    IT Support
                </div>

            </div>
        </aside>
    );
}