"use client";


import OrganizationChart from "@/modules/organization/OrganizationChart";
import OrganizationForm from "@/modules/organization/OrganizationForm";
// import OrganizationChart from "./OrganizationChart";
// import OrganizationForm from "./OrganizationForm";
import { useState } from "react";

export default function Page() {
    const [selected, setSelected] = useState(null);

    return (
        <div className="grid grid-cols-3 gap-4 h-full">

            {/* CHART */}
            <div className="col-span-2 bg-white rounded-xl p-4 h-[75vh]">
                <OrganizationChart onSelect={setSelected} />
            </div>

            {/* DETAIL */}
            <div className="bg-white rounded-xl p-4">
                <OrganizationForm data={selected} />
            </div>
        </div>
    );
}