import Link from "next/link";
import Image from "next/image";

import connectDB from "@/lib/mongoose";
import { CategoryModel, CategoryType } from "@/models/Category";

export default async function Home() {
  await connectDB();
  const categories = (await CategoryModel.find()
    .sort({ order: 1, name: 1 })
    .lean()) as unknown as CategoryType[];

  return (
    <main className="main-page">
      <section className="section-content pt-12 pb-20">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          BeFAQT: Blockchain enabled Fish provenance And Quality Tracking
        </h1>
        <p className="text-xl text-sky-200/70 mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          Discover our amazing collection of premium products. Quality items at
          the best prices, delivered with care.
        </p>
        <Link
          href="/product"
          className="inline-block bg-sky-500 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-sky-400 hover:scale-105 transition-all shadow-xl shadow-sky-500/20 active:scale-95 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300"
        >
          View All Products
        </Link>
      </section>

      <section className="section-content pb-24">
        <h2 className="section-title mb-12">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => (
            <Link
              key={cat._id}
              href={`/product?category=${encodeURIComponent(cat.name)}`}
              className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 hover:border-sky-500/50 transition-all duration-500 animate-in fade-in slide-in-from-bottom-10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/5] relative">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <span className="text-slate-600">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">
                    {cat.name}
                  </h3>
                  <p className="text-sky-200/60 text-sm mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {cat.description || `Explore our ${cat.name} collection`}
                  </p>
                  <span className="inline-flex items-center text-sky-400 font-bold text-sm uppercase tracking-widest gap-2 group/btn">
                    Shop Now
                    <svg
                      className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
