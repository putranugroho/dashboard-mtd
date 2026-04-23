"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { getSetupFee, saveSetupFee } from "@/lib/api/setup-fee";

export default function SetupTransferOut() {
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [form, setForm] = useState({
        bpr_id: "",
        biaya_transfer: 0,
        fee_mtd: 0,
        fee_bpr: 0,
        markup_bpr: 0,
    });

    const fields: {
        key: keyof typeof form;
        label: string;
    }[] = [
            { key: "biaya_transfer", label: "Biaya Transfer" },
            { key: "fee_mtd", label: "Fee MTD" },
            { key: "fee_bpr", label: "Fee BPR" },
            { key: "markup_bpr", label: "Markup BPR" },
        ];

    async function load() {
        const res = await getSetupFee("609999");
        setData(res.transfer_out);
    }

    useEffect(() => {
        load();
    }, []);

    function handleAdd() {
        setForm({
            bpr_id: "609999",
            biaya_transfer: 0,
            fee_mtd: 0,
            fee_bpr: 0,
            markup_bpr: 0,
        });
        setSheetOpen(true);
    }

    function handleEdit(item: any) {
        setForm(item);
        setSheetOpen(true);
    }

    async function handleSubmit() {


        try {
            setLoading(true);

            await saveSetupFee({
                bpr_id: form.bpr_id,
                transfer_out: [form],
                ppob: [],
                mtn: [],
            });

            setSheetOpen(false);
            await load();
            toast.success("Data berhasil disimpan");

            setSheetOpen(false);
            await load();
        } catch (err) {
            console.error(err);
            toast.error("Gagal menyimpan");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold">Setup Transfer Out</h2>
                    <p className="text-sm text-gray-500">
                        Kelola biaya transfer keluar
                    </p>
                </div>

                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button onClick={handleAdd}>
                            <Plus className="mr-1 size-4" />
                            Tambah
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="right" className="w-[420px]">
                        <SheetHeader>
                            <SheetTitle>Form Transfer Out</SheetTitle>
                        </SheetHeader>

                        <div className="space-y-4 mt-4 p-8">
                            <div className="space-y-1">
                                <label className="text-sm text-gray-500">BPR ID</label>
                                <input
                                    value={form.bpr_id}
                                    onChange={(e) =>
                                        setForm({ ...form, bpr_id: e.target.value })
                                    }
                                    disabled={isEdit}
                                    className={`w-full border rounded-lg px-3 py-2 ${isEdit ? "bg-gray-100" : ""
                                        }`}
                                />
                            </div>

                            {fields.map((f) => (
                                <div key={f.key} className="space-y-1">
                                    <label className="text-sm text-gray-500">{f.label}</label>
                                    <input
                                        type="number"
                                        value={form[f.key]}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                [f.key]: Number(e.target.value),
                                            })
                                        }
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                            ))}
                            <Button onClick={handleSubmit} disabled={loading} className="w-full">
                                {loading ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* TABLE */}
            <div className="rounded-2xl border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>BPR</TableHead>
                            <TableHead>Biaya</TableHead>
                            <TableHead>Fee MTD</TableHead>
                            <TableHead>Fee BPR</TableHead>
                            <TableHead>Markup</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                    Tidak ada data
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell>{item.bpr_id}</TableCell>
                                    <TableCell>{item.biaya_transfer}</TableCell>
                                    <TableCell>{item.fee_mtd}</TableCell>
                                    <TableCell>{item.fee_bpr}</TableCell>
                                    <TableCell>{item.markup_bpr}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" onClick={() => handleEdit(item)}>
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}