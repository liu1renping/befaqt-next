"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CategoryType } from "@/models/Category";
import CategoryForm from "./CategoryForm";
import { SessionPayload } from "@/lib/session";

export default function CategoryManager({
  initialCategories,
  session,
}: {
  initialCategories: CategoryType[];
  session: SessionPayload | null;
}) {
  const router = useRouter();
  const [categories, setCategories] =
    useState<CategoryType[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(
    null
  );

  async function refreshCategories() {
    try {
      const res = await fetch("/api/category/manage");
      if (res.ok) {
        const data = await res.json();

        setCategories(data);
        router.refresh(); // Sync server state as well
      }
    } catch (error) {
      console.error("Failed to refresh categories", error);
    }
  }

  function handleFormSuccess() {
    setEditingCategory(null);
    refreshCategories();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/category/manage?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        refreshCategories();
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting category");
    }
  }

  return (
    <>
      <section className="section-form mb-4">
        <h2 className="section-title">
          {editingCategory ? "Edit Category" : "Add New Category"}
        </h2>
        <CategoryForm
          initialData={editingCategory}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingCategory(null)}
        />
      </section>

      <section className="section-content">
        <h2 className="section-title">Categories</h2>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((category) => (
              <div
                key={category._id}
                className="border p-4 rounded shadow hover:shadow-lg transition bg-white dark:bg-slate-800 dark:border-slate-700"
              >
                {category.imageUrl && (
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                )}

                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {category.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                  {category.description}
                </p>
                {session && (
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t dark:border-slate-700">
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No categories found.</p>
        )}
      </section>
    </>
  );
}
