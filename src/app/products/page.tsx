import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Image from "next/image";
import { getSession } from "@/lib/session";
import AddProductForm from "./AddProductForm";

// Force dynamic rendering since we are fetching data
export const dynamic = "force-dynamic";

interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

async function getProducts() {
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(products));
}

export default async function ProductsPage() {
  const products: ProductType[] = await getProducts();
  const session = await getSession();

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>

      {session && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Add New Product</h2>
          <AddProductForm />
        </div>
      )}

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
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
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-lg font-bold text-green-600">
                ${product.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
