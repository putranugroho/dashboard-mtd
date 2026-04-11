"use client";

import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { estates, divisis } from "../_data";

export function MasterBlokSheet({ open, setOpen }: any) {
    const [estateId, setEstateId] = useState<string>("");
    const [divisiId, setDivisiId] = useState<string>("");

    // 🔥 FILTER DIVISI
    const filteredDivisi = divisis.filter(
        (d) => d.estate_id === Number(estateId)
    );

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="right" className="w-[600px] p-0">
                <ScrollArea className="h-full px-6 py-6">
                    <SheetHeader className="mb-6">
                        <SheetTitle>Tambah Blok</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-6">

                        {/* 🔥 RELASI */}
                        <Section title="Relasi Kebun">
                            {/* ESTATE */}
                            <div className="space-y-1">
                                <Label>Estate</Label>
                                <Select
                                    value={estateId}
                                    onValueChange={(val) => {
                                        setEstateId(val);
                                        setDivisiId(""); // reset divisi
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Estate" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {estates.map((e) => (
                                            <SelectItem key={e.id} value={String(e.id)}>
                                                {e.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* DIVISI */}
                            <div className="space-y-1">
                                <Label>Divisi</Label>
                                <Select
                                    value={divisiId}
                                    onValueChange={setDivisiId}
                                    disabled={!estateId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih Divisi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredDivisi.map((d) => (
                                            <SelectItem key={d.id} value={String(d.id)}>
                                                {d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </Section>

                        {/* IDENTITAS */}
                        <Section title="Identitas Blok">
                            <Field label="Kode Blok" />
                            <Field label="Tahun Tanam" />
                            <Field label="Kelas Pohon" />
                            <Field label="Status Blok" />
                        </Section>

                        {/* AGRONOMI */}
                        <Section title="Data Tanaman">
                            <Field label="Jenis Bibit" />
                            <Field label="Jumlah Pokok" />
                            <Field label="Tahun Mulai Panen" />
                            <Field label="Bulan Mulai Panen" />
                        </Section>

                        {/* LUAS */}
                        <Section title="Luas Area">
                            <Field label="Luas Produktif" />
                            <Field label="Luas Non Produktif" />
                        </Section>

                        {/* BUTTON */}
                        <Button className="w-full bg-green-600">
                            Simpan Blok
                        </Button>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}

/* 🔧 HELPER */

function Section({ title, children }: any) {
    return (
        <div className="border rounded-xl p-4 space-y-3">
            <h3 className="font-semibold">{title}</h3>
            <div className="grid grid-cols-2 gap-4">{children}</div>
        </div>
    );
}

function Field({ label }: any) {
    return (
        <div className="space-y-1">
            <Label>{label}</Label>
            <Input placeholder={label} />
        </div>
    );
}