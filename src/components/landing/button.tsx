import { useLocation } from "wouter";
import { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  children, 
  variant = "default", 
  size = "default", 
  className = "", 
  ...props 
}: ButtonProps) {
  const [_, setLocation] = useLocation();

  const baseStyles = "font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const variantStyles = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
  };
  const sizeStyles = {
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={() => setLocation("/login")}
      {...props}
    >
      {children}
    </button>
  );
}