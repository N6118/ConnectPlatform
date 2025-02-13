import React from "react";
import { FacultyNavbar } from "@/components/navigation/FacultyNavbar";

export function FacultyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <FacultyNavbar />
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}