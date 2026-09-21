import React from "react";
import { FaSpinner } from "react-icons/fa";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
}

export default function Button({
  children,
  isLoading,
  variant = "primary",
  icon,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-5 py-2 text-sm font-medium rounded-[24px] transition-all flex items-center gap-2 justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "text-white bg-brand-primary hover:bg-brand-primary/90 shadow-brand-primary/25",
    secondary: "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50",
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? <FaSpinner className="animate-spin" /> : icon}
      {children}
    </button>
  );
}
