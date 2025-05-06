import { useState } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { changePassword } from "../../features/settings/settingsSlice";
import { useSnackbar } from "../../context/SnackbarContext";

export const PasswordPanel = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.settings);
  const { showSnackbar } = useSnackbar();

  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validatePasswordForm = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (!passwordSettings.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordSettings.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordSettings.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordSettings.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (
      passwordSettings.newPassword !== passwordSettings.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    
    // Show first error in snackbar if any
    const errorMessages = Object.values(errors).filter(Boolean);
    if (errorMessages.length > 0) {
      showSnackbar(errorMessages[0], "error");
    }
    
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    const result = await dispatch(
      changePassword({
        currentPassword: passwordSettings.currentPassword,
        newPassword: passwordSettings.newPassword,
      }),
    );

    if (changePassword.fulfilled.match(result)) {
      setPasswordSettings({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showSnackbar("Password updated successfully", "success");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Input
          label="Current Password"
          type="password"
          value={passwordSettings.currentPassword}
          onChange={(e) =>
            setPasswordSettings((prev) => ({
              ...prev,
              currentPassword: e.target.value,
            }))
          }
          error={passwordErrors.currentPassword}
        />
        <Input
          label="New Password"
          type="password"
          value={passwordSettings.newPassword}
          onChange={(e) =>
            setPasswordSettings((prev) => ({
              ...prev,
              newPassword: e.target.value,
            }))
          }
          error={passwordErrors.newPassword}
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={passwordSettings.confirmPassword}
          onChange={(e) =>
            setPasswordSettings((prev) => ({
              ...prev,
              confirmPassword: e.target.value,
            }))
          }
          error={passwordErrors.confirmPassword}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </form>
  );
};