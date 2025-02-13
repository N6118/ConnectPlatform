import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { FacultyLayout } from "@/components/layouts/FacultyLayout";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import MySpace from "@/pages/MySpace";
import Clubs from "@/pages/Clubs";
import Projects from "@/pages/Projects";
import Profile from "@/pages/Profile";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Switch>
          {/* Public routes */}
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          
          {/* Student routes */}
          <Route path="/student">
            {() => (
              <StudentLayout>
                <Switch>
                  <Route path="/student/myspace" component={MySpace} />
                  <Route path="/student/clubs" component={Clubs} />
                  <Route path="/student/projects" component={Projects} />
                  <Route path="/student/profile" component={Profile} />
                  <Route component={NotFound} />
                </Switch>
              </StudentLayout>
            )}
          </Route>

          {/* Faculty routes */}
          <Route path="/faculty">
            {() => (
              <FacultyLayout>
                <Switch>
                  <Route path="/faculty/myspace" component={MySpace} />
                  <Route path="/faculty/clubs" component={Clubs} />
                  <Route path="/faculty/projects" component={Projects} />
                  <Route path="/faculty/profile" component={Profile} />
                  <Route component={NotFound} />
                </Switch>
              </FacultyLayout>
            )}
          </Route>

          {/* Admin routes */}
          <Route path="/admin">
            {() => (
              <AdminLayout>
                <Switch>
                  <Route path="/admin/myspace" component={MySpace} />
                  <Route path="/admin/clubs" component={Clubs} />
                  <Route path="/admin/projects" component={Projects} />
                  <Route path="/admin/profile" component={Profile} />
                  <Route component={NotFound} />
                </Switch>
              </AdminLayout>
            )}
          </Route>

          {/* Catch-all route */}
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
