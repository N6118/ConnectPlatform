import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/App";
import { authService } from "@/services/auth";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password must be at least 1 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();
  const [_, navigate] = useLocation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      console.log('Starting login process...'); // Debug log
      const response = await authService.login({
        username: data.username,
        password: data.password,
      });

      console.log('Login response:', response); // Debug log

      if (!response.success) {
        throw new Error(response.error || "Invalid username or password");
      }

      // Show success message
      toast({
        title: "Success!",
        description: `Welcome back, ${response.data?.user?.name || data.username}!`,
      });

      // Login user with the auth context
      if (auth && response.data?.user) {
        // Ensure role is lowercase before passing to auth context
        const userWithNormalizedRole = {
          ...response.data.user,
          role: response.data.user.role.toLowerCase() as "admin" | "faculty" | "student"
        };

        console.log('Calling auth.login with user:', userWithNormalizedRole); // Debug log
        console.log('User role before login:', userWithNormalizedRole.role); // Debug log

        auth.login(userWithNormalizedRole);
      } else {
        console.error('Auth context or user data missing:', { auth, user: response.data?.user }); // Debug log
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Invalid username or password",
      });

      // Only reset the password field on authentication failure
      form.setValue("password", "");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full bg-white shadow-2xl rounded-3xl flex items-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-blue-500" />

        <motion.div className="w-full p-8 md:p-12">
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 mb-4"
            >
              <LogIn className="w-6 h-6 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Connect
              </span>
            </motion.div>
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent"
            >
              Welcome Back
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="mt-2 text-sm text-gray-600"
            >
              Log in to access your account
            </motion.p>
          </div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
            onSubmit={form.handleSubmit(handleLogin)}
          >
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                {...form.register("username")}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300"
                placeholder="Enter your username"
                disabled={isLoading}
              />
              {form.formState.errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-white font-medium tracking-wide bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 transition duration-300 shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </motion.button>

            <motion.div className="text-center mt-6">
              <button
                type="button"
                onClick={() => navigate("/forgot-credentials")}
                className="text-indigo-600 hover:text-indigo-500 transition"
              >
                Forgot your password?
              </button>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
}