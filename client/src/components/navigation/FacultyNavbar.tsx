import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  School,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Search,
  GraduationCap,
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

const navItems = [
  {
    label: "Dashboard",
    path: "/faculty",
    icon: <School className="w-5 h-5" />,
  },
  {
    label: "Projects",
    path: "/faculty/projects",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Students",
    path: "/faculty/students",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    label: "Clubs",
    path: "/faculty/clubs",
    icon: <Group className="w-5 h-5" />,
  },
  {
    label: "Messages",
    path: "/faculty/messages",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    label: "Resources",
    path: "/faculty/resources",
    icon: <BookOpen className="w-5 h-5" />,
  },
];

export default function FacultyNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [_, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/faculty/search?q=${encodeURIComponent(searchQuery.trim())}`);
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
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 flex items-center"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                CONNECT Faculty
              </span>
            </motion.div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students, projects, resources..."
                  className="w-full px-4 py-2 pl-10 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
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
                className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-indigo-600 hover:bg-accent transition-colors duration-200 flex items-center space-x-2"
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            ))}

            {/* User Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-indigo-600 hover:bg-accent transition-colors duration-200">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Faculty Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLocation("/faculty/profile")}>
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/faculty/settings")}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex items-center w-full">
                    <ThemeToggle />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setLocation("/faculty/search")}
              className="p-2 rounded-md text-foreground hover:text-indigo-600 hover:bg-accent focus:outline-none"
            >
              <Search className="h-5 w-5" />
            </motion.button>

            <ThemeToggle />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-indigo-600 hover:bg-accent focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </motion.button>
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
              setLocation("/faculty/profile");
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
              setLocation("/faculty/settings");
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
