import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <div className="rounded-2xl bg-white px-6 py-4 shadow">
            Memuat halaman login...
          </div>
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}