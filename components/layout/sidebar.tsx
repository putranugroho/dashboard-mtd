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
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },

    {
        title: "Administration",
        icon: Settings,
        children: [
            {
                title: "Basic Setup",
                children: [
                    { title: "Struktur Organisasi", href: "/administration/basic-setup/struktur-organisasi" },
                    { title: "User Setting", href: "/administration/basic-setup/user-setting" },
                    {
                        title: "Role Permissions",
                        href: "/administration/basic-setup/role-permissions",
                    },
                ],
            },
        ],
    },

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
                    { title: "Setup User", href: "/setup/setup-user" },
                ],
            },
            {
  title: "Monitoring",
  children: [
    { title: "Saldo Rekening MTD", href: "/monitoring/saldo-rekening-mtd" },
    { title: "Sign in - Sign off", href: "/monitoring/signin-signoff" },
    { title: "Echo", href: "/monitoring/echo" },
  ],
},
            {
                title: "Keuangan",
                children: [
                    { title: "Mata Uang", href: "/setup/keuangan/mata-uang" },
                    { title: "Kurs", href: "/setup/keuangan/kurs" },
                    
                ],
            },
            {
                title: "Kebun",
                children: [
                    {
                        title: "Estate",
                        href: "/setup/kebun/estate",
                    },
                    {
                        title: "Divisi",
                        href: "/setup/kebun/divisi",
                    },
                    { title: "Master Blok", href: "/setup/kebun/master-blok" },
                    { title: "Kelompok Kegiatan", href: "/setup/kebun/kelompok-kegiatan" },
                    { title: "Kegiatan", href: "/setup/kebun/kegiatan" },
                    { title: "Jenis Bibit", href: "/setup/kebun/jenis-bibit" },
                    { title: "Klasifikasi Lahan", href: "/setup/kebun/klasifikasi-lahan" },
                ],
            },
            {
                title: "Pengadaan",
                children: [
                    { title: "Satuan Barang", href: "/setup/pengadaan/satuan-barang" },
                    { title: "Modul Anggaran", href: "/setup/pengadaan/modul-anggaran" },
                    { title: "Validasi Anggaran", href: "/setup/pengadaan/validasi-anggaran" },
                ],
            },
            {
                title: "Approval",
                children: [
                    { title: "Jenis Persetujuan", href: "/setup/approval/jenis-persetujuan" },
                    { title: "Persetujuan", href: "/setup/approval/persetujuan" },
                ],
            },
            {
                title: "Lainnya",
                children: [
                    { title: "Parameter Aplikasi", href: "/setup/lainnya/parameter-aplikasi" },
                    { title: "Posting", href: "/setup/lainnya/posting" },
                    { title: "Pindah Lokasi Tugas", href: "/setup/lainnya/pindah-lokasi-tugas" },
                    { title: "IP Timbangan", href: "/setup/lainnya/ip-timbangan" },
                    { title: "Notifikasi", href: "/setup/lainnya/notifikasi" },
                    { title: "Laporan", href: "/setup/lainnya/laporan" },
                ],
            },
        ],
    },

    {
        title: "Keuangan",
        icon: Wallet,
        children: [
            {
                title: "Transaksi",
                children: [
                    { title: "Kas & Bank", href: "/keuangan/transaksi/kas-bank" },
                    { title: "Invoice", href: "/keuangan/transaksi/invoice" },
                    { title: "Jurnal", href: "/keuangan/transaksi/jurnal" },
                    { title: "Daftar Aset", href: "/keuangan/transaksi/daftar-aset" },
                    { title: "Cash Opname", href: "/keuangan/transaksi/cash-opname" },
                ],
            },
            {
                title: "Laporan",
                children: [
                    { title: "Jurnal", href: "/keuangan/laporan/jurnal" },
                    { title: "Neraca", href: "/keuangan/laporan/neraca" },
                    { title: "Laba Rugi", href: "/keuangan/laporan/laba-rugi" },
                    { title: "Hutang Piutang", href: "/keuangan/laporan/hutang-piutang" },
                ],
            },
            {
                title: "Proses",
                children: [
                    { title: "Proses Akhir Bulan", href: "/keuangan/proses/akhir-bulan" },
                    { title: "Tutup Buku Kas", href: "/keuangan/proses/tutup-buku-kas" },
                ],
            },
            {
                title: "Setup",
                children: [
                    { title: "Parameter Jurnal", href: "/keuangan/setup/parameter-jurnal" },
                    { title: "Kelompok Jurnal", href: "/keuangan/setup/kelompok-jurnal" },
                    { title: "COA", href: "/keuangan/setup/coa" },
                    { title: "Arus Kas", href: "/keuangan/setup/arus-kas" },
                    { title: "Faktur Pajak", href: "/keuangan/setup/faktur-pajak" },
                ],
            },
        ],
    },

    {
        title: "Pengadaan",
        icon: ShoppingCart,
        children: [
            {
                title: "Transaksi",
                children: [
                    { title: "PO / SO", href: "/pengadaan/transaksi/po-so" },
                    { title: "Admin Gudang", href: "/pengadaan/transaksi/admin-gudang" },
                ],
            },
            {
                title: "Laporan",
                children: [
                    { title: "Stock", href: "/pengadaan/laporan/stock" },
                    { title: "Purchasing", href: "/pengadaan/laporan/purchasing" },
                ],
            },
            {
                title: "Proses",
                children: [{ title: "Tutup Buku", href: "/pengadaan/proses/tutup-buku" }],
            },
            {
                title: "Setup",
                children: [
                    { title: "Barang", href: "/pengadaan/setup/barang" },
                    { title: "Supplier", href: "/pengadaan/setup/supplier" },
                ],
            },
        ],
    },

    {
        title: "Kebun",
        icon: Leaf,
        children: [
            {
                title: "Transaksi",
                children: [
                    { title: "BKM", href: "/kebun/transaksi/bkm" },
                    { title: "Produksi", href: "/kebun/transaksi/produksi" },
                ],
            },
            {
                title: "Laporan",
                children: [
                    { title: "BKM", href: "/kebun/laporan/bkm" },
                    { title: "Bibitan", href: "/kebun/laporan/bibitan" },
                    { title: "Angkutan TBS", href: "/kebun/laporan/angkutan-tbs" },
                ],
            },
            {
                title: "Proses",
                children: [
                    { title: "Tutup Aresta", href: "/kebun/proses/tutup-aresta" },
                    { title: "Ambil KG Timbangan", href: "/kebun/proses/timbangan" },
                ],
            },
            {
                title: "Setup",
                children: [
                    { title: "BKM Panen & Rawat", href: "/kebun/setup/bkm" },
                    { title: "Angkut TBS", href: "/kebun/setup/angkut-tbs" },
                ],
            },
        ],
    },

    {
        title: "Pabrik",
        icon: Factory,
        children: [
            {
                title: "Transaksi",
                children: [
                    { title: "Pemeliharaan", href: "/pabrik/transaksi/pemeliharaan" },
                    { title: "Produksi", href: "/pabrik/transaksi/produksi" },
                    { title: "Lab", href: "/pabrik/transaksi/lab" },
                ],
            },
            {
                title: "Laporan",
                children: [
                    { title: "Produksi", href: "/pabrik/laporan/produksi" },
                    { title: "Perawatan Mesin", href: "/pabrik/laporan/perawatan-mesin" },
                    { title: "Biaya Pabrik", href: "/pabrik/laporan/biaya-pabrik" },
                ],
            },
            {
                title: "Setup",
                children: [
                    { title: "Shift", href: "/pabrik/setup/shift" },
                    { title: "Tangki", href: "/pabrik/setup/tangki" },
                    { title: "Grading", href: "/pabrik/setup/grading" },
                ],
            },
        ],
    },

    {
        title: "Traksi",
        icon: Truck,
        children: [
            {
                title: "Transaksi",
                children: [
                    { title: "Rencana Kerja Harian", href: "/traksi/transaksi/rkh" },
                    { title: "Service", href: "/traksi/transaksi/service" },
                    { title: "BKM Sipil", href: "/traksi/transaksi/bkm-sipil" },
                ],
            },
            {
                title: "Laporan",
                children: [
                    { title: "Workshop", href: "/traksi/laporan/workshop" },
                    { title: "Project", href: "/traksi/laporan/project" },
                ],
            },
            {
                title: "Proses",
                children: [
                    { title: "Tutup Buku Kendaraan", href: "/traksi/proses/tutup-buku" },
                    { title: "Premi", href: "/traksi/proses/premi" },
                ],
            },
            {
                title: "Setup",
                children: [
                    { title: "Tipe Kendaraan", href: "/traksi/setup/tipe-kendaraan" },
                    { title: "Master Kendaraan", href: "/traksi/setup/master-kendaraan" },
                ],
            },
        ],
    },

    {
        title: "Pemasaran",
        icon: Megaphone,
        children: [
            {
                title: "Transaksi",
                children: [
                    { title: "Sales", href: "/pemasaran/transaksi/sales" },
                    { title: "Jual Beli TBS", href: "/pemasaran/transaksi/jual-beli" },
                    { title: "Jual TBS", href: "/pemasaran/transaksi/jual" },
                    { title: "Beli TBS", href: "/pemasaran/transaksi/beli" },
                ],
            },
            {
                title: "Laporan",
                children: [
                    { title: "Penjualan", href: "/pemasaran/laporan/penjualan" },
                    { title: "Harga", href: "/pemasaran/laporan/harga" },
                ],
            },
        ],
    },

    {
        title: "SDM",
        icon: Users,
        children: [
            {
                title: "Transaksi",
                children: [
                    { title: "Data Karyawan", href: "/sdm/transaksi/karyawan" },
                    { title: "Admin Personalia", href: "/sdm/transaksi/personalia" },
                ],
            },
            {
                title: "Laporan",
                children: [
                    { title: "Penggajian", href: "/sdm/laporan/gaji" },
                    { title: "Cuti / Izin", href: "/sdm/laporan/cuti" },
                ],
            },
        ],
    },

    {
        title: "Anggaran",
        icon: BarChart3,
        href: "/anggaran",
    },
    {
        title: "Umum",
        icon: FileText,
        href: "/umum",
    },
    {
        title: "Kontrak",
        icon: Gavel,
        href: "/kontrak",
    },
    {
        title: "Legal",
        icon: Shield,
        href: "/legal",
    },
    {
        title: "GIS",
        icon: Map,
        href: "/gis",
    },
    {
        title: "Management Report",
        icon: FileText,
        href: "/management-report",
    },
    {
        title: "My Account",
        icon: User,
        href: "/account",
    },
    {
        title: "IT Support",
        icon: LifeBuoy,
        href: "/support",
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
                    <div className="px-4 mb-4">
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium">
                            + Request
                        </button>
                    </div>
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