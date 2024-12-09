import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

interface ImageUploadPreviewProps {
  existingImages?: string[];
  onImagesChange: (files: File[]) => void;
  onRemoveExisting?: (index: number) => void;
  maxImages?: number;
}

export const ImageUploadPreview = ({
  existingImages = [],
  onImagesChange,
  onRemoveExisting,
  maxImages = 5,
}: ImageUploadPreviewProps) => {
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + existingImages.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Create previews for new images
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
    setNewImageFiles((prev) => [...prev, ...files]);
    onImagesChange(files);
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newImagePreviews[index]);
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    onImagesChange(newImageFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Image Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-xl p-8
          ${
            existingImages.length + newImagePreviews.length >= maxImages
              ? "opacity-50 cursor-not-allowed"
              : "border-gray-300 hover:border-primary cursor-pointer"
          }
        `}
      >
        <label
          htmlFor="image-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          <PhotoIcon className="w-12 h-12 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500">
            Click to upload images (max {maxImages})
          </span>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
            disabled={
              existingImages.length + newImagePreviews.length >= maxImages
            }
          />
        </label>
      </div>

      {/* Image Previews */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Existing Images */}
        {existingImages.map((src, index) => (
          <motion.div
            key={`existing-${src}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative aspect-square"
          >
            <img
              src={src}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            {onRemoveExisting && (
              <button
                type="button"
                onClick={() => onRemoveExisting(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ))}

        {/* New Image Previews */}
        {newImagePreviews.map((src, index) => (
          <motion.div
            key={`new-${src}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative aspect-square"
          >
            <img
              src={src}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeNewImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
