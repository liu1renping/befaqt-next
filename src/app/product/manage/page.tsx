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
  const products = await ProductModel.find({
    createdBy: session.userData._id,
  })
    .lean<ProductType[]>()
    .sort({ name: 1 });

  return (
    <main className="main-page">
      <h1 className="page-title">Manage Products</h1>
      <section className="section-content">
        <ProductManager initialProducts={products} session={session} />
      </section>
    </main>
  );
}
