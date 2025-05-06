import { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  loadingText?: string;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  iconPosition = "left",
  loading = false,
  loadingText,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: `
      bg-primary text-white
      enabled:hover:bg-primary-dark enabled:active:bg-primary-dark
      dark:bg-primary dark:enabled:hover:opacity-90
      disabled:opacity-60
      shadow-sm
    `,
    secondary: `
      bg-gray-50 text-gray-800 border border-gray-200
      enabled:hover:bg-gray-100 enabled:active:bg-gray-100
      dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:enabled:hover:bg-gray-700
      disabled:opacity-60
      shadow-sm
    `,
    danger: `
      bg-red-500 text-white
      enabled:hover:bg-red-600 enabled:active:bg-red-600
      disabled:opacity-60
      shadow-sm
    `,
    ghost: `
      bg-transparent text-gray-700
      enabled:hover:bg-gray-100 enabled:active:bg-gray-100
      dark:text-gray-300 dark:enabled:hover:bg-gray-800/50
      disabled:opacity-60
    `,
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const isIconOnly = icon && !children;

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`
        inline-flex items-center justify-center
        font-medium
        rounded-lg
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${isIconOnly ? "aspect-square p-0 !px-2" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner
            size={size === "sm" ? "sm" : "md"}
            className={loadingText ? "mr-2" : ""}
          />
          {loadingText}
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && !isIconOnly && (
            <span className="mr-2">{icon}</span>
          )}
          {children}
          {icon && iconPosition === "right" && !isIconOnly && (
            <span className="ml-2">{icon}</span>
          )}
          {isIconOnly && icon}
        </>
      )}
    </motion.button>
  );
};