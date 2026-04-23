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

export default function SetupPPOB() {
    const [loading, setLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [form, setForm] = useState({
        bpr_id: "",
        fee_mtd: 0,
        fee_bpr: 0,
        markup_bpr: 0,
        margin_mtd: 0,
    });

    async function load() {
        const res = await getSetupFee("609999");
        setData(res.ppob);
    }

    useEffect(() => {
        load();
    }, []);

    function handleAdd() {
        setForm({ bpr_id: "609999", fee_mtd: 0, fee_bpr: 0, markup_bpr: 0, margin_mtd: 0 });
        setIsEdit(false);
        setSheetOpen(true);
    }

    function handleEdit(item: any) {
        setForm(item);
        setIsEdit(true);
        setSheetOpen(true);
    }

    async function handleSubmit() {
        try {
            setLoading(true);

            await saveSetupFee({
                bpr_id: form.bpr_id,
                transfer_out: [],
                ppob: [form],
                mtn: [],
            });

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
                    <h2 className="text-lg font-semibold">Setup Fee PPOB</h2>
                    <p className="text-sm text-gray-500">
                        Kelola fee PPOB per BPR
                    </p>
                </div>

                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button onClick={handleAdd}>
                            <Plus className="mr-1 size-4" />
                            Tambah
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="right" className="w-[400px]">
                        <SheetHeader>
                            <SheetTitle>Form PPOB</SheetTitle>
                        </SheetHeader>

                        <div className="space-y-4 mt-6 p-8">
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

                            <div className="space-y-1">
                                <label className="text-sm text-gray-500">Fee MTD</label>
                                <input
                                    type="number"
                                    value={form.fee_mtd}
                                    onChange={(e) =>
                                        setForm({ ...form, fee_mtd: Number(e.target.value) })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm text-gray-500">Fee BPR</label>
                                <input
                                    type="number"
                                    value={form.fee_bpr}
                                    onChange={(e) =>
                                        setForm({ ...form, fee_bpr: Number(e.target.value) })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm text-gray-500">Markup BPR</label>
                                <input
                                    type="number"
                                    value={form.markup_bpr}
                                    onChange={(e) =>
                                        setForm({ ...form, markup_bpr: Number(e.target.value) })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>
                             <div className="space-y-1">
                                <label className="text-sm text-gray-500">Margin MTD</label>
                                <input
                                    type="number"
                                    value={form.margin_mtd}
                                    onChange={(e) =>
                                        setForm({ ...form, margin_mtd: Number(e.target.value) })
                                    }
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            </div>

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
                            <TableHead>Fee MTD</TableHead>
                            <TableHead>Fee BPR</TableHead>
                            <TableHead>Markup BPR</TableHead>
                            <TableHead>Margin MTD</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-6">
                                    Tidak ada data
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell>{item.bpr_id}</TableCell>
                                    <TableCell>{item.fee_mtd}</TableCell>
                                    <TableCell>{item.fee_bpr}</TableCell>
                                    <TableCell>{item.markup_bpr}</TableCell>
                                    <TableCell>{item.margin_mtd}</TableCell>
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