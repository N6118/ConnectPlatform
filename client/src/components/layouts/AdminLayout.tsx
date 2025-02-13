import { ReactNode } from "react";
import AdminNavbar from "@/components/navigation/AdminNavbar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}