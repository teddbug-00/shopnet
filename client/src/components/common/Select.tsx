import { SelectHTMLAttributes, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helper, options, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            block w-full rounded-lg border pl-4 pr-10 py-2 text-sm
            shadow-sm
            appearance-none bg-white dark:bg-gray-900
            ${error 
              ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-700 focus:ring-primary/20 focus:border-primary dark:focus:border-primary'
            }
            focus:outline-none focus:ring-2
            text-gray-900 dark:text-white
            disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:opacity-70 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <AnimatePresence>
          {(error || helper) && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-sm ${error ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
            >
              {error || helper}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Select.displayName = 'Select';