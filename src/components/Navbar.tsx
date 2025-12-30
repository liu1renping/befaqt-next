"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { SessionPayload } from "@/lib/session";
import { USER_ROLE } from "@/lib/constants";

export default function Navbar() {
  const [sessionUser, setSessionUser] = useState<
    SessionPayload["userData"] | null
  >(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // fetch the session user and categories on mount and when the pathname changes
  useEffect(() => {
    fetch("/api/user/me")
      .then((res) => res.json())
      .then((data) => setSessionUser(data.user));

    fetch("/api/category")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, [pathname]);

  const logout = async () => {
    await fetch("/api/user/logout", { method: "POST" });
    setIsUserOpen(false);
    router.replace("/user/login");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-sky-700 text-sky-200 shadow-lg shadow-black/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-90 transition-opacity"
          >
            <Image
              src="/icons/logo512x512.png"
              alt="BeFAQT"
              width={64}
              height={64}
              className="w-12 h-12"
            />
            <div className="leading-snug ps-1">
              <div className="text-xl font-extrabold tracking-wider">
                BeFAQT
              </div>
              <div className="text-xs font-light">Trusted Traceability</div>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
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
          <div className="hidden md:flex gap-4 font-semibold items-center h-full">
            <Link
              href="/"
              className={`relative flex items-center h-full px-2 uppercase transition-colors hover:text-sky-100 ${
                pathname === "/"
                  ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-sky-300 after:content-['']"
                  : ""
              }`}
            >
              Home
            </Link>

            {/* About Dropdown */}
            <div
              className={`relative flex items-center h-full px-2 transition-colors hover:text-sky-100 ${
                pathname.startsWith("/about")
                  ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-sky-300 after:content-['']"
                  : ""
              }`}
              onMouseEnter={() => setIsAboutOpen(true)}
              onMouseLeave={() => setIsAboutOpen(false)}
            >
              <button className="flex items-center gap-1 py-1 uppercase hover:text-sky-100 transition-colors focus:outline-none cursor-default">
                About
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isAboutOpen ? "rotate-180" : ""}`}
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
              <div
                className={`absolute top-full right-0 mt-0 w-48 origin-top-right bg-sky-600 rounded-xl shadow-2xl py-2 text-white ring-1 ring-white/10 transition-all duration-200 normal-case font-medium ${
                  isAboutOpen
                    ? "visible opacity-100 translate-y-0"
                    : "invisible opacity-0 translate-y-2"
                }`}
              >
                {[
                  { name: "Project", href: "/about/project" },
                  { name: "Tech", href: "/about/tech" },
                  { name: "Team", href: "/about/team" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 hover:bg-white/20 transition-colors"
                    onClick={() => setIsAboutOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center h-full gap-4">
              <Link
                href="/product"
                className={`relative flex items-center h-full px-2 uppercase transition-colors hover:text-white ${
                  pathname === "/product" && !currentCategory
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-sky-300 after:content-['']"
                    : ""
                }`}
              >
                Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/product?category=${cat._id}`}
                  className={`relative flex items-center h-full px-2 uppercase transition-colors hover:text-white ${
                    pathname === "/product" && currentCategory === cat._id
                      ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-sky-300 after:content-['']"
                      : ""
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center h-full gap-4 ml-4 pl-8 border-l border-white/10">
              {sessionUser ? (
                <div
                  className={`relative flex items-center h-full px-2 transition-colors hover:text-sky-100 ${
                    pathname.startsWith("/user")
                      ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-sky-300 after:content-['']"
                      : ""
                  }`}
                  onMouseEnter={() => setIsUserOpen(true)}
                  onMouseLeave={() => setIsUserOpen(false)}
                >
                  <button className="flex items-center gap-2 py-1 uppercase hover:text-sky-100 transition-colors focus:outline-none cursor-default">
                    {sessionUser.avatar ? (
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-sky-400 transition-colors">
                        <Image
                          src={sessionUser.avatar}
                          alt={sessionUser.fname}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-sm font-bold border-2 border-white/20 group-hover:border-sky-400 transition-colors">
                        {sessionUser.fname.charAt(0)}
                      </div>
                    )}
                    {sessionUser.fname}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isUserOpen ? "rotate-180" : ""}`}
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
                  <div
                    className={`absolute top-full right-0 mt-0 w-48 origin-top-right bg-sky-600 rounded-xl shadow-2xl py-2 text-white ring-1 ring-white/10 transition-all duration-200 normal-case font-medium ${
                      isUserOpen
                        ? "visible opacity-100 translate-y-0"
                        : "invisible opacity-0 translate-y-2"
                    }`}
                  >
                    <Link
                      href="/user/dashboard"
                      className="block px-4 py-2 hover:bg-white/20 transition-colors"
                      onClick={() => setIsUserOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {sessionUser?.role === USER_ROLE.ADMIN ? (
                      <>
                        <Link
                          href="/user/manage"
                          className="block px-4 py-2 hover:bg-white/20 transition-colors"
                          onClick={() => setIsUserOpen(false)}
                        >
                          Manage Users
                        </Link>
                        <Link
                          href="/category/manage"
                          className="block px-4 py-2 hover:bg-white/20 transition-colors"
                          onClick={() => setIsUserOpen(false)}
                        >
                          Manage Categories
                        </Link>
                      </>
                    ) : sessionUser?.role === USER_ROLE.SELLER ? (
                      <Link
                        href="/product/manage"
                        className="block px-4 py-2 hover:bg-white/20 transition-colors"
                        onClick={() => setIsUserOpen(false)}
                      >
                        Manage Products
                      </Link>
                    ) : null}
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 hover:bg-white/20 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        Logout
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/user/login"
                    className="px-4 py-2 rounded-lg text-sky-100 hover:text-white hover:bg-white/5 transition-all font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/user/register"
                    className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white transition-all font-medium shadow-lg shadow-sky-500/20"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-sky-950/95 backdrop-blur-xl animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/"
                className="flex items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors uppercase font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/product"
                className="flex items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors uppercase font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider pl-2">
                About
              </h3>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { name: "Project", href: "/about/project" },
                  { name: "Tech", href: "/about/tech" },
                  { name: "Team", href: "/about/team" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider pl-2">
                Categories
              </h3>
              <div className="grid grid-cols-1 gap-1">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/product?category=${cat._id}`}
                    className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {sessionUser?.role === USER_ROLE.ADMIN && (
              <Link
                href="/user/manage"
                className="block p-4 rounded-xl bg-yellow-400/10 text-yellow-300 border border-yellow-400/20 text-center font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Manage Users
              </Link>
            )}

            <div className="pt-6 border-t border-white/10">
              {sessionUser ? (
                <div className="flex items-center justify-between">
                  <Link
                    href="/user/dashboard"
                    className="flex items-center gap-3"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center font-bold border-2 border-white/20">
                      {sessionUser.fname.charAt(0)}
                    </div>
                    <span className="font-medium text-white">
                      {sessionUser.fname}
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/user/login"
                    className="p-3 rounded-xl border border-white/10 text-center font-medium hover:bg-white/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/user/register"
                    className="p-3 rounded-xl bg-sky-500 text-white text-center font-medium shadow-lg shadow-sky-500/20 hover:bg-sky-400"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
