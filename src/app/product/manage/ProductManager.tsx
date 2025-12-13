"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductType } from "@/models/Product";
import ProductForm from "./ProductForm";
import { SessionPayload } from "@/lib/session";

interface ProductManagerProps {
  initialProducts: ProductType[];
  session: SessionPayload | null;
}

export default function ProductManager({
  initialProducts,
  session,
}: ProductManagerProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );

  async function refreshProducts() {
    try {
      const res = await fetch("/api/product");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        router.refresh(); // Sync server state as well
      }
    } catch (error) {
      console.error("Failed to refresh products", error);
    }
  }

  function handleFormSuccess() {
    setEditingProduct(null);
    refreshProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/product?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        refreshProducts();
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting product");
    }
  }

  return (
    <div>
      {session && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50 max-w-2xl mx-auto dark:bg-slate-800 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <ProductForm
            initialData={editingProduct}
            onSuccess={handleFormSuccess}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded shadow hover:shadow-lg transition bg-white dark:bg-slate-800 dark:border-slate-700"
            >
              {product.imageUrl && (
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}

              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {product.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                {product.description}
              </p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                ${product.price}
              </p>
              {session && (
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t dark:border-slate-700">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
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
        <p className="text-center text-gray-500 py-8">No products found.</p>
      )}
    </div>
  );
}
