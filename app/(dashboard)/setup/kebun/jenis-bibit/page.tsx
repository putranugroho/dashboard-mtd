"use client";

import { useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ================= DUMMY ================= */
const data = [
    { id: 1, nama: "DxP Socfindo", varietas: "DxP", umur: 25, status: "Active" },
    { id: 2, nama: "Marihat", varietas: "Marihat", umur: 25, status: "Active" },
];

export default function Page() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const total = data.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = data.slice((page - 1) * limit, page * limit);

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Jenis Bibit</h1>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="bg-black text-white">
                            + Tambah Bibit
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side="right"
                        className="w-full sm:w-[520px] mr-3 sm:mr-6 rounded-2xl shadow-xl p-6"
                    >
                        <SheetHeader>
                            <SheetTitle>Tambah Jenis Bibit</SheetTitle>
                        </SheetHeader>

                        <div className="mt-6 space-y-3">
                            <Input placeholder="Nama Bibit" />
                            <Input placeholder="Varietas" />
                            <Input placeholder="Umur Produksi (Tahun)" type="number" />

                            <select className="w-full border rounded p-2">
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>

                            <Button className="w-full bg-green-600">
                                Simpan
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* TABLE */}
            <div className="bg-white border rounded-xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Bibit</TableHead>
                            <TableHead>Varietas</TableHead>
                            <TableHead>Umur (Thn)</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginated.map((item) => (
                            <TableRow key={item.id} className="hover:bg-gray-50 cursor-pointer">
                                <TableCell>{item.nama}</TableCell>
                                <TableCell>{item.varietas}</TableCell>
                                <TableCell>{item.umur}</TableCell>
                                <TableCell className="text-green-600">
                                    {item.status}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* PAGINATION */}
                <div className="border-t p-4 flex justify-between items-center text-sm">
                    <span>
                        Showing {(page - 1) * limit + 1} -{" "}
                        {Math.min(page * limit, total)} of {total}
                    </span>

                    <div className="flex gap-2">
                        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</button>
                        <span>{page} / {totalPages}</span>
                        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}