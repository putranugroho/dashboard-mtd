"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const dummy = [
    { id: 1, nama: "Panen" },
    { id: 2, nama: "Pemupukan" },
];

export default function KelompokKegiatanPage() {
    const [open, setOpen] = useState(false);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold">Kelompok Kegiatan</h1>
                <Button onClick={() => setOpen(true)}>+ Tambah</Button>
            </div>

            <div className="border rounded-xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Kelompok</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dummy.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.nama}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex justify-between px-4 py-4 border-t">
                    <span className="text-sm">Showing 1 - {dummy.length}</span>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline">Prev</Button>
                        <Button size="sm" variant="outline">Next</Button>
                    </div>
                </div>
            </div>

            {/* SHEET */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="right" className="w-[400px] p-6">
                    <SheetHeader>
                        <SheetTitle>Tambah Kelompok</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-4 mt-4">
                        <div>
                            <Label>Nama Kelompok</Label>
                            <Input placeholder="Contoh: Panen" />
                        </div>

                        <Button className="w-full bg-green-600">Simpan</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}