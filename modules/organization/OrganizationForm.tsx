"use client";

import { useEffect, useState } from "react";

export default function OrganizationForm({ data }: any) {
    const [form, setForm] = useState<any>({
        name: "",
        type: "company",
    });

    useEffect(() => {
        if (data) {
            setForm(data);
        }
    }, [data]);

    return (
        <div>
            <h2 className="font-semibold mb-4">
                {data ? "Edit Entitas" : "Tambah Entitas"}
            </h2>

            <input
                className="border w-full p-2 mb-2 rounded"
                placeholder="Nama"
                value={form.name || ""}
                onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                }
            />

            <select
                className="border w-full p-2 mb-4 rounded"
                value={form.type || "company"}
                onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                }
            >
                <option value="holding">Holding</option>
                <option value="company">Company</option>
                <option value="division">Division</option>
                <option value="unit">Unit</option>
            </select>

            <button className="w-full bg-green-600 text-white py-2 rounded">
                Save
            </button>
        </div>
    );
}