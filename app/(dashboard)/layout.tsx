import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import AuthGuard from "@/components/auth/AuthGuard";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="h-dvh w-full overflow-hidden bg-gradient-to-br from-green-200 to-green-300 p-2 sm:p-3 lg:p-4">
        <div className="flex h-full min-h-0 w-full min-w-0 overflow-hidden rounded-xl bg-white shadow sm:rounded-2xl">
          <Sidebar />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <Header />

            <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-3 sm:p-4 lg:p-6">
              <div className="mx-auto w-full min-w-0 max-w-[1600px]">
                {children}
              </div>
            </main>
          </div>
        </div>

        <Toaster richColors position="top-right" />
      </div>
    </AuthGuard>
  );
}