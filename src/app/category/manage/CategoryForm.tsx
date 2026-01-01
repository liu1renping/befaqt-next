"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CategoryType } from "@/models/Category";

const emptyFormData = {
  name: "",
  description: "",
  imageUrl: "",
  order: "0",
};

export default function CategoryForm({
  initialData,
  onSuccess,
  onCancel,
}: {
  initialData?: CategoryType | null;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(emptyFormData);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        imageUrl: initialData.imageUrl || "",
        order: initialData.order?.toString() || "0",
      });
    } else {
      setFormData(emptyFormData);
    }
  }, [initialData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFormError("");

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const res = await fetch("/api/category/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();
      if (res.ok) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      } else {
        setFormError(data.message || "Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      setFormError("Error uploading image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    setFieldErrors({});
    try {
      const body = {
        ...formData,
        order: parseInt(formData.order) || 0,
        ...(initialData ? { _id: initialData._id } : {}),
      };
      const res = await fetch("/api/category/manage", {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setFormData(emptyFormData);
        onSuccess();
      } else {
        setFormError(data.message || "Failed to save category");
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
      {formError && (
        <div className="text-red-500 text-sm italic">{formError}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="label-col">
              Category Name
              <input
                type="text"
                placeholder="Category Name"
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
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="order" className="label-col">
              Display Order
              <input
                type="number"
                placeholder="Display Order (0, 1, 2...)"
                id="order"
                name="order"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: e.target.value })
                }
                className="input"
              />
              <FieldError name="order" />
            </label>
          </div>

          <div className="flex flex-col gap-1">
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
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="imageUrl" className="label-col">
            Category Image
            {formData.imageUrl && (
              <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 mb-2">
                <Image
                  src={formData.imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 400px"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageUrl: "" })}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-lg"
                  title="Remove image"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </label>

          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Image URL (manual or upload)"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="input text-sm"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Upload
                </>
              )}
            </button>
          </div>
          <FieldError name="imageUrl" />
        </div>
      </div>

      <div className="flex gap-2 md:max-w-[50%] mx-auto mt-2">
        <button
          type="submit"
          disabled={loading || uploading}
          className="button bg-sky-600 text-white flex-1 disabled:opacity-50 shadow-lg shadow-sky-600/20"
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Update Category"
              : "Add Category"}
        </button>

        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors font-medium border border-transparent dark:border-white/10"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
