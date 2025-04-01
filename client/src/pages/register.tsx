import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { UserPlus, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

// Schema for register form validation
const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    name: z.string().min(1, "Name is required"),
    password: z.string()
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [_, navigate] = useLocation();

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            name: "",
            password: "root",
        },
    });

    const handleRegister = async (data: RegisterFormData) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            console.log('Starting registration process...'); // Debug log

            // Use direct fetch instead of the api utility to avoid path concatenation issues
            const response = await fetch('http://connectbeta-env-1.eba-ht35jqzk.eu-north-1.elasticbeanstalk.com/api/auth/guest/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            console.log('Registration response:', responseData); // Debug log

            if (!response.ok) {
                throw new Error(responseData.message || "Registration failed");
            }

            // Show success message
            toast({
                title: "Registration Successful!",
                description: `Welcome, ${data.name}! You can now log in with your credentials.`,
            });

            // Redirect to login page
            navigate("/login");
        } catch (error) {
            console.error("Registration error:", error);
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description:
                    error instanceof Error
                        ? error.message
                        : "Could not complete registration. Please try again.",
            });
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
                            <UserPlus className="w-6 h-6 text-indigo-600" />
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
                            Create Account
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7 }}
                            className="mt-2 text-sm text-gray-600"
                        >
                            Join the Connect platform
                        </motion.p>
                    </div>

                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                        onSubmit={form.handleSubmit(handleRegister)}
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
                                placeholder="Choose a username"
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
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...form.register("email")}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300"
                                placeholder="Enter your email address"
                                disabled={isLoading}
                            />
                            {form.formState.errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Full Name
                            </label>
                            <input
                                id="name"
                                {...form.register("name")}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300"
                                placeholder="Enter your full name"
                                disabled={isLoading}
                            />
                            {form.formState.errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {form.formState.errors.name.message}
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
                            {isLoading ? "Registering..." : "Register"}
                        </motion.button>

                        <motion.div className="text-center mt-6 flex justify-center">
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-indigo-600 hover:text-indigo-500 transition flex items-center gap-1"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Already have an account? Log in
                            </button>
                        </motion.div>
                    </motion.form>
                </motion.div>
            </motion.div>
        </div>
    )
} 