"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { type UserType } from "@/models/User";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState<Partial<UserType>>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setUser({ ...user, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    setFormError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});
    setLoading(true);
    const res = await fetch("/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    setLoading(false);
    if (res.ok) {
      router.replace("/");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setFormError(data?.message || "Failed to login");
      if (data?.errors && typeof data.errors === "object")
        setFieldErrors(data.errors);
    }
  }

  const FieldError = ({ name }: { name?: string }) =>
    fieldErrors[name as string] ? (
      <p className="text-sm text-red-600">{fieldErrors[name as string]}</p>
    ) : null;

  return (
    <main className="main-page">
      <section className="section-form max-w-md">
        <header>
          <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Account
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Log in
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Sign in to continue where you left off.
          </p>
        </header>

        {formError && (
          <div className="border border-red-300 bg-red-50 text-red-700 p-3 rounded">
            <p className="text-sm">{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email"
              onChange={handleChange}
              className="input"
              required
            />
            <FieldError name="email" />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              name="password"
              autoComplete="current-password"
              onChange={handleChange}
              className="input"
              required
            />
            <FieldError name="password" />
          </div>

          <button type="submit" className="button mt-4" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <hr className="my-2" />

        <p>Don&lsquo;t have an account?</p>
        <div className="flex justify-center">
          <button
            type="button"
            className="w-full bg-sky-600 button"
            onClick={() => router.push("/user/register")}
          >
            Create an Account
          </button>
        </div>
      </section>
    </main>
  );
}
