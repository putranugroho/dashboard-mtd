"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

/* ================= MODULE ERP ================= */
const modules = [
    "Dashboard",
    "Administration",
    "Setup",
    "Keuangan",
    "Pengadaan",
    "Kebun",
    "Pabrik",
    "Traksi",
    "SDM",
    "Anggaran",
    "Umum",
    "Kontrak",
    "Legal",
    "GIS",
    "Report",
    "My Account",
    "IT Support",
];

/* ================= DUMMY ROLE ================= */
const rolesDummy = [
    {
        id: 1,
        name: "Admin",
        status: "Active",
        permissions: {
            Dashboard: ["view"],
            Keuangan: ["view", "create", "edit", "delete"],
        },
    },
    {
        id: 2,
        name: "Manager",
        status: "Active",
        permissions: {
            Dashboard: ["view"],
            Report: ["view"],
        },
    },
];

export default function RolePermissionsPage() {
    const [open, setOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [permissions, setPermissions] = useState<any>({});

    const togglePermission = (module: string, perm: string) => {
        setPermissions((prev: any) => {
            const current = prev[module] || [];

            if (current.includes(perm)) {
                return {
                    ...prev,
                    [module]: current.filter((p: string) => p !== perm),
                };
            }

            return {
                ...prev,
                [module]: [...current, perm],
            };
        });
    };

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}


            {/* DRAWER */}
            <Sheet open={open} onOpenChange={setOpen}>
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Role Permissions</h1>
                    <SheetTrigger asChild>
                        <Button className="bg-black text-white px-4 py-2 rounded-lg">
                            + Tambah Role
                        </Button>
                    </SheetTrigger>

                </div>

                {/* TABLE */}
                <div className="bg-white border rounded-xl overflow-hidden">
                    <Table className="w-full text-sm">
                        <TableHeader className="border-b bg-gray-50">
                            <TableRow>
                                <TableHead>Role</TableHead>
                                <TableHead>Total Modul</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {rolesDummy.map((role) => (
                                <TableRow
                                    key={role.id}
                                    className="hover:bg-gray-50 transition cursor-pointer"
                                    onClick={() => {
                                        setSelectedRole(role);
                                        setPermissions(role.permissions);
                                        setOpen(true);
                                    }}
                                >
                                    <TableCell className="font-medium">
                                        {role.name}
                                    </TableCell>

                                    <TableCell>
                                        {Object.keys(role.permissions).length}
                                    </TableCell>

                                    <TableCell>
                                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                                            {role.status}
                                        </span>
                                    </TableCell>

                                    <TableCell
                                        className="text-right text-blue-600"
                                        onClick={(e) => {
                                            e.stopPropagation(); // biar ga trigger row click
                                            setSelectedRole(role);
                                            setPermissions(role.permissions);
                                            setOpen(true);
                                        }}
                                    >
                                        Detail
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* PAGINATION */}
                    <div className="flex justify-between items-center p-4 text-sm">
                        <span>
                            Showing 1 - {rolesDummy.length} of {rolesDummy.length}
                        </span>

                        <div className="flex items-center gap-2">
                            <select className="border px-2 py-1 rounded">
                                <option>5</option>
                            </select>
                            <button className="border px-3 py-1 rounded">Prev</button>
                            <span>1 / 1</span>
                            <button className="border px-3 py-1 rounded">Next</button>
                        </div>
                    </div>
                </div>
                <SheetContent
                    side="right"
                    className="
                        w-full sm:w-[520px]
                        mr-3 sm:mr-6
                        rounded-2xl
                        shadow-2xl
                        border
                        overflow-y-auto
                        bg-white
                        p-6
                    "
                >
                    <SheetHeader>
                        <SheetTitle>
                            {selectedRole ? "Detail Role" : "Tambah Role"}
                        </SheetTitle>
                    </SheetHeader>

                    <div className="mt-6 space-y-4">

                        <input
                            defaultValue={selectedRole?.name}
                            placeholder="Nama Role"
                            className="w-full border p-2 rounded"
                        />

                        <select
                            defaultValue={selectedRole?.status || "Active"}
                            className="w-full border p-2 rounded"
                        >
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>

                        {/* PERMISSION */}
                        <div>
                            <h4 className="font-semibold mb-2">
                                Hak Akses Modul
                            </h4>

                            <div className="space-y-3 max-h-[400px] overflow-auto pr-2">

                                {modules.map((mod) => (
                                    <div key={mod} className="border rounded-lg p-3">
                                        <div className="font-medium mb-2">{mod}</div>

                                        <div className="flex gap-4 text-sm flex-wrap">
                                            {["view", "create", "edit", "delete"].map((p) => (
                                                <label key={p} className="flex items-center gap-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={permissions[mod]?.includes(p) || false}
                                                        onChange={() => togglePermission(mod, p)}
                                                    />
                                                    {p}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>

                        <button className="w-full bg-green-600 text-white py-2 rounded-lg">
                            Save Role
                        </button>

                    </div>
                </SheetContent>
            </Sheet>

        </div>
    );
}