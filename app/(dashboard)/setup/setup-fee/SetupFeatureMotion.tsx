"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getSetupFee } from "@/lib/api/setup-fee";
import { postJson } from "@/lib/api/client";

export default function SetupFeatureMotion() {
    const [form, setForm] = useState({
        bpr_id: "609999",
        is_inquiry_allowed: true,
        is_transaction_allowed: true,
    });

    const [loading, setLoading] = useState(false);

    async function load() {
        const res = await getSetupFee(form.bpr_id);

        if (res.feature_motion) {
            setForm({
                bpr_id: form.bpr_id,
                is_inquiry_allowed: res.feature_motion.is_inquiry_allowed,
                is_transaction_allowed: res.feature_motion.is_transaction_allowed,
            });
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleSave() {
        try {
            setLoading(true);

            await postJson("/setup_feature_motion", {
                action: "insert",
                data: [form],
            });

            toast.success("Feature motion berhasil disimpan");
        } catch (err) {
            console.error(err);
            toast.error("Gagal menyimpan");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-6">Setup Feature Motion</h2>

            <div className="space-y-6 max-w-md">
                {/* Inquiry */}
                <div className="flex items-center justify-between border rounded-xl p-4">
                    <div>
                        <p className="font-medium">Inquiry</p>
                        <p className="text-sm text-gray-500">
                            Izinkan akses inquiry ke motion
                        </p>
                    </div>

                    <input
                        type="checkbox"
                        checked={form.is_inquiry_allowed}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                is_inquiry_allowed: e.target.checked,
                            })
                        }
                        className="w-5 h-5"
                    />
                </div>

                {/* Transaction */}
                <div className="flex items-center justify-between border rounded-xl p-4">
                    <div>
                        <p className="font-medium">Transaction</p>
                        <p className="text-sm text-gray-500">
                            Izinkan transaksi ke motion
                        </p>
                    </div>

                    <input
                        type="checkbox"
                        checked={form.is_transaction_allowed}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                is_transaction_allowed: e.target.checked,
                            })
                        }
                        className="w-5 h-5"
                    />
                </div>

                <Button onClick={handleSave} disabled={loading} className="w-full">
                    {loading ? "Menyimpan..." : "Simpan"}
                </Button>
            </div>
        </div>
    );
}