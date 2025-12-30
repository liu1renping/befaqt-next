import { redirect } from "next/navigation";

import connectDB from "@/lib/mongoose";
import { ProductModel, ProductType } from "@/models/Product";
import { getSession } from "@/lib/session";
import ProductManager from "./ProductManager";
import { USER_ROLE } from "@/lib/constants";

export default async function ProductManagePage() {
  const session = await getSession();
  if (!session || session.userData.role !== USER_ROLE.SELLER) {
    return redirect("/login");
  }

  await connectDB();
  const productsRaw = await ProductModel.find({
    createdBy: session.userData._id,
  })
    .lean<ProductType[]>()
    .sort({ name: 1 });

  // Convert Mongoose documents (even lean) to plain objects for Client Components
  const products = productsRaw.map((p) => ({
    ...p,
    _id: p._id.toString(),
    createdBy: p.createdBy.toString(),
    createdAt: p.createdAt?.toString(),
    updatedAt: p.updatedAt?.toString(),
    category: p.category?.toString(),
  })) as unknown as ProductType[];

  return (
    <main className="main-page">
      <h1 className="page-title">Manage Products</h1>
      <section className="section-content">
        <ProductManager initialProducts={products} session={session} />
      </section>
    </main>
  );
}
