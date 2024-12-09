import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useAppSelector } from "../../store/hooks";
import { Avatar } from "./Avatar";

export const Navbar = () => {
  const location = useLocation();
  const { token, user } = useAppSelector((state) => state.auth);
  const isAuthenticated = !!token;
  const isAccountSetup = location.pathname === "/account-setup";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="h-16 backdrop-blur-apple bg-white/70 dark:bg-[#1C1C1E]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
                SN
              </div>
            </Link>

            {/* Center Links (for non-authenticated pages) */}
            {!isAuthenticated || isAccountSetup ? (
              <div className="hidden sm:flex items-center space-x-8">
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === "/login"
                      ? "text-primary dark:text-primary-light"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === "/register"
                      ? "text-primary dark:text-primary-light"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  }`}
                >
                  Create account
                </Link>
              </div>
            ) : (
              <div className="flex-1" /> // Spacer for authenticated state
            )}

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {isAuthenticated && !isAccountSetup ? (
                <>
                  <ThemeToggle />
                  <Avatar />
                </>
              ) : (
                <>
                  {/* Mobile Auth Links */}
                  <div className="sm:hidden flex items-center space-x-4">
                    <Link
                      to="/login"
                      className={`text-sm font-medium ${
                        location.pathname === "/login"
                          ? "text-primary dark:text-primary-light"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      Sign in
                    </Link>
                  </div>
                  <ThemeToggle />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation (for auth pages) */}
      {!isAuthenticated && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1C1C1E] border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-2 h-16">
            <Link
              to="/login"
              className={`flex items-center justify-center text-sm font-medium ${
                location.pathname === "/login"
                  ? "text-primary dark:text-primary-light"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className={`flex items-center justify-center text-sm font-medium ${
                location.pathname === "/register"
                  ? "text-primary dark:text-primary-light"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Create account
            </Link>
          </div>
        </div>
      )}
    </motion.nav>
  );
};
