import Link from "next/link";
import Image from "next/image";

import connectDB from "@/lib/mongoose";
import { CategoryModel, CategoryType } from "@/models/Category";

// Ensure dynamic rendering for category images (reload images on every request)
// export const dynamic = "force-dynamic";

export default async function Home() {
  await connectDB();
  const categories = (await CategoryModel.find()
    .sort({ order: 1, name: 1 })
    .lean()) as unknown as CategoryType[];

  return (
    <main>
      {/* Hero Section with Background Video */}
      <section className="relative min-h-[100vh] flex flex-col items-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="/images/video-poster.jpg"
        >
          <source src="/videos/befaqt-catch10s.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/70" />

        {/* Hero Content */}
        <section className="section">
          <div className="relative z-10 pt-5 pb-5 text-center">
            <div className="flex items-center justify-center gap-4 text-5xl md:text-7xl font-bold text-white animate-in fade-in slide-in-from-bottom-4 duration-1000 drop-shadow-2xl">
              <Link href="/" title="BeFAQT Home" aria-label="BeFAQT Home">
                <Image
                  src="/icons/logo512x512.png"
                  alt="BeFAQT Logo"
                  width={80}
                  height={80}
                  className="w-16 h-16 md:w-20 md:h-20"
                />
              </Link>
              BeFAQT
              <Link
                href="https://aiia.com.au/iaward/2020-nsw-iawards-winners/"
                target="_blank"
              >
                <Image
                  src="/images/pic_BeFAQT-iAwards20bg.png"
                  alt="BeFAQT iAwards"
                  width={80}
                  height={80}
                  title="BeFAQT - NSW iAwards 2020 Winner"
                  aria-label="BeFAQT - NSW iAwards 2020 Winner"
                  className="w-16 h-16 md:w-18 md:h-18 rounded-xl object-cover"
                />
              </Link>
            </div>
            <h1 className="text-xl md:text-4xl font-bold text-white animate-in fade-in slide-in-from-bottom-4 duration-1000 drop-shadow-2xl">
              Blockchain enabled Fish provenance <br className="md:hidden" />
              And Quality Tracking
            </h1>
            <Link
              href="/product/sfm-box"
              className="inline-block bg-sky-500 text-white px-10 py-2 my-4 rounded-full text-xl font-bold hover:bg-sky-400 hover:scale-105 transition-all shadow-xl shadow-sky-500/20 active:scale-95 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300"
            >
              Catch of the day <br className="md:hidden" />{" "}
              <span className="text-base md:text-xl">
                with BeFAQT tracking records
              </span>
            </Link>
          </div>

          <div className="relative z-10 text-center">
            <h2 className="text-xl md:text-4xl font-bold text-sky-400 text-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 drop-shadow-lg">
              Discover our amazing collection of premium products.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
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
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                        <span className="text-slate-600">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">
                        {cat.name}
                      </h3>
                      <p className="text-sky-200/60 text-sm mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {cat.description ||
                          `Explore our ${cat.name} collection`}
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
          </div>
        </section>

        {/* Info Bar */}
        <div className="text-center text-white z-10 mt-5 w-full max-w-7xl">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <span>📍 University of Technology Sydney</span>
            <span>
              📧{" "}
              <a href="mailto:renping.liu@uts.edu.au">renping.liu@uts.edu.au</a>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
