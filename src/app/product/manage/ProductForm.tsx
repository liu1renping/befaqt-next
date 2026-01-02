"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { ProductType } from "@/models/Product";

const emptyFormData = {
  name: "",
  description: "",
  price: "",
  images: [] as string[],
  category: "",
};

export default function ProductForm({
  initialData,
  onSuccess,
  onCancel,
}: {
  initialData?: ProductType | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(emptyFormData);
  const [availableCategories, setAvailableCategories] = useState<
    { _id: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/category")
      .then((res) => res.json())
      .then((data) => setAvailableCategories(data));
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        images: initialData.images || [],
        category: initialData.category?.toString() || "",
      });
    } else {
      setFormData(emptyFormData);
    }
  }, [initialData]);

  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (
      result.event === "success" &&
      typeof result.info === "object" &&
      result.info
    ) {
      const url = result.info.secure_url;
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    setFieldErrors({});
    try {
      const body = {
        ...formData,
        price: parseFloat(formData.price),
        ...(initialData ? { _id: initialData._id } : {}),
      };
      const res = await fetch("/api/product/manage", {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setFormData(emptyFormData);
        onSuccess();
      } else {
        setFormError(data.message || "Failed to save product");
        if (data.errors) {
          setFieldErrors(data.errors);
        }
      }
    } catch (err) {
      setFormError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  function FieldError({ name }: { name?: string }) {
    return fieldErrors[name as string] ? (
      <p className="text-sm text-red-600">{fieldErrors[name as string]}</p>
    ) : null;
  }

  return (
    <form onSubmit={handleSubmit}>
      {formError && <div className="text-red-500 text-sm">{formError}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="label-col">
            Product Name
            <input
              type="text"
              placeholder="Product Name"
              id="name"
              name="name"
              value={formData.name}
              autoComplete="off"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input"
              required
            />
            <FieldError name="name" />
          </label>

          <label htmlFor="description" className="label-col">
            Description
            <textarea
              placeholder="Description"
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="input min-h-[100px]"
            />
            <FieldError name="description" />
          </label>

          <label htmlFor="category" className="label-col">
            Category
            <select
              name="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="input"
            >
              <option value="">Select Category (Optional)</option>
              {availableCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <FieldError name="category" />
          </label>

          <label htmlFor="price" className="label-col">
            Price
            <input
              type="number"
              placeholder="Price"
              name="price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="input"
              required
              min="0"
              step="0.01"
            />
            <FieldError name="price" />
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="images" className="label-col">
            Product Images (Max 6)
            <div className="grid grid-cols-3 gap-2 mb-2">
              {formData.images.map((img: string, index: number) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 group"
                >
                  <Image
                    src={img}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 15vw"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                    title="Remove image"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              {formData.images.length < 6 && (
                <CldUploadWidget
                  uploadPreset={
                    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                  }
                  onSuccess={handleUploadSuccess}
                  options={{
                    maxFiles: 6 - formData.images.length,
                    resourceType: "image",
                    clientAllowedFormats: ["webp", "png", "jpg", "jpeg"],
                    singleUploadAutoClose: true,
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl hover:border-sky-500/50 hover:bg-sky-500/5 transition-all group"
                    >
                      <svg
                        className="w-6 h-6 text-slate-400 group-hover:text-sky-500 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="text-[10px] font-medium text-slate-500 group-hover:text-sky-500 mt-1 uppercase">
                        Upload
                      </span>
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>
          </label>
          <FieldError name="images" />
        </div>
      </div>

      <div className="flex gap-2 md:max-w-[50%] mx-auto md:mt-2">
        <button
          type="submit"
          disabled={loading}
          className="button bg-blue-600 text-white flex-1 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Update Product"
              : "Add Product"}
        </button>

        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="button bg-gray-500 text-white hover:bg-gray-600 px-4"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
