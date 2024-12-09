import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '../../utils/animations';

interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  show?: boolean;
}

export const Alert = ({ 
  title, 
  children, 
  variant = 'info',
  show = true
}: AlertProps) => {
  const variants = {
    info: 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-light dark:border-primary/30',
    success: 'bg-success/10 text-success border-success/20 dark:bg-success/20 dark:border-success/30',
    warning: 'bg-warning/10 text-warning border-warning/20 dark:bg-warning/20 dark:border-warning/30',
    error: 'bg-danger/10 text-danger border-danger/20 dark:bg-danger/20 dark:border-danger/30',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          {...fadeIn}
          className={`rounded-xl border p-4 ${variants[variant]}`}
        >
          {title && <h3 className="text-sm font-semibold mb-1">{title}</h3>}
          <div className="text-sm">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 