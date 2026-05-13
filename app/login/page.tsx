"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginDashboard } from "@/lib/api/dashboard-auth";
import { setSession } from "@/lib/auth/session";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username wajib diisi.");
      return;
    }

    if (!password.trim()) {
      setError("Password wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      const session = await loginDashboard({
        username: username.trim(),
        password,
      });

      setSession(session);
      router.replace(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-200 to-green-300 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden bg-gradient-to-br from-green-700 to-green-500 p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <div className="rounded-2xl bg-white/95 p-4 shadow-lg inline-flex">
              <Image
                src="/logo-susan.png"
                alt="SUSAN"
                width={190}
                height={48}
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-12 max-w-md">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-green-100">
                Dashboard MTD
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight">
                Login dan kontrol akses menu dalam satu dashboard.
              </h1>
              <p className="mt-4 text-sm leading-6 text-green-50">
                Hak akses menu dan tombol akan mengikuti konfigurasi pada Setup User.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 text-sm text-green-50 backdrop-blur">
            Permission berbasis action-level: view, save, delete, relasi, detail, export, check, dan lainnya.
          </div>
        </section>

        <section className="p-8 md:p-10">
          <div className="mb-8 md:hidden">
            <Image
              src="/logo-susan.png"
              alt="SUSAN"
              width={160}
              height={42}
              className="object-contain"
              priority
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Masuk Dashboard</h2>
            <p className="mt-1 text-sm text-gray-500">
              Gunakan username dan password dashboard MTD.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={username}
                  onChange={(event) => setUsername(event.target.value.toUpperCase())}
                  placeholder="ADMIN"
                  className="h-11 pl-10 uppercase"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  className="h-11 pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <Button type="submit" disabled={loading} className="h-11 w-full">
              {loading ? "Memproses..." : "Login"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
