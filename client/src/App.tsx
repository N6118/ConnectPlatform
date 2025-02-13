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
import AdminDashboard from "@/pages/admin/dashboard";
import FacultyDashboard from "@/pages/faculty/dashboard";
import StudentDashboard from "@/pages/student/dashboard";
import AdminNavbar from "@/components/navigation/AdminNavbar";
import FacultyNavbar from "@/components/navigation/FacultyNavbar";
import StudentNavbar from "@/components/navigation/StudentNavbar";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "@/lib/auth";
import { useLocation } from "wouter";
import Clubs from "@/pages/Clubs";
import ClubDetail from "@/pages/ClubDetail";
import MySpace from "@/pages/MySpace";
import ProjectDetails from "@/pages/ProjectDetails";
import Projects from "@/pages/Projects";
import MessagingPage from "@/pages/MessagingPage";
import MyProfile from "@/pages/Profile";
import SearchResults from "@/pages/SearchResults";


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

function RoleBasedLayout({ children }: { children: React.ReactNode }) {
  const { userRole } = useAuth();
  const [location] = useLocation();

  const hideNavbarPaths = [
    "/login",
    "/forgot-credentials",
    "/otp-verification",
    "/reset-password",
    "/",
  ];

  if (hideNavbarPaths.includes(location)) {
    return <>{children}</>;
  }

  const NavbarComponent = {
    admin: AdminNavbar,
    faculty: FacultyNavbar,
    student: StudentNavbar,
  }[userRole];

  return (
    <>
      {NavbarComponent && <NavbarComponent />}
      {children}
    </>
  );
}

function Router() {
  return (
    <RoleBasedLayout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/forgot-credentials" component={ForgotCredentials} />
        <Route path="/otp-verification" component={OTPVerification} />
        <Route path="/reset-password" component={ResetPassword} />

        {/* Admin Routes */}
        <Route 
          path="/admin"
          component={() => (
            <PrivateRoute component={AdminDashboard} roles={["admin"]} />
          )}
        />

        {/* Faculty Routes */}
        <Route
          path="/faculty"
          component={() => (
            <PrivateRoute component={FacultyDashboard} roles={["faculty"]} />
          )}
        />

        {/* Student Routes */}
        <Route
          path="/student"
          component={() => (
            <PrivateRoute component={StudentDashboard} roles={["student"]} />
          )}
        />
        <Route path="/clubs" component={Clubs} />
        <Route path="/clubs/:id" component={ClubDetail} />
        <Route path="/my-space" component={MySpace} />
        <Route path="/project/:title" component={ProjectDetails} />
        <Route path="/projects" component={Projects} />
        <Route path="/messages" component={MessagingPage} />
        <Route path="/search" component={SearchResults} />
        <Route path="/profile" component={MyProfile} />
        <Route component={NotFound} />
      </Switch>
    </RoleBasedLayout>
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