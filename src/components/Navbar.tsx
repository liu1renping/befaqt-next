"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          BeFAQT Shop
        </Link>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          {user ? (
            <>
              <Link href="/products/add" className="hover:text-gray-300">
                Add Product
              </Link>
              <span className="text-gray-400">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="hover:text-gray-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link href="/register" className="hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
