import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/mongoose";
import { ProductModel, ProductType } from "@/models/Product";
import ProductGallery from "./ProductGallery";
import AddToCartButton from "./AddToCartButton";
import SFMBoxPage from "../sfm-box/page";

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

  // this is a special case for the SFM box page
  if (product.name.startsWith("SFM")) return <SFMBoxPage />;

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

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Product Gallery */}
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50">
              <ProductGallery
                images={product.images || []}
                productName={product.name}
              />
            </div>

            {/* Product Details */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="flex-1">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight uppercase">
                  {product.name}
                </h1>

                <div className="h-1 w-20 bg-sky-500 mb-8 rounded-full" />

                <div className="text-4xl font-bold text-sky-500 mb-10">
                  ${product.price.toFixed(2)}
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
                    Product Description
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {product.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700/50">
                <AddToCartButton
                  productId={product._id.toString()}
                  productName={product.name}
                  productPrice={product.price}
                  productUnit={product.unit}
                  productImage={product.images?.[0] || "/placeholder.png"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
