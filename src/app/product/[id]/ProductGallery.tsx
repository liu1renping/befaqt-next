"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400">
        No images available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Display */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <Image
          src={images[selectedImage]}
          alt={productName}
          fill
          className="object-contain"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setSelectedImage(idx)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 bg-white dark:bg-slate-800 cursor-pointer transition-all duration-200 ${
                selectedImage === idx
                  ? "border-sky-500 ring-2 ring-sky-500/50 scale-105"
                  : "border-slate-200 dark:border-slate-700 hover:border-sky-400"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} ${idx + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 20vw, 10vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
