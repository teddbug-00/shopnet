import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppDispatch } from "../../store/hooks";
import { Card } from "../common/Card";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Button } from "../common/Button";
import { Alert } from "../common/Alert";
import { createProduct } from "../../features/products/productsSlice";
import { uploadImage } from "../../utils/imageService";
import {
  PhotoIcon,
  XMarkIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const CONDITION_OPTIONS = [
  { value: "new", label: "Brand New" },
  { value: "like-new", label: "Like New" },
  { value: "excellent", label: "Used - Excellent" },
  { value: "good", label: "Used - Good" },
  { value: "fair", label: "Used - Fair" },
];

const CATEGORIES = [
  { value: "electronics", label: "Electronics & Gadgets" },
  { value: "vehicles", label: "Vehicles" },
  { value: "property", label: "Property" },
  { value: "fashion", label: "Fashion" },
  { value: "furniture", label: "Home & Furniture" },
  { value: "beauty", label: "Health & Beauty" },
  { value: "sports", label: "Sports & Fitness" },
  { value: "books", label: "Books & Games" },
  { value: "agriculture", label: "Agriculture & Food" },
  { value: "services", label: "Services" },
  { value: "jobs", label: "Jobs" },
  { value: "other", label: "Other Categories" },
];

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  brand: string;
  model: string;
  color: string;
  quantity: string;
  location: string;
  features: string[];
  specifications: { key: string; value: string }[];
  negotiable: boolean;
  shipping: boolean;
  warranty: boolean;
  warrantyDuration: string;
  images: string[];
}

export const AddProductForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    brand: "",
    model: "",
    color: "",
    quantity: "1",
    location: "",
    features: [],
    specifications: [{ key: "", value: "" }],
    negotiable: false,
    shipping: false,
    warranty: false,
    warrantyDuration: "",
    images: [],
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFeature, setCurrentFeature] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);

      // Validate file size and type
      const validFiles = newFiles.filter((file) => {
        const isValidType = file.type.startsWith("image/");
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
        return isValidType && isValidSize;
      });

      if (validFiles.length !== newFiles.length) {
        setError("Some files were skipped. Images must be under 5MB.");
      }

      // Create preview URLs
      const previews = validFiles.map((file) => URL.createObjectURL(file));
      setImagesPreviews((prev) => [...prev, ...previews]);
      setImageFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()],
      }));
      setCurrentFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const updateSpecification = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);

    try {
      // Validate form
      if (imageFiles.length === 0) {
        throw new Error("Please add at least one product image");
      }

      // Upload images
      const uploadedUrls = await Promise.all(
        imageFiles.map((file) => uploadImage(file)),
      );

      const result = await dispatch(
        createProduct({
          ...formData,
          price: parseFloat(formData.price),
          images: uploadedUrls,
        }),
      );

      if (createProduct.fulfilled.match(result)) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      setError(error.message || "Failed to create product. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

        {error && (
          <Alert variant="error" show={!!error}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              helper="Enter a clear, descriptive title"
            />

            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={CATEGORIES}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="input-field min-h-[150px]"
                placeholder="Describe your product in detail..."
              />
            </div>
          </div>

          {/* Pricing and Availability */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Pricing and Availability</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />

              <Input
                label="Quantity Available"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="negotiable"
                  checked={formData.negotiable}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <span>Price Negotiable</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="shipping"
                  checked={formData.shipping}
                  onChange={handleChange}
                  className="rounded border-gray-300"
                />
                <span>Shipping Available</span>
              </label>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Product Details</h3>

            <Select
              label="Condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              options={CONDITION_OPTIONS}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
              />

              <Input
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
              />

              <Input
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Features</h3>

            <div className="flex gap-2">
              <Input
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                placeholder="Add a feature"
              />
              <Button type="button" onClick={addFeature}>
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-2 text-primary hover:text-primary-dark"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Specifications</h3>

            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex gap-4">
                <Input
                  placeholder="Specification name"
                  value={spec.key}
                  onChange={(e) =>
                    updateSpecification(index, "key", e.target.value)
                  }
                />
                <Input
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) =>
                    updateSpecification(index, "value", e.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => removeSpecification(index)}
                >
                  Remove
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              onClick={addSpecification}
            >
              Add Specification
            </Button>
          </div>

          {/* Warranty Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Warranty Information</h3>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="warranty"
                checked={formData.warranty}
                onChange={handleChange}
                className="rounded border-gray-300"
              />
              <span>Product has warranty</span>
            </label>

            {formData.warranty && (
              <Input
                label="Warranty Duration"
                name="warrantyDuration"
                value={formData.warrantyDuration}
                onChange={handleChange}
                placeholder="e.g., 1 year, 6 months"
              />
            )}
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Images</h3>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-input"
              />

              <label
                htmlFor="image-input"
                className="flex flex-col items-center cursor-pointer"
              >
                <PhotoIcon className="w-12 h-12 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">
                  Click to upload images (max 5MB each)
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {imagesPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
