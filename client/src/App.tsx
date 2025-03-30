import { Switch, Route, RouteComponentProps } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import ForgotCredentials from "@/pages/forgot-credentials";
import OTPVerification from "@/pages/otp-verification";
import ResetPassword from "@/pages/reset-password";
import SearchResults from "@/pages/SearchResults";
// Admin pages
import Dashboard from "@/pages/admin/dashboard";
import ApprovalsTab from "@/pages/admin/ApprovalsTab";
import ClubManagement from "@/pages/admin/ClubManagement";
import ProjectsTab from "@/pages/admin/ProjectsTab";
import PublicationsTab from "@/pages/admin/PublicationsTab";
import SettingsTab from "@/pages/admin/SettingsTab";
import UsersTab from "@/pages/admin/UsersTab";
import EventManagement from './pages/admin/EventManagement';
import { Route as WouterRoute } from "wouter";
import ChatbotPage from "@/pages/admin/ChatbotPage";
import ChatbotButton from "@/components/ChatbotButton";

// Faculty pages
import FacultyDashboard from "@/pages/faculty/dashboard";
import { default as FacultyClubs } from "@/pages/faculty/clubs";
import { default as FacultyProjects } from "@/pages/faculty/projects";
import { default as FacultyProfile } from "@/pages/faculty/profile";
import { default as FacultyMessaging } from "@/pages/faculty/messaging";
import { default as FacultyMySpace } from "@/pages/faculty/my-space";
import { default as FacultyProjectDetails } from "@/pages/faculty/projectdetails";
import { default as FacultyClubDetail } from "@/pages/faculty/clubdetails";

// Student pages
import StudentDashboard from "@/pages/student/dashboard";
import { default as StudentClubs } from "@/pages/student/clubs";
import { default as StudentProjects } from "@/pages/student/projects";
import { default as StudentProfile } from "@/pages/student/profile";
import { default as StudentMessaging } from "@/pages/student/messaging";
import { default as StudentMySpace } from "@/pages/student/my-space";
import { default as StudentProjectDetails } from "@/pages/student/projectdetails";
import { default as StudentClubDetail } from "@/pages/student/clubdetails";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/lib/auth";
import { useLocation } from "wouter";
import { authService } from "@/services/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: "admin" | "faculty" | "student";
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: "student",
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [_, navigate] = useLocation();

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
    const roleRoutes: Record<string, string> = {
      admin: "/admin",
      faculty: "/faculty",
      student: "/student",
    };

    if (!roleRoutes[newUser.role]) {
      throw new Error("Invalid role detected");
    }

    setTimeout(() => {
      navigate(roleRoutes[newUser.role]);
    }, 100);
  };

  const logout = () => {
    // Use the auth service to handle logout
    authService.logout();
    setUser(null);
    navigate("/login");
  };

  const value: AuthContextType = {
    isAuthenticated: !!user,
    userRole: (user?.role as "admin" | "faculty" | "student") || "student",
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>
    {children}
    <ChatbotButton />
  </AuthContext.Provider>;
}

function PrivateRoute({
  component: Component,
  roles,
}: {
  component: React.ComponentType;
  roles?: string[];
}) {
  const { isAuthenticated, userRole } = useAuth();
  const [_, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (roles && !roles.includes(userRole)) {
      navigate("/unauthorized");
    }
  }, [isAuthenticated, userRole, roles, navigate]);

  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={() => <Landing />} />
      <Route path="/login" component={() => <Login />} />
      <Route path="/forgot-credentials" component={() => <ForgotCredentials />} />
      <Route path="/otp-verification" component={() => <OTPVerification />} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/search-results" component={SearchResults} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        component={() => <Route component={Dashboard} roles={["admin"]} />}
      />
      <Route
        path="/admin/users"
        component={() => <Route component={UsersTab} roles={["admin"]} />}
      />
      <Route
        path="/admin/clubs"
        component={() => <Route component={ClubManagement} roles={["admin"]} />}
      />
      <Route
        path="/admin/events"
        component={() => <Route component={EventManagement} roles={["admin"]} />}
      />
      <Route
        path="/admin/projects"
        component={() => <Route component={ProjectsTab} roles={["admin"]} />}
      />
      <Route
        path="/admin/publications"
        component={() => <Route component={PublicationsTab} roles={["admin"]} />}
      />
      <Route
        path="/admin/approvals"
        component={() => <Route component={ApprovalsTab} roles={["admin"]} />}
      />
      <Route
        path="/admin/settings"
        component={() => <Route component={SettingsTab} roles={["admin"]} />}
      />
      <Route
        path="/admin/chat"
        component={() => <Route component={ChatbotPage} roles={["admin"]} />}
      />

      {/* Faculty Routes */}
      <Route
        path="/faculty"
        component={() => (
          <Route component={FacultyDashboard} roles={["faculty"]} />
        )}
      />
      <Route
        path="/faculty/clubs"
        component={() => <Route component={FacultyClubs} roles={["faculty"]} />}
      />
      <Route
        path="/faculty/projects"
        component={() => (
          <Route component={FacultyProjects} roles={["faculty"]} />
        )}
      />
      <Route
        path="/faculty/profile"
        component={() => (
          <Route component={FacultyProfile} roles={["faculty"]} />
        )}
      />
      <Route
        path="/faculty/messaging"
        component={() => (
          <Route component={FacultyMessaging} roles={["faculty"]} />
        )}
      />
      <Route
        path="/faculty/my-space"
        component={() => (
          <Route component={FacultyMySpace} roles={["faculty"]} />
        )}
      />
      <Route
        path="/faculty/project/:id"
        component={() => (
          <Route component={FacultyProjectDetails} roles={["faculty"]} />
        )}
      />
      <Route
        path="/faculty/club/:id"
        component={() => (
          <Route component={FacultyClubDetail} roles={["faculty"]} />
        )}
      />

      {/* Student Routes */}
      <Route
        path="/student"
        component={() => (
          <Route component={StudentDashboard} roles={["student"]} />
        )}
      />
      <Route
        path="/student/clubs"
        component={() => <Route component={StudentClubs} roles={["student"]} />}
      />
      <Route
        path="/student/projects"
        component={() => (
          <Route component={StudentProjects} roles={["student"]} />
        )}
      />
      <Route
        path="/student/profile"
        component={() => (
          <Route component={StudentProfile} roles={["student"]} />
        )}
      />
      <Route
        path="/student/messaging"
        component={() => (
          <Route component={StudentMessaging} roles={["student"]} />
        )}
      />
      <Route
        path="/student/my-space"
        component={() => (
          <Route component={StudentMySpace} roles={["student"]} />
        )}
      />
      <Route
        path="/student/project/:id"
        component={() => (
          <Route component={StudentProjectDetails} roles={["student"]} />
        )}
      />
      <Route
        path="/student/club/:id"
        component={() => (
          <Route component={StudentClubDetail} roles={["student"]} />
        )}
      />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="connect-theme">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Router />
          <ChatbotButton />
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}



export default App;
