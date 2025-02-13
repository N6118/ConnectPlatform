import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export function FacultyNavbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-4 font-bold">CONNECT</div>
        <div className="flex flex-1 items-center space-x-4">
          <Link href="/faculty/myspace">
            <Button variant="ghost">MySpace</Button>
          </Link>
          <Link href="/faculty/clubs">
            <Button variant="ghost">Clubs</Button>
          </Link>
          <Link href="/faculty/projects">
            <Button variant="ghost">Projects</Button>
          </Link>
          <Link href="/faculty/profile">
            <Button variant="ghost">Profile</Button>
          </Link>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
