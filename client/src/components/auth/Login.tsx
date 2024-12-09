import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login } from "../../features/auth/authSlice";
import { Card } from "../common/Card";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { Alert } from "../common/Alert";
import { slideUp } from "../../utils/animations";
import { Navbar } from "../common/Navbar";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/outline";

interface LoginFormData {
  email: string;
  password: string;
}

export const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <motion.div {...slideUp} className="w-full max-w-md py-4">
          <Card className="p-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                SN
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Welcome back
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Enter your credentials to continue
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {error && (
                <Alert variant="error" show={!!error}>
                  {error}
                </Alert>
              )}

              <Input
                label="Email"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                leftIcon={<EnvelopeIcon className="w-5, h-5" />}
                placeholder="Enter your email"
              />

              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                leftIcon={<LockClosedIcon className="w-5, h-5" />}
                placeholder="Enter your password"
              />

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </Card>
        </motion.div>
      </div>
    </>
  );
};
