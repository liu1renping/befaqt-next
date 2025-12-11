"use client";

import { SessionPayload } from "@/lib/session";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [sessionUser, setSessionUser] = useState<
    SessionPayload["userData"] | null
  >(null);
  const router = useRouter();
  const pathname = usePathname();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // fetch the session user on mount and when the pathname changes (including login/logout)
  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => setSessionUser(data.user));
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/user/logout", { method: "POST" });
    router.replace("/user/login");
    router.refresh();
  };

  return (
    <nav className="bg-sky-700 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          BeFAQT Shop
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>

          {/* About Dropdown */}
          <div className="relative group">
            <button
              onClick={() => setIsAboutOpen(!isAboutOpen)}
              onBlur={() => setTimeout(() => setIsAboutOpen(false), 200)}
              className="hover:text-gray-300 focus:outline-none flex items-center gap-1"
            >
              About
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isAboutOpen && (
              <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800">
                <Link
                  href="/about/project"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Project
                </Link>
                <Link
                  href="/about/tech"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Tech
                </Link>
                <Link
                  href="/about/team"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Team
                </Link>
              </div>
            )}
          </div>

          <Link href="/products" className="hover:text-gray-300">
            Products
          </Link>

          <Link href="/products" className="hover:text-gray-300">
            Fish
          </Link>

          <Link href="/products" className="hover:text-gray-300">
            Fillet
          </Link>

          <Link href="/products" className="hover:text-gray-300">
            Shellfish
          </Link>

          {sessionUser ? (
            <>
              <Link
                href="/user/dashboard"
                className="flex items-center gap-2 text-gray-200 hover:text-white"
              >
                {sessionUser.avatar ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                    <Image
                      src={sessionUser.avatar}
                      alt={sessionUser.fname}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-sm font-semibold">
                    {sessionUser.fname.charAt(0)}
                  </div>
                )}
                <span>Hi, {sessionUser.fname}</span>
              </Link>
              <button onClick={logout} className="hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/user/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link href="/user/register" className="hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 flex flex-col gap-2">
          <Link href="/" className="hover:text-gray-300 py-2">
            Home
          </Link>
          <div className="py-2 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-2">About</p>
            <Link
              href="/about/project"
              className="block pl-4 py-1 hover:text-gray-300"
            >
              Project
            </Link>
            <Link
              href="/about/tech"
              className="block pl-4 py-1 hover:text-gray-300"
            >
              Tech
            </Link>
            <Link
              href="/about/team"
              className="block pl-4 py-1 hover:text-gray-300"
            >
              Team
            </Link>
          </div>
          <div className="py-2 border-t border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Products</p>
            <Link
              href="/products"
              className="block pl-4 py-1 hover:text-gray-300"
            >
              All Products
            </Link>
            <Link
              href="/products"
              className="block pl-4 py-1 hover:text-gray-300"
            >
              Fish
            </Link>
            <Link
              href="/products"
              className="block pl-4 py-1 hover:text-gray-300"
            >
              Fillet
            </Link>
            <Link
              href="/products"
              className="block pl-4 py-1 hover:text-gray-300"
            >
              Shellfish
            </Link>
          </div>
          <div className="pt-2 border-t border-gray-700">
            {sessionUser ? (
              <>
                <Link
                  href="/user/dashboard"
                  className="block py-2 text-gray-200 hover:text-white"
                >
                  Hi, {sessionUser.fname}
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left py-2 hover:text-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/user/login"
                  className="block py-2 hover:text-gray-300"
                >
                  Login
                </Link>
                <Link
                  href="/user/register"
                  className="block py-2 hover:text-gray-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
