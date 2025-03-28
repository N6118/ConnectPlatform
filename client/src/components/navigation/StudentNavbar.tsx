import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Settings,
  LogOut,
  User,
  Search,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Group,
  ChevronDown,
  Briefcase,
  UserCog,
  X,
  AlertCircle,
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
import { Badge } from "@/components/ui/badge";

const navItems = [
  {
    label: "Home",
    path: "/student",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "My Space",
    path: "/student/my-space",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Projects",
    path: "/student/projects",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Clubs",
    path: "/student/clubs",
    icon: <Group className="w-5 h-5" />,
  },
  {
    label: "Messages",
    path: "/student/messaging",
    icon: <MessageSquare className="w-5 h-5" />,
  },
];

export default function StudentNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [_, setLocation] = useLocation();
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [searchType, setSearchType] = useState<"faculty" | "student" | null>(null);
  const [showTypeError, setShowTypeError] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    if (!searchType) {
      setSearchDropdownOpen(true);
      setShowTypeError(true);
      return;
    }
    
    // Reset error state
    setShowTypeError(false);
    
    // Navigate to search results
    setLocation(
      `/search-results?q=${encodeURIComponent(searchQuery.trim())}&type=${searchType}`,
    );
  };

  const handleSearchTypeSelect = (type: "faculty" | "student") => {
    setSearchType(type);
    setSearchDropdownOpen(false);
    setShowTypeError(false);
  };

  const clearSearchType = () => {
    setSearchType(null);
  };

  const handleInputFocus = () => {
    if (!searchType) {
      setSearchDropdownOpen(true);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      // Clear user data from localStorage
      localStorage.removeItem('user');
      setLocation("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 flex items-center"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                CONNECT
              </span>
            </motion.div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <div className="flex items-center">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleInputFocus}
                    placeholder={searchType ? "Search..." : "Select search type first..."}
                    className={`w-full pl-10 ${searchType ? 'pr-24' : ''} ${
                      showTypeError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  
                  {searchType && (
                    <div className="absolute right-3 flex items-center">
                      <Badge className="flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {searchType === "faculty" ? (
                          <Briefcase className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        <span className="text-xs">{searchType}</span>
                        <button 
                          type="button" 
                          onClick={clearSearchType}
                          className="ml-1 rounded-full hover:bg-blue-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </div>
                  )}
                </div>
                
                {showTypeError && !searchType && (
                  <div className="absolute top-full mt-1 text-xs text-red-500 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Please select a search type first
                  </div>
                )}
                
                {searchDropdownOpen && !searchType && (
                  <div className="absolute w-full top-full mt-1 bg-background border rounded-md shadow-lg z-50">
                    <div className="p-2">
                      <h3 className="text-sm font-medium mb-2 px-2">Select search type:</h3>
                      <button
                        type="button"
                        onClick={() => handleSearchTypeSelect("faculty")}
                        className="flex items-center gap-2 w-full p-2 text-sm hover:bg-accent rounded"
                      >
                        <Briefcase className="h-4 w-4" />
                        Faculty
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSearchTypeSelect("student")}
                        className="flex items-center gap-2 w-full p-2 text-sm hover:bg-accent rounded"
                      >
                        <User className="h-4 w-4" />
                        Student
                      </button>
                    </div>
                  </div>
                )}
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
                <DropdownMenuLabel>Student Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setLocation("/student/profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLocation("/student/settings")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
