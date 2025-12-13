import connectDB from "@/lib/mongoose";

import { ProductModel } from "@/models/Product";
import { getSession } from "@/lib/session";
import ProductManager from "./ProductManager";

// Force dynamic rendering since we are fetching data
export const dynamic = "force-dynamic";

export default async function ProductManagePage() {
  await connectDB();
  const products = await ProductModel.find({}).sort({
    name: 1,
  });

  // Serialize to plain JSON to avoid "Only plain objects can be passed to Client Components" warning
  const plainProducts = JSON.parse(JSON.stringify(products));
  const session = await getSession();

  return (
    <main className="main-page">
      <h1 className="page-title">Manage Products</h1>
      <section className="section-content">
        <ProductManager initialProducts={plainProducts} session={session} />
      </section>
    </main>
  );
}
