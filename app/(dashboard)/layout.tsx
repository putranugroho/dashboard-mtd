import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Toaster } from "sonner";
export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-green-200 to-green-300 p-4">
      <div className="flex w-full bg-white rounded-2xl shadow overflow-hidden">

        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="p-6 bg-gray-50 overflow-auto">
            {children}
          </main>
        </div>

      </div>
      <Toaster />
    </div>
  );
}