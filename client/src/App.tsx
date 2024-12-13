import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { AccountSetup } from "./components/auth/AccountSetup";
import { Background } from "./components/common/Background";
import { ThemeProvider } from "./context/ThemeContext";
import { Footer } from "./components/common/Footer";
import Settings from "./pages/Settings";
import { Profile } from "./pages/Profile";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { LoadingScreen } from "./components/common/LoadingScreen";
import { AddProduct } from "./pages/AddProduct";
import { ProductDetails } from "./pages/ProductDetails";
import { EditProduct } from "./pages/EditProduct";
import { Products } from "./pages/Products";
import { NotificationsView } from "./components/notifications/NotificationsView";
import { DashboardLayout } from "./components/layout/DashboardLayout";

function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const isDashboardRoute = location.pathname.includes("/dashboard");

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <div className="w-full min-h-screen relative overflow-hidden flex flex-col bg-gray-50/90 dark:bg-gray-900/90">
        <Background />
        <div className="relative z-10 flex-1">
          <AnimatePresence mode="wait">
            {isLoading && <LoadingScreen />}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account-setup"
                element={
                  <ProtectedRoute>
                    <AccountSetup />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/products/new"
                element={
                  <ProtectedRoute>
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/products/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/notifications"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <NotificationsView />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
          {!isDashboardRoute && <Footer />}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
