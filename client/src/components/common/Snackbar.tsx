import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/solid";

export type SnackbarType = "success" | "error" | "info" | "warning";

interface SnackbarProps {
  open: boolean;
  message: string;
  type?: SnackbarType;
  onClose: () => void;
  autoHideDuration?: number;
}

export const Snackbar = ({ 
  open, 
  message, 
  type = "info", 
  onClose,
  autoHideDuration = 5000
}: SnackbarProps) => {
  // Clean up event handler function
  const handleClose = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);
  
  // Auto-close after duration
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [open, handleClose, autoHideDuration]);

  // Don't render if not open
  if (!open) return null;
  
  // Icons based on type
  const icons = {
    success: <CheckCircleIcon className="w-5 h-5" />,
    error: <XCircleIcon className="w-5 h-5" />,
    info: <InformationCircleIcon className="w-5 h-5" />,
    warning: <ExclamationTriangleIcon className="w-5 h-5" />
  };
  
  // Type-specific styling
  const typeStyles = {
    success: {
      bg: "bg-green-50 dark:bg-green-900/30",
      border: "border-green-500/20 dark:border-green-500/30",
      text: "text-green-800 dark:text-green-200",
      icon: "text-green-500"
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/30",
      border: "border-red-500/20 dark:border-red-500/30",
      text: "text-red-800 dark:text-red-200",
      icon: "text-red-500"
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/30",
      border: "border-blue-500/20 dark:border-blue-500/30",
      text: "text-blue-800 dark:text-blue-200",
      icon: "text-blue-500"
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-900/30",
      border: "border-amber-500/20 dark:border-amber-500/30",
      text: "text-amber-800 dark:text-amber-200",
      icon: "text-amber-500"
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="fixed top-4 left-0 right-0 z-50 flex justify-center items-start px-4"
    >
      <div 
        className={`
          flex items-center rounded-lg shadow-lg 
          ${typeStyles[type].bg} ${typeStyles[type].border} ${typeStyles[type].text}
          border py-3 px-4 max-w-md backdrop-blur-sm
        `}
      >
        <div className={`mr-3 flex-shrink-0 ${typeStyles[type].icon}`}>
          {icons[type]}
        </div>
        <div className="mr-3 flex-grow text-sm font-medium">
          {message}
        </div>
        <button 
          onClick={handleClose}
          className="group rounded-md p-1.5 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50"
          type="button"
          aria-label="Close"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
        </button>
      </div>
    </motion.div>
  );
};