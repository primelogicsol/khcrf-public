import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    subtext?: string;
}

export default function Textarea({ label, error, subtext, className = "", ...props }: TextareaProps) {
    return (
        <div className="w-full">
            <label className="block text-sm font-bold text-gray-900 mb-2">
                {label} {props.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                className={`w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all placeholder:text-gray-500 ${className} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : ""
                    }`}
                {...props}
            />
            {subtext && !error && <p className="text-gray-500 text-xs mt-1">{subtext}</p>}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
