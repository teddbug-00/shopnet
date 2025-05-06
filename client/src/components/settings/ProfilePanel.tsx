import { useState } from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { updateProfile } from "../../features/settings/settingsSlice";
import { updateUserData } from "../../features/auth/authSlice";
import { uploadImage } from "../../utils/imageService";
import { useSnackbar } from "../../context/SnackbarContext";

export const ProfilePanel = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.settings);
  const { showSnackbar } = useSnackbar();

  const [profileSettings, setProfileSettings] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    address: user?.profile?.address || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.profile?.profileImage || null,
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showSnackbar("Image size should be less than 2MB", "error");
        return;
      }

      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let profileImageUrl = user?.profile?.profileImage;

      if (imageFile) {
        profileImageUrl = await uploadImage(imageFile);
      }

      const result = await dispatch(
        updateProfile({
          name: profileSettings.name,
          phone: profileSettings.phone,
          address: profileSettings.address,
          profileImage: profileImageUrl,
        }),
      );

      if (updateProfile.fulfilled.match(result)) {
        dispatch(updateUserData(result.payload.user));
        setImageFile(null);
        showSnackbar("Profile updated successfully", "success");
      }
    } catch (error: any) {
      showSnackbar(error.message || "Failed to update profile", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-medium text-gray-400">
                {user?.name?.[0] || user?.email?.[0] || "?"}
              </div>
            )}
          </div>
          <label
            htmlFor="profile-image"
            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary hover:bg-primary-dark text-white cursor-pointer transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </label>
          <input
            type="file"
            id="profile-image"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Profile Photo
          </h3>
          <p className="text-sm text-gray-500">
            Upload a new profile photo (max 2MB)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="Name"
          value={profileSettings.name}
          onChange={(e) =>
            setProfileSettings((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
        <Input
          label="Email"
          type="email"
          value={profileSettings.email}
          disabled
          helper="Email cannot be changed"
        />
        <Input
          label="Phone"
          type="tel"
          value={profileSettings.phone}
          onChange={(e) =>
            setProfileSettings((prev) => ({
              ...prev,
              phone: e.target.value,
            }))
          }
        />
        <Input
          label="Address"
          value={profileSettings.address}
          onChange={(e) =>
            setProfileSettings((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isUploading || isLoading}>
          {isUploading
            ? "Uploading..."
            : isLoading
              ? "Saving..."
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
