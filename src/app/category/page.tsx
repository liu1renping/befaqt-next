import Link from "next/link";

import connectDB from "@/lib/mongoose";
import { CategoryModel, CategoryType } from "@/models/Category";

export default async function CategoryPage() {
  await connectDB();
  // use lean() for performance, cast to CategoryType to help TypeScript
  const categories = await CategoryModel.find()
    .lean<CategoryType[]>()
    .sort({ name: 1 });

  return (
    <main className="main-page">
      <h1 className="page-title">Our Categories</h1>
      <section className="section-content">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category._id}
                className="border p-4 rounded shadow hover:shadow-lg transition"
              >
                <Link
                  href={`/category/${category._id}`}
                  className="hover:underline"
                >
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                </Link>
                <p className="text-gray-600 mb-2">{category.description}</p>
              </div>
            ))
          ) : (
            <p>No categories found.</p>
          )}
        </div>
      </section>
    </main>
  );
}
