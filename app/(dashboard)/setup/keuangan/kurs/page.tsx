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
import { Input } from "@/components/ui/input";

/* ================= DUMMY ================= */
const data = [
    {
        id: 1,
        from: "USD",
        to: "IDR",
        rate: 15000,
        date: "2025-04-10",
        status: "Active",
    },
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
                <h1 className="text-2xl font-semibold">Kurs</h1>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="bg-black text-white px-4 py-2 rounded-lg">
                            + Tambah Kurs
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side="right"
                        className="w-full sm:w-[520px] mr-3 sm:mr-6 rounded-2xl shadow-2xl border bg-white p-6"
                    >
                        <SheetHeader>
                            <SheetTitle>Tambah Kurs</SheetTitle>
                        </SheetHeader>

                        <div className="mt-6 space-y-3">
                            <Input placeholder="Dari Mata Uang (USD)" />
                            <Input placeholder="Ke Mata Uang (IDR)" />
                            <Input placeholder="Nilai Kurs" type="number" />
                            <Input type="date" />

                            <select className="w-full border rounded p-2">
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>

                            <Button className="w-full bg-green-600">
                                Save
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* TABLE */}
            <div className="bg-white border rounded-xl overflow-hidden">
                <Table className="w-full text-sm">
                    <TableHeader className="border-b">
                        <TableRow>
                            <TableHead>Dari</TableHead>
                            <TableHead>Ke</TableHead>
                            <TableHead>Kurs</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paginated.map((item) => (
                            <TableRow key={item.id} className="hover:bg-gray-50 cursor-pointer">
                                <TableCell>{item.from}</TableCell>
                                <TableCell>{item.to}</TableCell>
                                <TableCell>{item.rate}</TableCell>
                                <TableCell>{item.date}</TableCell>
                                <TableCell className="text-green-600">
                                    {item.status}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* PAGINATION */}
                <div className="border-t pt-4 flex justify-between items-center p-4 text-sm">
                    <span>
                        Showing {(page - 1) * limit + 1} -{" "}
                        {Math.min(page * limit, total)} of {total}
                    </span>

                    <div className="flex items-center gap-2">
                        <select
                            value={limit}
                            onChange={(e) => setLimit(Number(e.target.value))}
                            className="border px-2 py-1 rounded"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                        </select>

                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="border px-3 py-1 rounded"
                        >
                            Prev
                        </button>

                        <span>{page} / {totalPages}</span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="border px-3 py-1 rounded"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}