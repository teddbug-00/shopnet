import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

export const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  // Format date to be more readable
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ComponentType<any>;
    label: string;
    value?: string;
  }) => (
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-gray-900 dark:text-white font-medium">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Profile
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              View your profile information
            </p>
          </div>
          <Button onClick={() => navigate("/dashboard/settings")}>
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="p-6 lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
                {user?.profile?.profileImage ? (
                  <img
                    src={user.profile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-medium text-gray-400">
                    {user?.name?.[0] || user?.email?.[0] || "?"}
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {user?.name}
              </h2>
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-primary dark:text-primary-light">
                  {user?.accountType === "seller" ? "Seller" : "Buyer"}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </Card>

          {/* Details Card */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem icon={EnvelopeIcon} label="Email" value={user?.email} />
              <InfoItem
                icon={PhoneIcon}
                label="Phone"
                value={user?.profile?.phone}
              />
              <InfoItem
                icon={MapPinIcon}
                label="Address"
                value={user?.profile?.address}
              />
              {user?.accountType === "seller" && (
                <InfoItem
                  icon={BuildingStorefrontIcon}
                  label="Business Name"
                  value={user?.profile?.businessName}
                />
              )}
            </div>

            {user?.accountType === "seller" &&
              user?.profile?.businessDescription && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Business Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.profile.businessDescription}
                  </p>
                </div>
              )}

            {/* Account Statistics */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user?.accountType === "seller" ? (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-primary">0</p>
                      <p className="text-sm text-gray-500">Products Listed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-primary">0</p>
                      <p className="text-sm text-gray-500">Total Sales</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-primary">0</p>
                      <p className="text-sm text-gray-500">Active Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-primary">0</p>
                      <p className="text-sm text-gray-500">Reviews</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-primary">0</p>
                      <p className="text-sm text-gray-500">Total Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-primary">0</p>
                      <p className="text-sm text-gray-500">Wishlisted Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-primary">0</p>
                      <p className="text-sm text-gray-500">Reviews Given</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-primary">0</p>
                      <p className="text-sm text-gray-500">Active Orders</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
