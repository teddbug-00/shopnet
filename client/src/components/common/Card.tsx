import { motion } from "framer-motion";
import { scaleUp } from "../../utils/animations";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "glass";
}

export const Card = ({
  children,
  className = "",
  variant = "solid",
}: CardProps) => {
  return (
    <motion.div
      {...scaleUp}
      className={`
        rounded-2xl
        ${
          variant === "glass"
            ? "bg-white/70 dark:bg-black/70 backdrop-blur-apple border border-white/20 dark:border-black/20"
            : "bg-white dark:bg-[#1C1C1E] shadow-apple dark:shadow-apple-dark"
        }
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};
