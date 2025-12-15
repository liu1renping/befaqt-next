"use client";

import { useState, useEffect } from "react";
import { ProductType } from "@/models/Product";

interface ProductFormProps {
  initialData?: ProductType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyFormData = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
};

export default function ProductForm({
  initialData,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [formData, setFormData] = useState(emptyFormData);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price?.toString() || "",
        imageUrl: initialData.imageUrl || "",
      });
    } else {
      setFormData(emptyFormData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    setFieldErrors({});
    try {
      const url = "/api/product/manage";
      const method = initialData ? "PUT" : "POST";
      const body = {
        ...formData,
        price: parseFloat(formData.price),
        ...(initialData ? { _id: initialData._id } : {}),
      };

      const res = await fetch(url, {
        method,
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

      <input
        type="text"
        placeholder="Image URL"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        className="input"
      />
      <FieldError name="imageUrl" />

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
