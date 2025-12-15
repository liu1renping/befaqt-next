import { redirect } from "next/navigation";

import connectDB from "@/lib/mongoose";
import { ProductModel } from "@/models/Product";
import { getSession } from "@/lib/session";
import ProductManager from "./ProductManager";
import { USER_ROLE } from "@/lib/constants";

// Force dynamic rendering since we are fetching data
export const dynamic = "force-dynamic";

export default async function ProductManagePage() {
  const session = await getSession();
  if (!session || session.userData.role !== USER_ROLE.SELLER) {
    return redirect("/login");
  }

  await connectDB();
  const products = await ProductModel.find({
    createdBy: session.userData._id,
  }).sort({
    updatedAt: 1,
  });

  // Serialize to plain JSON to avoid "Only plain objects can be passed to Client Components" warning
  const plainProducts = JSON.parse(JSON.stringify(products));

  return (
    <main className="main-page">
      <h1 className="page-title">Manage Products</h1>
      <section className="section-content">
        <ProductManager initialProducts={plainProducts} session={session} />
      </section>
    </main>
  );
}
