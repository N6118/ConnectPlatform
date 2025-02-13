import { ReactNode } from "react";
import StudentNavbar from "@/components/navigation/StudentNavbar";

interface StudentLayoutProps {
  children: ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <StudentNavbar />
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}