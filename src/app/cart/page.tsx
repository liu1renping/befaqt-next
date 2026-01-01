"use client";

import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();

  if (cart.length === 0) {
    return (
      <main className="main-page">
        <h1 className="page-title">Shopping Cart</h1>
        <section className="section-content">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <svg
              className="w-24 h-24 text-slate-300 dark:text-slate-700 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Add some products to get started!
            </p>
            <Link
              href="/"
              className="bg-sky-500 text-white px-8 py-3 rounded-full font-bold hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="main-page">
      <h1 className="page-title">Shopping Cart</h1>
      <section className="section-content max-w-4xl">
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700"
            >
              {/* Product Image */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white dark:bg-slate-800 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/product/${item.productId}`}
                    className="font-bold text-slate-900 dark:text-white hover:text-sky-500 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-lg font-bold text-sky-500 mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 hover:text-red-600 transition-colors text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Subtotal
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              Total
            </span>
            <span className="text-3xl font-bold text-sky-500">
              ${getCartTotal().toFixed(2)}
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={clearCart}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Clear Cart
            </button>
            <button className="flex-1 px-6 py-3 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20">
              Proceed to Checkout
            </button>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block mt-6 text-sky-500 hover:text-sky-400 font-medium"
        >
          ← Continue Shopping
        </Link>
      </section>
    </main>
  );
}
