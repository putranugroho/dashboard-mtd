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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const dummyEstate = [
    { id: 1, nama: "Estate A", lokasi: "Riau", status: "Active" },
    { id: 2, nama: "Estate B", lokasi: "Jambi", status: "Active" },
];

export default function EstatePage() {
    const [open, setOpen] = useState(false);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold">Estate</h1>
                <Button onClick={() => setOpen(true)}>+ Tambah Estate</Button>
            </div>

            <div className="border rounded-xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Estate</TableHead>
                            <TableHead>Lokasi</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dummyEstate.map((e) => (
                            <TableRow key={e.id}>
                                <TableCell>{e.nama}</TableCell>
                                <TableCell>{e.lokasi}</TableCell>
                                <TableCell>{e.status}</TableCell>
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
                        <SheetTitle>Tambah Estate</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-4 mt-4">
                        <Field label="Nama Estate" />
                        <Field label="Lokasi" />
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