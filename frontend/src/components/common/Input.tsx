import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  subtext?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, subtext, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold text-gray-900 mb-2">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all placeholder:text-gray-500 ${className} ${
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-200"
              : ""
          }`}
          {...props}
        />
        {subtext && !error && (
          <p className="text-gray-500 text-xs mt-1">{subtext}</p>
        )}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
