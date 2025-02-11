import { Switch, Route } from "wouter";
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
import AdminDashboard from "@/pages/admin/dashboard";
import FacultyDashboard from "@/pages/faculty/dashboard";
import StudentDashboard from "@/pages/student/dashboard";
import Clubs from "@/pages/Clubs";
import Navbar from "@/components/Navbar";
import SearchResults from "@/pages/SearchResults";
import React, { createContext, useContext, useState } from "react";
import type { User } from "@/lib/auth";
import { useLocation } from "wouter";
import ClubDetail from "@/pages/ClubDetail";
import MySpace from "@/pages/MySpace";
import ProjectDetails from "@/pages/ProjectDetails";
import Projects from "@/pages/Projects";
import MessagingPage from "@/pages/MessagingPage";
import MyProfile from "@/pages/Profile";

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
  return <Component />;
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { userRole } = useAuth();
  const [location] = useLocation();

  const hideNavbarPaths = [
    "/login",
    "/forgot-credentials",
    "/otp-verification",
    "/reset-password",
    "/",
  ];
  const shouldShowNavbar = !hideNavbarPaths.includes(location);

  return (
    <>
      {shouldShowNavbar && <Navbar userRole={userRole} />}
      {children}
    </>
  );
}

function Router() {
  return (
    <AuthenticatedLayout>
      <Switch>
        <Route path="/" component={Landing as React.ComponentType} />
        <Route path="/login" component={Login} />
        <Route path="/forgot-credentials" component={ForgotCredentials} />
        <Route path="/otp-verification" component={OTPVerification} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/clubs" component={Clubs} />
        <Route path="/clubs/:id" component={ClubDetail} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/faculty" component={FacultyDashboard} />
        <Route path="/student" component={StudentDashboard} />
        <Route path="/my-space" component={MySpace} />
        <Route path="/project/:title" component={ProjectDetails} />
        <Route path="/projects" component={Projects} />
        <Route path="/messages" component={MessagingPage} />
        <Route path="/search" component={SearchResults} />
        <Route path="/profile" component={MyProfile} />
        <Route component={NotFound} />
      </Switch>
    </AuthenticatedLayout>
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