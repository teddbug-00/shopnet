import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon 
} from '@heroicons/react/24/solid';
import React from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: AlertVariant;
  show?: boolean;
}

export const Alert = ({ 
  title, 
  children, 
  variant = 'info',
  show = true
}: AlertProps) => {
  // Type-specific styling (similar to Snackbar)
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
  
  // Icons based on type
  const icons = {
    success: <CheckCircleIcon className="w-5 h-5" />,
    error: <XCircleIcon className="w-5 h-5" />,
    info: <InformationCircleIcon className="w-5 h-5" />,
    warning: <ExclamationTriangleIcon className="w-5 h-5" />
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`rounded-xl border ${typeStyles[variant].bg} ${typeStyles[variant].border} ${typeStyles[variant].text} p-4`}
        >
          <div className="flex">
            <div className={`flex-shrink-0 ${typeStyles[variant].icon}`}>
              {icons[variant]}
            </div>
            <div className="ml-3 flex-1">
              {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
              <div className="text-sm">{children}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};