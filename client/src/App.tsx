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

// Admin pages
import AdminDashboard from "@/pages/admin/dashboard";
import { default as AdminClubs } from "@/pages/admin/clubs";
import { default as AdminProjects } from "@/pages/admin/projects";
import { default as AdminProfile } from "@/pages/admin/profile";

// Faculty pages
import FacultyDashboard from "@/pages/faculty/dashboard";
import { default as FacultyClubs } from "@/pages/faculty/clubs";
import { default as FacultyProjects } from "@/pages/faculty/projects";
import { default as FacultyProfile } from "@/pages/faculty/profile";
import { default as FacultyMessaging } from "@/pages/faculty/messaging";

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-credentials" component={ForgotCredentials} />
      <Route path="/otp-verification" component={OTPVerification} />
      <Route path="/reset-password" component={ResetPassword} />

      {/* Admin Routes */}
      <Route
        path="/admin"
        component={() => <Route component={AdminDashboard} roles={["admin"]} />}
      />
      <Route
        path="/admin/clubs"
        component={() => <Route component={AdminClubs} roles={["admin"]} />}
      />
      <Route
        path="/admin/projects"
        component={() => <Route component={AdminProjects} roles={["admin"]} />}
      />
      <Route
        path="/admin/profile"
        component={() => <Route component={AdminProfile} roles={["admin"]} />}
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
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
