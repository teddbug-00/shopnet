export const validateImage = (file: File) => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG and WebP images are allowed.",
    );
  }

  if (file.size > MAX_SIZE) {
    throw new Error("File size too large. Maximum size is 5MB.");
  }

  return true;
};

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
