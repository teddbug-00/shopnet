import { useState } from "react";
import { Button } from "../common/Button";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { updateNotificationPreferences } from "../../features/settings/settingsSlice";
import { useSnackbar } from "../../context/SnackbarContext";

export const NotificationsPanel = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.settings);
  const { showSnackbar } = useSnackbar();

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: user?.profile?.emailNotifications ?? true,
    orderUpdates: user?.profile?.orderUpdates ?? true,
    promotionalEmails: user?.profile?.promotionalEmails ?? false,
  });

  const handleToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateNotificationPreferences(notificationSettings));
      showSnackbar("Notification preferences updated successfully", "success");
    } catch (error: any) {
      showSnackbar(error.message || "Failed to update notification preferences", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* The form content remains the same */}
      <div className="space-y-4">
        {/* Email Notifications Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Email Notifications
            </h3>
            <p className="text-sm text-gray-500">
              Receive notifications about your account via email
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle("emailNotifications")}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none
              ${notificationSettings.emailNotifications ? "bg-primary" : "bg-gray-200"}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow
                ring-0 transition duration-200 ease-in-out
                ${notificationSettings.emailNotifications ? "translate-x-5" : "translate-x-0"}
              `}
            />
          </button>
        </div>

        {/* Order Updates Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Order Updates
            </h3>
            <p className="text-sm text-gray-500">
              Get notified about your order status changes
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle("orderUpdates")}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none
              ${notificationSettings.orderUpdates ? "bg-primary" : "bg-gray-200"}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow
                ring-0 transition duration-200 ease-in-out
                ${notificationSettings.orderUpdates ? "translate-x-5" : "translate-x-0"}
              `}
            />
          </button>
        </div>

        {/* Promotional Emails Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Promotional Emails
            </h3>
            <p className="text-sm text-gray-500">
              Receive emails about new products and special offers
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleToggle("promotionalEmails")}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
              transition-colors duration-200 ease-in-out focus:outline-none
              ${notificationSettings.promotionalEmails ? "bg-primary" : "bg-gray-200"}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow
                ring-0 transition duration-200 ease-in-out
                ${notificationSettings.promotionalEmails ? "translate-x-5" : "translate-x-0"}
              `}
            />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </form>
  );
};
