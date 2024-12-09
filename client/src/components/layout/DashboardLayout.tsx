import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "../../store/hooks";
import { ThemeToggle } from "../common/ThemeToggle";
import { Avatar } from "../common/Avatar";
import { Footer } from "../common/Footer";
import {
  HomeIcon,
  ShoppingBagIcon,
  UserIcon,
  CogIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface SidebarItem {
  name: string;
  icon: React.ComponentType<any>;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { name: "Overview", icon: HomeIcon, path: "/dashboard" },
  { name: "Products", icon: ShoppingBagIcon, path: "/dashboard/products" },
  { name: "Profile", icon: UserIcon, path: "/dashboard/profile" },
  { name: "Settings", icon: CogIcon, path: "/dashboard/settings" },
];

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [notifications] = useState(3);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const NotificationsButton = () => (
    <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
      <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
      {notifications > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
          {notifications}
        </span>
      )}
    </button>
  );

  const SidebarLink = ({ item }: { item: SidebarItem }) => (
    <Link
      to={item.path}
      onClick={() => setIsSidebarOpen(false)}
      className={`
        flex items-center px-4 py-3 rounded-xl transition-colors duration-200
        ${
          location.pathname === item.path
            ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }
      `}
    >
      <item.icon className="w-5 h-5 mr-3" />
      <span className="text-sm font-medium">{item.name}</span>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#141414]">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-apple bg-white/70 dark:bg-[#1C1C1E]/70">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? (
                  <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold ml-4">
                SN
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationsButton />
              <ThemeToggle />
              <Avatar />
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] w-64
          bg-white dark:bg-[#1C1C1E] border-r border-gray-200 dark:border-gray-800
          z-30 transition-transform duration-300 ease-in-out
          transform lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Menu
            </h2>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <SidebarLink key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={`
          flex-1 transition-all duration-300 ease-in-out
                    pt-24 pb-8 px-4 sm:px-6 lg:px-8
                    lg:pl-72
        `}
      >
        {children}
      </main>

      {/* Footer */}
      <div className="lg:pl-64">
        <Footer />
      </div>
    </div>
  );
};
