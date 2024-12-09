import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../features/auth/authSlice";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export const Avatar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    {
      icon: UserCircleIcon,
      label: "Profile",
      onClick: () => navigate("/dashboard/profile"),
    },
    {
      icon: ShoppingBagIcon,
      label: "Products",
      onClick: () => navigate("/dashboard/products"),
    },
    {
      icon: Cog6ToothIcon,
      label: "Settings",
      onClick: () => navigate("/dashboard/settings"),
    },
    {
      icon: ArrowRightOnRectangleIcon,
      label: "Sign out",
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center focus:outline-none">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/10 dark:ring-black/10"
        >
          {user?.profile?.profileImage ? (
            <img
              src={user.profile.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full bg-gradient-to-br from-primary to-primary-dark
                         text-white flex items-center justify-center text-sm font-medium"
            >
              {user?.name?.[0] || user?.email?.[0] || "?"}
            </div>
          )}
        </motion.div>
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl
                           bg-white dark:bg-[#1C1C1E] shadow-lg ring-1 ring-black/5
                           dark:ring-white/5 focus:outline-none"
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    className={`
                      w-full px-4 py-2 text-sm flex items-center space-x-2
                      ${active ? "bg-gray-50 dark:bg-gray-800/50" : ""}
                      ${
                        item.danger
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-700 dark:text-gray-300"
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
