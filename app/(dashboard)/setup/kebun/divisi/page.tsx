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

const dummyDivisi = [
    { id: 1, estate: "Estate A", nama: "Divisi 1", status: "Active" },
    { id: 2, estate: "Estate A", nama: "Divisi 2", status: "Active" },
];

export default function DivisiPage() {
    const [open, setOpen] = useState(false);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold">Divisi</h1>
                <Button onClick={() => setOpen(true)}>+ Tambah Divisi</Button>
            </div>

            <div className="border rounded-xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Estate</TableHead>
                            <TableHead>Nama Divisi</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {dummyDivisi.map((d) => (
                            <TableRow key={d.id}>
                                <TableCell>{d.estate}</TableCell>
                                <TableCell>{d.nama}</TableCell>
                                <TableCell>{d.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex justify-between px-4 py-4 border-t">
                    <span className="text-sm">Showing 1 - 2</span>
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
                        <SheetTitle>Tambah Divisi</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-4 mt-4">
                        <Field label="Pilih Estate" />
                        <Field label="Nama Divisi" />
                        <Button className="w-full bg-green-600">Simpan</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

function Field({ label }: any) {
    return (
        <div>
            <Label>{label}</Label>
            <Input placeholder={label} />
        </div>
    );
}