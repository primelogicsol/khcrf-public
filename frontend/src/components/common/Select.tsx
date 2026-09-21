import React from "react";

interface Option {
  value: string;
  label: string;
}

export interface OptionGroup {
  label: string;
  options: Option[];
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[] | OptionGroup[];
  error?: string;
  subtext?: string;
  labelAction?: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, options, error, subtext, labelAction, className = "", ...props },
    ref,
  ) => {
    // Helper to determine if options are grouped
    const isGrouped = options.length > 0 && 'options' in options[0];

    return (
      <div className="w-full">
        {(label || labelAction) && (
          <div className="flex justify-between items-center mb-2">
            {label && (
              <label className="block text-sm font-bold text-gray-900">
                {label}{" "}
                {props.required && <span className="text-red-500">*</span>}
              </label>
            )}
            {labelAction}
          </div>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all appearance-none ${className} ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : ""
            }`}
            {...props}
          >
            {isGrouped 
              ? (options as OptionGroup[]).map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                ))
              : (options as Option[]).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
            }
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {subtext && !error && (
          <p className="text-gray-500 text-xs mt-1">{subtext}</p>
        )}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
