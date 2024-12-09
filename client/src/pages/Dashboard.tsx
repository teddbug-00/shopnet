import { useAppSelector } from "../store/hooks";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<any>;
}

const StatCard = ({ title, value, change, icon: Icon }: StatCardProps) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl">
          <Icon className="w-6 h-6 text-primary dark:text-primary-light" />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
        </div>
      </div>
      <Badge variant={change >= 0 ? "success" : "danger"} size="sm">
        <span className="flex items-center">
          {change >= 0 ? (
            <ArrowUpIcon className="w-3 h-3 mr-1" />
          ) : (
            <ArrowDownIcon className="w-3 h-3 mr-1" />
          )}
          {Math.abs(change)}%
        </span>
      </Badge>
    </div>
  </Card>
);

const RecentOrders = () => (
  <Card className="p-6">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Recent Orders
    </h2>
    <div className="space-y-4">
      {/* Add recent orders content */}
      <p className="text-gray-500">No recent orders</p>
    </div>
  </Card>
);

const PopularProducts = () => (
  <Card className="p-6">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Popular Products
    </h2>
    <div className="space-y-4">
      {/* Add popular products content */}
      <p className="text-gray-500">No popular products yet</p>
    </div>
  </Card>
);

const RecentPurchases = () => (
  <Card className="p-6">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Recent Purchases
    </h2>
    <div className="space-y-4">
      {/* Add recent purchases content */}
      <p className="text-gray-500">No recent purchases</p>
    </div>
  </Card>
);

const SavedProducts = () => (
  <Card className="p-6">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Saved Products
    </h2>
    <div className="space-y-4">
      {/* Add saved products content */}
      <p className="text-gray-500">No saved products</p>
    </div>
  </Card>
);

const sellerStats = [
  {
    title: "Total Revenue",
    value: "$12,426",
    change: 12,
    icon: CurrencyDollarIcon,
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: -2.3,
    icon: ShoppingCartIcon,
  },
  {
    title: "Total Customers",
    value: "3,123",
    change: 8.1,
    icon: UserGroupIcon,
  },
  {
    title: "Conversion Rate",
    value: "2.4%",
    change: 4.2,
    icon: ChartBarIcon,
  },
];

const buyerStats = [
  {
    title: "Total Spent",
    value: "$1,234",
    change: 8.2,
    icon: CurrencyDollarIcon,
  },
  {
    title: "Orders",
    value: "12",
    change: 4.1,
    icon: ShoppingCartIcon,
  },
  {
    title: "Saved Items",
    value: "24",
    change: 12.5,
    icon: UserGroupIcon,
  },
  {
    title: "Reviews Given",
    value: "8",
    change: 2.3,
    icon: ChartBarIcon,
  },
];

export const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const isSeller = user?.accountType === "seller";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(isSeller ? sellerStats : buyerStats).map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isSeller ? (
            <>
              <RecentOrders />
              <PopularProducts />
            </>
          ) : (
            <>
              <RecentPurchases />
              <SavedProducts />
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
