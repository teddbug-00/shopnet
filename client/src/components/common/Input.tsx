import { forwardRef, InputHTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      leftIcon,
      rightIcon,
      className = "",
      containerClassName = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`space-y-1 ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                {leftIcon}
              </span>
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            className={`
              block w-full rounded-lg
              ${leftIcon ? "pl-10" : "pl-4"}
              ${rightIcon || error ? "pr-10" : "pr-4"}
              py-2 sm:text-sm
              border transition-colors duration-200
              ${
                error
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-700"
                  : "border-gray-300 dark:border-gray-700 focus:ring-primary/20 focus:border-primary dark:focus:border-primary"
              }
              ${
                disabled
                  ? "bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed"
                  : "bg-white dark:bg-gray-900"
              }
              placeholder-gray-400 dark:placeholder-gray-500
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-opacity-100
              shadow-sm
              ${className}
            `}
            disabled={disabled}
            {...props}
          />

          {/* Right Icon or Error Icon */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {error ? (
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            ) : (
              rightIcon && (
                <span className="text-gray-500 dark:text-gray-400">
                  {rightIcon}
                </span>
              )
            )}
          </div>
        </div>

        {/* Error or Helper Text */}
        <AnimatePresence mode="wait">
          {(error || helper) && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-sm ${
                error ? "text-red-500" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {error || helper}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

Input.displayName = "Input";