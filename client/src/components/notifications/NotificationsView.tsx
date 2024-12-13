import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  markAsRead,
  markAllAsRead,
} from "../../features/notifications/notificationsSlice";
import {
  ArrowLeftIcon,
  CheckIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import { LoadingScreen } from "../common/LoadingScreen";

export const NotificationsView = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    items: notifications,
    isLoading,
    unreadCount,
  } = useAppSelector((state) => state.notifications);

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="text-sm text-primary hover:text-primary-dark dark:text-primary-light transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <BellIcon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notifications
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              You're all caught up!
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`
                p-4 rounded-xl transition-colors
                ${
                  notification.read
                    ? "bg-white dark:bg-gray-800"
                    : "bg-primary/5 dark:bg-primary/10"
                }
                hover:bg-gray-50 dark:hover:bg-gray-700/50
              `}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {notification.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => dispatch(markAsRead(notification.id))}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <CheckIcon className="w-5 h-5 text-primary dark:text-primary-light" />
                  </button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
