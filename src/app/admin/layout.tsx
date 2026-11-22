
import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-200">
      <AdminSidebar />

      <main className="min-h-screen lg:pl-72">
        {children}
      </main>
    </div>
  );
}
