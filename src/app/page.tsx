import Link from "next/link";

export default function Home() {
  return (
    <main className="main-page">
      <h1 className="page-title">Welcome to BeFAQT Shop</h1>
      <section className="section-content">
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Discover our amazing collection of products. Quality items at the best
          prices.
        </p>
        <Link
          href="/product"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          View Products
        </Link>
      </section>
    </main>
  );
}
