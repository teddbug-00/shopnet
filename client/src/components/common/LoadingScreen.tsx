import { motion } from "framer-motion";
import { Spinner } from "./Spinner";

export const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#1C1C1E]"
    >
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold animate-pulse">
          SN
        </div>
        <div className="mt-6">
          <Spinner size="lg" className="text-primary" />
        </div>
      </div>
    </motion.div>
  );
};
