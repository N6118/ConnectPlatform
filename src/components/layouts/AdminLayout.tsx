import { AdminNavbar } from "@/components/navigation/AdminNavbar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
