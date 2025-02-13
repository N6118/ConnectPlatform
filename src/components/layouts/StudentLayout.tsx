import { StudentNavbar } from "@/components/navigation/StudentNavbar";

export function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <StudentNavbar />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
