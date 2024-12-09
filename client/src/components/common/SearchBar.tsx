import { useState, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = () => {
    setIsExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="relative flex items-center">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            initial={{ width: 40, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative flex items-center"
          >
            <MagnifyingGlassIcon className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              className="w-full pl-10 pr-4 h-10 rounded-full
                       bg-gray-100 dark:bg-gray-800
                       border border-transparent
                       focus:border-primary focus:bg-white
                       dark:focus:bg-gray-900
                       focus:ring-2 focus:ring-primary/20
                       text-gray-900 dark:text-white
                       placeholder-gray-500 dark:placeholder-gray-400
                       transition-all duration-200"
              placeholder="Search products..."
              onChange={(e) => onSearch(e.target.value)}
              onBlur={(e) => {
                if (!e.target.value) {
                  setIsExpanded(false);
                }
              }}
            />
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSearchClick}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800
                     transition-colors duration-200"
          >
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
