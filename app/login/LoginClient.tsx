"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginDashboard } from "@/lib/api/dashboard-auth";
import { setSession } from "@/lib/auth/session";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    try {
      const session = await loginDashboard({
        username,
        password,
      });

      setSession(session);
      router.replace(redirectTo);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-center justify-center">
        <div className="mb-5 flex w-full items-center justify-center">
          <div className="h-[115px] w-[230px] overflow-hidden">
            <Image
              src="/Logo-mtd.png"
              alt="MTD Logo"
              width={320}
              height={320}
              priority
              className="-mt-[55px] h-auto w-[230px] max-w-none object-contain"
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl bg-white p-6 shadow"
        >
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-slate-900">
              Login Dashboard MTD
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Masuk menggunakan akun dashboard.
            </p>
          </div>

          {errorMessage ? (
            <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-700"
              placeholder="ADMIN"
              autoComplete="username"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-700"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}