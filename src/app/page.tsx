import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-5xl font-bold mb-6">Welcome to BeFAQT Shop</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Discover our amazing collection of products. Quality items at the best prices.
      </p>
      <Link 
        href="/products" 
        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
      >
        View Products
      </Link>
    </div>
  );
}
