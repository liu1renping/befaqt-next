"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
}

export default function AddToCartButton({
  productId,
  productName,
  productPrice,
  productImage,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(
      {
        productId,
        name: productName,
        price: productPrice,
        image: productImage,
      },
      quantity
    );

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(
      {
        productId,
        name: productName,
        price: productPrice,
        image: productImage,
      },
      quantity
    );
    router.push("/cart");
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Quantity:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold text-lg"
          >
            −
          </button>
          <span className="w-16 text-center font-bold text-lg">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center font-bold text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleAddToCart}
          className="flex-1 px-6 py-4 rounded-xl border-2 border-sky-500 text-sky-500 font-bold hover:bg-sky-50 dark:hover:bg-sky-950 transition-all"
        >
          Add to Cart
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 px-6 py-4 rounded-xl bg-sky-500 text-white font-bold hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20"
        >
          Buy Now
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-center font-medium animate-in fade-in slide-in-from-bottom-2 duration-300">
          ✓ Added to cart!
        </div>
      )}
    </div>
  );
}
