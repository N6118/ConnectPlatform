import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OTPInputState {
  otp: string[];
  isLoading: boolean;
  message: string;
  timeLeft: number;
}

export default function OTPVerification() {
  const [state, setState] = useState<OTPInputState>({
    otp: ["", "", "", "", "", ""],
    isLoading: false,
    message: "",
    timeLeft: 300, // 5 minutes in seconds
  });
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setState(prev => ({
        ...prev,
        timeLeft: Math.max(0, prev.timeLeft - 1)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...state.otp];
    newOtp[index] = value;
    setState(prev => ({ ...prev, otp: newOtp }));

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!state.otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = [...state.otp];

    [...pastedData].forEach((char, index) => {
      if (/\d/.test(char) && index < 6) {
        newOtp[index] = char;
      }
    });

    setState(prev => ({ ...prev, otp: newOtp }));
    if (inputRefs.current[pastedData.length - 1]) {
      inputRefs.current[pastedData.length - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isLoading: true, message: "" }));

    const otpCode = state.otp.join("");
    if (otpCode.length !== 6) {
      setState(prev => ({ ...prev, message: "Please enter all 6 digits.", isLoading: false }));
      return;
    }

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "OTP verified successfully. Redirecting...",
        });
        setLocation("/reset-password");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.message || "Invalid OTP. Please try again.",
        });
        setState(prev => ({ 
          ...prev, 
          otp: ["", "", "", "", "", ""],
          message: "Invalid OTP. Please try again." 
        }));
        // Focus first input after error
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleResendOTP = () => {
    if (state.timeLeft > 0) return;
    setState(prev => ({ ...prev, timeLeft: 300 }));
    //  This part needs further implementation to actually resend the OTP.  
    //  For now, it just resets the timer.  A backend call would be needed here.
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-50 to-white p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white shadow-2xl rounded-3xl p-12 border border-gray-200 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-blue-500" />
        <div className="text-center mb-6">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent"
          >
            Enter OTP Code
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="mt-2 text-sm text-gray-600"
          >
            A 6-digit code has been sent to your email.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className={`mt-2 text-sm ${state.timeLeft < 60 ? 'text-red-600' : 'text-gray-600'}`}
          >
            Code expires in: {formatTime(state.timeLeft)}
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
          onSubmit={handleVerifyOTP}
        >
          <div className="flex justify-center space-x-3">
            {state.otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                aria-label={`Digit ${index + 1} of OTP`}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={state.isLoading}
            className={`w-full py-3 px-4 rounded-xl text-white font-medium tracking-wide 
              ${state.isLoading ? "bg-indigo-400" : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400"}
              focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 shadow-lg flex items-center justify-center gap-2`}
          >
            {state.isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Verify OTP</span>
              </>
            )}
          </motion.button>

          {state.message && <p className="text-center text-sm text-red-600 mt-2">{state.message}</p>}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-center mt-6"
          >
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={state.timeLeft > 0}
              className={`group inline-flex items-center text-sm transition
                ${state.timeLeft > 0 
                  ? "text-gray-400 cursor-not-allowed" 
                  : "text-indigo-600 hover:text-indigo-500"}`}
            >
              Resend OTP Code
              <ArrowRight className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}