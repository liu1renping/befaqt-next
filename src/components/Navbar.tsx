"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

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
          {session ? (
            <>
              <Link href="/products/add" className="hover:text-gray-300">
                Add Product
              </Link>
              <span className="text-gray-400">Hi, {session.user?.name}</span>
              <button
                onClick={() => signOut()}
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

