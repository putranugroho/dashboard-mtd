"use client";


import { useState } from "react";
import SetupMTN from "./SetupMTN";
import SetupPPOB from "./SetupPPOB";
import SetupTransferOut from "./SetupTransferOut";
import SetupFeatureMotion from "./SetupFeatureMotion";

export default function SetupFeePage() {
    const [tab, setTab] = useState("mtn");

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h1 className="text-2xl font-semibold">Setup Fee</h1>
                <p className="text-sm text-gray-500">
                    Kelola biaya transaksi MTN, PPOB, dan Transfer Out.
                </p>
            </div>

            <div className="flex gap-6">
                {/* SIDEBAR */}
                <div className="w-64 rounded-2xl border bg-white p-4 shadow-sm">
                    <div className="space-y-2">
                        <button onClick={() => setTab("mtn")} className="menu-active">
                            Setup Charge MTN
                        </button>
                        <button onClick={() => setTab("ppob")} className="menu">
                            Setup Trans Fee PPOB
                        </button>
                        <button onClick={() => setTab("transfer_out")} className="menu">
                            Setup Transfer Out
                        </button>
                        <button onClick={() => setTab("feature_motion")} className="menu">
                            Setup Feature Motion
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                    {tab === "mtn" && <SetupMTN />}
                    {tab === "ppob" && <SetupPPOB />}
                    {tab === "transfer_out" && <SetupTransferOut />}
                    {tab === "feature_motion" && <SetupFeatureMotion />}
                </div>
            </div>
        </div>
    );
}