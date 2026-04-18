"use client";

import { useState } from "react";

import SignActionForm from "./SignActionForm";
import SignStatusCard from "./SignStatusCard";
import { signStatusDummyMap } from "./dummy";
import { SignStatus } from "./types";

function buildDefaultStatus(bprId: string): SignStatus {
  return {
    bpr_id: bprId,
    status: "OFFLINE",
    updated_at: "-",
    updated_by: "-",
    message: "Belum ada status tersimpan untuk BPR ini.",
  };
}

function nowString() {
  const now = new Date();
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(now);
}

export default function SignInSignOffPage() {
  const [bprId, setBprId] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMap, setStatusMap] =
    useState<Record<string, SignStatus>>(signStatusDummyMap);
  const [currentStatus, setCurrentStatus] = useState<SignStatus | null>(null);

  const handleCheckStatus = async () => {
    if (!bprId.trim()) {
      window.alert("BPR ID wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      // dummy mode
      await new Promise((resolve) => setTimeout(resolve, 400));

      const key = bprId.trim();
      const found = statusMap[key] ?? buildDefaultStatus(key);

      setCurrentStatus(found);
    } catch (error) {
      console.error(error);
      window.alert("Gagal memuat status BPR.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!currentStatus) return;

    const ok = window.confirm(
      `Yakin ingin SIGN IN untuk BPR ${currentStatus.bpr_id}?`
    );
    if (!ok) return;

    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 400));

      const updated: SignStatus = {
        ...currentStatus,
        status: "ONLINE",
        updated_at: nowString(),
        updated_by: "admin",
        message: "BPR sedang online dan dapat menerima transaksi",
      };

      setStatusMap((prev) => ({
        ...prev,
        [updated.bpr_id]: updated,
      }));

      setCurrentStatus(updated);
      window.alert("BPR berhasil di-sign in.");
    } catch (error) {
      console.error(error);
      window.alert("Gagal melakukan sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOff = async () => {
    if (!currentStatus) return;

    const ok = window.confirm(
      `Yakin ingin SIGN OFF untuk BPR ${currentStatus.bpr_id}?`
    );
    if (!ok) return;

    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 400));

      const updated: SignStatus = {
        ...currentStatus,
        status: "OFFLINE",
        updated_at: nowString(),
        updated_by: "admin",
        message: "BPR sedang offline dan tidak dapat menerima transaksi",
      };

      setStatusMap((prev) => ({
        ...prev,
        [updated.bpr_id]: updated,
      }));

      setCurrentStatus(updated);
      window.alert("BPR berhasil di-sign off.");
    } catch (error) {
      console.error(error);
      window.alert("Gagal melakukan sign off.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SignActionForm
        bprId={bprId}
        loading={loading}
        currentStatus={currentStatus}
        onChangeBprId={setBprId}
        onCheckStatus={handleCheckStatus}
        onSignIn={handleSignIn}
        onSignOff={handleSignOff}
      />

      <SignStatusCard data={currentStatus} />
    </div>
  );
}