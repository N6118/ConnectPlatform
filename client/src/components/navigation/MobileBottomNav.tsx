import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  User,
  Briefcase,
  Group,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface BottomNavProps {
  role: 'student' | 'faculty';
}

export default function MobileBottomNav({ role }: BottomNavProps) {
  const [location] = useLocation();

  const facultyNavItems: NavItem[] = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/faculty' },
    { icon: <Briefcase className="h-5 w-5" />, label: 'My Space', path: '/faculty/my-space' },
    { icon: <FileText className="h-5 w-5" />, label: 'Projects', path: '/faculty/projects' },
    { icon: <Group className="h-5 w-5" />, label: 'Clubs', path: '/faculty/clubs' },
    { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', path: '/faculty/messaging' },
  ];

  const studentNavItems: NavItem[] = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard', path: '/student' },
    { icon: <Briefcase className="h-5 w-5" />, label: 'My Space', path: '/student/my-space' },
    { icon: <FileText className="h-5 w-5" />, label: 'Projects', path: '/student/projects' },
    { icon: <Group className="h-5 w-5" />, label: 'Clubs', path: '/student/clubs' },
    { icon: <MessageSquare className="h-5 w-5" />, label: 'Messages', path: '/student/messaging' },
  ];

  const navItems = role === 'faculty' ? facultyNavItems : studentNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center justify-center p-2 ${
                location === item.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </motion.button>
          </Link>
        ))}
      </div>
    </nav>
  );
}