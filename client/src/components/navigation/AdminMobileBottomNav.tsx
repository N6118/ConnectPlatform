import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Gauge,
  Users,
  FileText,
  Group,
  BookOpen,
  ClipboardList,
  Calendar,
} from "lucide-react";

const navItems = [
  {
    icon: <Gauge className="h-5 w-5" />,
    label: "Overview",
    path: "/admin",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "Users",
    path: "/admin/users",
  },
  {
    icon: <Group className="h-5 w-5" />,
    label: "Clubs",
    path: "/admin/clubs",
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    label: "Events",
    path: "/admin/events",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: "Projects",
    path: "/admin/projects",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    label: "Publications",
    path: "/admin/publications",
  },
];

export default function AdminMobileBottomNav() {
  const [location] = useLocation();

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