import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/mongoose";
import { ProductModel, ProductType } from "@/models/Product";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();

  // Use lean() for performance since we don't need mongoose document methods
  // Cast to ProductType to help TypeScript, though lean() returns POJOs
  const product = await ProductModel.findById(id).lean<ProductType>();

  if (!product) {
    notFound();
  }

  return (
    <main className="main-page">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/product"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            ← Back to Products
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-700">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {product.name}
              </h1>

              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-6">
                ${product.price.toFixed(2)}
              </div>

              <div className="prose dark:prose-invert max-w-none mb-8">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {product.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
