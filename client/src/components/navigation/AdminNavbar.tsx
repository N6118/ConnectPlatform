import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Gauge,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Search,
  School,
  ClipboardList,
  MessageSquare,
  Group,
  BookOpen,
} from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navItems = [
  {
    label: "Overview",
    path: "/admin",
    icon: <Gauge className="w-5 h-5" />,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Clubs",
    path: "/admin/clubs",
    icon: <Group className="w-5 h-5" />,
  },
  {
    label: "Projects",
    path: "/admin/projects",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Publications",
    path: "/admin/publications",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    label: "Approvals",
    path: "/admin/approvals",
    icon: <ClipboardList className="w-5 h-5" />,
  },
];

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [_, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setLocation("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 flex items-center"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                CONNECT Admin
              </span>
            </motion.div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users, projects, clubs..."
                  className="w-full pl-10"
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <motion.button
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLocation(item.path)}
                className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent transition-colors duration-200 flex items-center space-x-2"
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Right Side - Theme Toggle and Profile */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/admin/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/admin/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className={`md:hidden overflow-hidden ${isOpen ? "border-t border-border" : ""}`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setLocation(item.path);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-indigo-600 hover:bg-accent transition-colors duration-200 flex items-center space-x-2"
            >
              {item.icon}
              <span>{item.label}</span>
            </motion.button>
          ))}

          {/* Mobile Profile Options */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setLocation("/admin/profile");
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-indigo-600 hover:bg-accent transition-colors duration-200 flex items-center space-x-2"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setLocation("/admin/settings");
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-indigo-600 hover:bg-accent transition-colors duration-200 flex items-center space-x-2"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </motion.button>

          {/* Mobile Logout Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.div>
    </nav>
  );
}
