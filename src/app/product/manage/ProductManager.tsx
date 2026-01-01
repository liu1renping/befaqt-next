"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductType } from "@/models/Product";
import ProductForm from "./ProductForm";
import { SessionPayload } from "@/lib/session";

export default function ProductManager({
  initialProducts,
  session,
}: {
  initialProducts: ProductType[];
  session: SessionPayload | null;
}) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null
  );

  async function refreshProducts() {
    try {
      const res = await fetch("/api/product/manage");
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
      const res = await fetch(`/api/product/manage?id=${id}`, {
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
    <>
      <section className="section-form mb-4">
        <h2 className="section-title">
          {editingProduct ? "Edit Product" : "Add New Product"}
        </h2>
        <ProductForm
          initialData={editingProduct}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingProduct(null)}
        />
      </section>

      <section className="section-content">
        <h2 className="section-title">Products</h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {products.map((product) => (
              <div
                key={product._id}
                className="border p-1 rounded shadow hover:shadow-lg transition bg-white dark:bg-slate-800 dark:border-slate-700"
              >
                {product.images && product.images.length > 0 ? (
                  <div className="relative w-full aspect-square mb-2 overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain rounded"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {product.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        +{product.images.length - 1}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full aspect-square mb-2 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest border border-dashed border-slate-300 dark:border-slate-600">
                    No Image
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
      </section>
    </>
  );
}
