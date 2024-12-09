import { motion } from 'framer-motion';
import { scaleUp } from '../../utils/animations';

export type BadgeVariant = 'warning' | 'primary' | 'success' | 'danger' | 'default';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export const Badge = ({ 
  children, 
  variant = 'primary',
  size = 'md' 
}: BadgeProps) => {
const variants: Record<BadgeVariant, string> = {
    primary: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light',
    success: 'bg-success/10 text-success dark:bg-success/20 dark:text-success',
    warning: 'bg-warning/10 text-warning dark:bg-warning/20 dark:text-warning',
    danger: 'bg-danger/10 text-danger dark:bg-danger/20 dark:text-danger',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <motion.span
      {...scaleUp}
      className={`
        inline-flex items-center font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      {children}
    </motion.span>
  );
};