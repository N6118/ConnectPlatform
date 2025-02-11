import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

interface ForgotCredentialsFormData {
  email: string;
}

export default function ForgotCredentials() {
  const [formData, setFormData] = useState<ForgotCredentialsFormData>({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [_, setLocation] = useLocation();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/forgot-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("A verification code has been sent to your email.");
        setTimeout(() => {
          setLocation("/otp-verification");
        }, 1500);
      } else {
        setError(data.message || "Failed to send recovery email.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
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
        className="max-w-2xl w-full bg-white shadow-2xl rounded-3xl p-12 border border-gray-200 relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-blue-500" />
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60" />

        <div className="text-center mb-6">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent"
          >
            Forgot Credentials?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="mt-2 text-sm text-gray-600"
          >
            Enter your university email to receive a verification code.
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
          onSubmit={handleResetRequest}
        >
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              University Email
            </label>
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ email: e.target.value })}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-300"
                placeholder="Enter your university email"
              />
              <Mail className="absolute inset-y-3 right-3 w-5 h-5 text-gray-500" />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl text-white font-medium tracking-wide 
              ${isLoading ? "bg-indigo-400" : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400"}
              focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 shadow-lg flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                <span>Send OTP Code</span>
              </>
            )}
          </motion.button>

          {/* Success/Error Messages */}
          {message && <p className="text-center text-sm text-green-600 mt-2">{message}</p>}
          {error && <p className="text-center text-sm text-red-600 mt-2">{error}</p>}

          {/* Back to Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-center mt-6"
          >
            <button
              type="button"
              onClick={() => setLocation("/login")}
              className="group inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 transition"
            >
              Back to Login
              <ArrowRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}
