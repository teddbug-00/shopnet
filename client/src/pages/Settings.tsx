import { useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card } from "../components/common/Card";
import { Alert } from "../components/common/Alert";
import { Tab } from "@headlessui/react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { clearSettingsState } from "../features/settings/settingsSlice";
import { ProfilePanel } from "../components/settings/ProfilePanel";
import { PasswordPanel } from "../components/settings/PasswordPanel";
import { NotificationsPanel } from "../components/settings/NotificationsPanel";

const Settings = () => {
  const dispatch = useAppDispatch();
  const { error, success } = useAppSelector((state) => state.settings);

  useEffect(() => {
    return () => {
      dispatch(clearSettingsState());
    };
  }, [dispatch]);

  const tabs = [
    { name: "Profile", component: ProfilePanel },
    { name: "Password", component: PasswordPanel },
    { name: "Notifications", component: NotificationsPanel },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {error && (
          <Alert variant="error" show={!!error}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" show={!!success}>
            {success}
          </Alert>
        )}

        <Tab.Group>
          <Card>
            <div className="border-b border-gray-200 dark:border-gray-800">
              <Tab.List className="flex space-x-8 px-4">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) => `
                      py-4 px-1 border-b-2 font-medium text-sm outline-none
                      ${
                        selected
                          ? "border-primary text-primary dark:border-primary-light dark:text-primary-light"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }
                    `}
                  >
                    {tab.name}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="p-6">
              {tabs.map((tab) => (
                <Tab.Panel key={tab.name}>
                  <tab.component />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Card>
        </Tab.Group>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
