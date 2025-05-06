import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { register } from "../../features/auth/authSlice";
import { Card } from "../common/Card";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { slideUp } from "../../utils/animations";
import { Navbar } from "../common/Navbar";
import { RegisterCredentials } from "../../types/auth";
import { UserIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { useSnackbar } from "../../context/SnackbarContext";

export const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState<RegisterCredentials>({
    name: "",
    email: "",
    password: "",
  });

  // Show error snackbar if there's an error
  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error, showSnackbar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await dispatch(register(formData));

      if (register.fulfilled.match(result)) {
        const user = result.payload.user;
        if (!user.accountType) {
          navigate("/account-setup", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      }
    } catch (err) {
      console.error("Registration failed:", err);
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
                  Create your account
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Join ShopNet today
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Remove Alert component */}

              <Input
                label="Full Name"
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                leftIcon={<UserIcon className="w-5, h-5" />}
                placeholder="Enter your full name"
              />

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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                leftIcon={<LockClosedIcon className="w-5 h-5" />}
                placeholder="Create a password"
              />

              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </Card>
        </motion.div>
      </div>
    </>
  );
};