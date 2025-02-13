import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AdminNavbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-4 font-bold">CONNECT</div>
        <div className="flex flex-1 items-center space-x-4">
          <Link href="/admin/myspace">
            <Button variant="ghost">MySpace</Button>
          </Link>
          <Link href="/admin/clubs">
            <Button variant="ghost">Clubs</Button>
          </Link>
          <Link href="/admin/projects">
            <Button variant="ghost">Projects</Button>
          </Link>
          <Link href="/admin/profile">
            <Button variant="ghost">Profile</Button>
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}