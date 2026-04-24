"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getSetupFee, saveSetupFee } from "@/lib/api/setup-fee";

export default function SetupMTN() {
    const [form, setForm] = useState({
        fee_ppob: 0,
        fee_transfer_out: 0,
        fee_qris: 0,
        fee_transfer_in: 0,
    });

    async function load() {
        const data = await getSetupFee("609999");

        if (data.mtn.length > 0) {
            setForm({
                fee_ppob: data.mtn[0].fee_ppob ?? 0,
                fee_transfer_out: data.mtn[0].fee_transfer_out ?? 0,
                fee_qris: data.mtn[0].fee_qris ?? 0,
                fee_transfer_in: data.mtn[0].fee_transfer_in ?? 0,
            });
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSave() {
        await saveSetupFee({
            bpr_id: "609999",
            transfer_out: [],
            ppob: [],
            mtn: [form],
        });
    }

    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Setup Charge MTN</h2>

            <div className="grid grid-cols-2 gap-6">
                <Field label="Fee PPOB" value={form.fee_ppob} onChange={(v: any) => setForm({ ...form, fee_ppob: v })} />
                <Field label="Fee Transfer Out" value={form.fee_transfer_out} onChange={(v: any) => setForm({ ...form, fee_transfer_out: v })} />
                <Field label="Fee QRIS" value={form.fee_qris} onChange={(v: any) => setForm({ ...form, fee_qris: v })} />
                <Field label="Fee Transfer In" value={form.fee_transfer_in} onChange={(v: any) => setForm({ ...form, fee_transfer_in: v })} />
            </div>

            <div className="flex justify-end mt-6">
                <Button onClick={handleSave}>Simpan</Button>
            </div>
        </div>
    );
}

function Field({ label, value, onChange }: any) {
    return (
        <div className="space-y-1">
            <label className="text-sm text-gray-500">{label}</label>
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2"
            />
        </div>
    );
}