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

import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

import { kelompokKegiatan, kegiatan } from "../_kegiatan";

export default function KegiatanPage() {
    const [open, setOpen] = useState(false);

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex justify-between">
                <h1 className="text-xl font-semibold">Kegiatan</h1>
                <Button onClick={() => setOpen(true)}>+ Tambah</Button>
            </div>

            {/* TABLE */}
            <div className="border rounded-xl overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kelompok</TableHead>
                            <TableHead>Nama Kegiatan</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {kegiatan.map((k) => {
                            const kelompok = kelompokKegiatan.find(
                                (g) => g.id === k.kelompok_id
                            );

                            return (
                                <TableRow key={k.id}>
                                    <TableCell>{kelompok?.nama}</TableCell>
                                    <TableCell>{k.nama}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                {/* PAGINATION */}
                <div className="flex justify-between px-4 py-4 border-t">
                    <span className="text-sm">
                        Showing 1 - {kegiatan.length}
                    </span>

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
                        <SheetTitle>Tambah Kegiatan</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-4 mt-4">

                        {/* 🔥 RELASI */}
                        <div>
                            <Label>Kelompok Kegiatan</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kelompok" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kelompokKegiatan.map((k) => (
                                        <SelectItem key={k.id} value={String(k.id)}>
                                            {k.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* NAMA */}
                        <div>
                            <Label>Nama Kegiatan</Label>
                            <Input placeholder="Contoh: Panen TBS" />
                        </div>

                        <Button className="w-full bg-green-600">
                            Simpan
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}