"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (formData.images.length >= 6) {
      setFormError("Maximum 6 images allowed");
      return;
    }

    setUploading(true);
    setFormError("");
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const res = await fetch("/api/product/upload", {
        method: "POST",
        body: uploadFormData,
      });
      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, data.url],
        }));
      } else {
        setFormError(data.message || "Upload failed");
      }
    } catch (err) {
      setFormError("Error uploading image");
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {formError && <div className="text-red-500 text-sm">{formError}</div>}

      <input
        type="text"
        placeholder="Product Name"
        name="name"
        value={formData.name}
        autoComplete="off"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="input"
        required
      />
      <FieldError name="name" />

      <textarea
        placeholder="Description"
        name="description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="input min-h-[100px]"
      />
      <FieldError name="description" />

      <select
        name="category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

      <input
        type="number"
        placeholder="Price"
        name="price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        className="input"
        required
        min="0"
        step="0.01"
      />
      <FieldError name="price" />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Product Images (Max 6)
        </label>

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
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl hover:border-sky-500/50 hover:bg-sky-500/5 transition-all group disabled:opacity-50"
            >
              {uploading ? (
                <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
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
                </>
              )}
            </button>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <FieldError name="images" />
      </div>

      <div className="flex gap-2">
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
