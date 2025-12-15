import connectDB from "@/lib/mongoose";
import { ProductModel, ProductType } from "@/models/Product";
import Link from "next/link";

// Force dynamic rendering since we are fetching data
// export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await connectDB();
  const products: ProductType[] = await ProductModel.find().sort({
    name: 1,
  });

  return (
    <main className="main-page">
      <h1 className="page-title">Our Products</h1>
      <section className="section-content">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="border p-4 rounded shadow hover:shadow-lg transition"
              >
                <Link
                  href={`/product/${product._id}`}
                  className="hover:underline"
                >
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                </Link>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-lg font-bold text-green-600">
                  ${product.price}
                </p>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </section>
    </main>
  );
}
