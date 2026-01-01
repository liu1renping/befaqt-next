import Link from "next/link";
import Image from "next/image";

import connectDB from "@/lib/mongoose";
import { ProductModel, ProductType } from "@/models/Product";
import { CategoryModel, CategoryType } from "@/models/Category";
import QuickAddToCart from "./QuickAddToCart";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryName } = await searchParams;
  await connectDB();

  let categoryId = null;
  let pageTitle = "Our Products";
  let selectedCategory: CategoryType | null = null;

  if (categoryName) {
    const category = (await CategoryModel.findOne({
      name: categoryName,
    }).lean()) as CategoryType | null;

    if (category) {
      categoryId = category._id;
      pageTitle = `${category.name} Products`;
      selectedCategory = category;
    }
  }

  const query = categoryId ? { category: categoryId } : {};
  const products = await ProductModel.find(query)
    .lean<ProductType[]>()
    .sort({ name: 1 });

  return (
    <main className="main-page">
      <h1 className="page-title">{pageTitle}</h1>

      {/* Category Header */}
      {selectedCategory && (
        <section className="max-w-4xl mx-auto mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Category Image */}
              {selectedCategory.imageUrl && (
                <div className="relative aspect-video md:aspect-square bg-slate-100 dark:bg-slate-900">
                  <Image
                    src={selectedCategory.imageUrl}
                    alt={selectedCategory.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              {/* Category Description */}
              <div
                className={`p-8 flex flex-col justify-center ${!selectedCategory.imageUrl ? "md:col-span-2" : ""}`}
              >
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  {selectedCategory.name}
                </h2>
                {selectedCategory.description && (
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedCategory.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section-content">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                key={product._id}
                href={`/product/${product._id}`}
                className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/10"
              >
                <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-900">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-xs uppercase font-bold tracking-widest">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-500 transition-colors uppercase tracking-tight">
                      {product.name}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-black text-sky-500">
                      ${product.price ? product.price.toFixed(2) : "0.00"}
                    </span>
                    <QuickAddToCart
                      productId={product._id.toString()}
                      name={product.name}
                      price={product.price || 0}
                      image={product.images?.[0] || "/placeholder.png"}
                    />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </section>
    </main>
  );
}
