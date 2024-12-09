const IMGBB_API_KEY = "5766b9ae350dad174b1cdbba958f3f50"; // Move this to env later

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("key", IMGBB_API_KEY);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error?.message || "Upload failed");

    return data.data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};
