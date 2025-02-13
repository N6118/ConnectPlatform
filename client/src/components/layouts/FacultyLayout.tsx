import { ReactNode } from "react";
import FacultyNavbar from "@/components/navigation/FacultyNavbar";

interface FacultyLayoutProps {
  children: ReactNode;
}

export function FacultyLayout({ children }: FacultyLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <FacultyNavbar />
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}