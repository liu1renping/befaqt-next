import { redirect } from "next/navigation";

import connectDB from "@/lib/mongoose";
import { CategoryModel, CategoryType } from "@/models/Category";
import { getSession } from "@/lib/session";
import CategoryManager from "./CategoryManager";
import { USER_ROLE } from "@/lib/constants";

export default async function CategoryManagePage() {
  const session = await getSession();
  if (!session || session.userData.role !== USER_ROLE.ADMIN) {
    return redirect("/login");
  }

  await connectDB();
  const categoriesRaw = await CategoryModel.find({
    createdBy: session.userData._id,
  })
    .lean<CategoryType[]>()
    .sort({ name: 1 });

  // Convert Mongoose documents (even lean) to plain objects for Client Components
  const categories = categoriesRaw.map((p) => ({
    ...p,
    _id: p._id.toString(),
    createdBy: p.createdBy.toString(),
    createdAt: p.createdAt?.toString(),
    updatedAt: p.updatedAt?.toString(),
  })) as unknown as CategoryType[];

  return (
    <main className="main-page">
      <h1 className="page-title">Manage Categories</h1>
      <CategoryManager initialCategories={categories} session={session} />
    </main>
  );
}
