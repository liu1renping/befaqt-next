"use client";

import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

interface QuickAddToCartProps {
  productId: string;
  name: string;
  price: number;
  unit: string;
  image: string;
}

export default function QuickAddToCart({
  productId,
  name,
  price,
  unit,
  image,
}: QuickAddToCartProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    // CRITICAL: Prevent the click from bubbling up to the Parent Link
    e.preventDefault();
    e.stopPropagation();

    addToCart(
      {
        productId,
        name,
        price,
        unit,
        image,
      },
      1
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <button
      onClick={handleQuickAdd}
      className={`p-2 rounded-xl transition-all duration-300 relative ${
        isAdded
          ? "bg-green-500 text-white scale-110"
          : "bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white"
      }`}
      aria-label="Quick add to cart"
    >
      {isAdded ? (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M12 4v16m8-8H4"
          />
        </svg>
      )}
    </button>
  );
}
