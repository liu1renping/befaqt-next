"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { type UserType } from "@/models/User";

export default function Register() {
  const router = useRouter();
  const [user, setUser] = useState<Partial<UserType>>({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    setFormError("");
  };

  const handleAddressChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setUser({ ...user, address: { ...user.address, [name]: value } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFieldErrors({});
    setLoading(true);

    if (user.password !== confirmPassword) {
      setFieldErrors({
        ...fieldErrors,
        confirmPassword: "Passwords do not match",
      });
      setLoading(false);
      return;
    }

    const res = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    setLoading(false);

    if (res.ok) {
      router.replace("/user/login");
    } else {
      const data = await res.json().catch(() => ({}));
      setFormError(data?.message || "Failed to register");
      if (data?.errors && typeof data.errors === "object")
        setFieldErrors(data.errors);
      return;
    }
  };

  const FieldError = ({ name }: { name?: string }) =>
    fieldErrors[name as string] ? (
      <p className="text-sm text-red-600">{fieldErrors[name as string]}</p>
    ) : null;

  return (
    <main className="main-page">
      <section className="section-form">
        <header>
          <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Account
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            Register
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Create an account to manage your products.
          </p>
        </header>
        {formError && (
          <div className="border border-red-300 bg-red-50 text-red-700 p-3 rounded">
            <p className="text-sm">{formError}</p>
          </div>
        )}

        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-2">
            <div>
              <input
                type="text"
                placeholder="First Name"
                name="fname"
                onChange={handleChange}
                className="input"
                required
              />
              <FieldError name="fname" />
            </div>

            <div>
              <input
                type="text"
                placeholder="Last Name"
                name="lname"
                onChange={handleChange}
                className="input"
                required
              />
              <FieldError name="lname" />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                className="input"
                required
              />
              <FieldError name="email" />
            </div>

            <div>
              <input
                type="text"
                placeholder="Phone Number"
                name="phone"
                onChange={handleChange}
                className="input"
              />
              <FieldError name="phone" />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                name="password"
                minLength={6}
                onChange={handleChange}
                className="input"
                required
              />
              <FieldError name="password" />
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                required
              />
              <FieldError name="confirmPassword" />
            </div>
          </div>

          <fieldset className="rounded-2xl border border-slate-300 p-4 dark:border-slate-800 mt-4">
            <legend className="px-2 text-xs uppercase tracking-widest text-slate-500">
              Address
            </legend>
            <div className="grid md:grid-cols-2 gap-2">
              <input
                className="md:col-span-2 input"
                name="street"
                placeholder="Street"
                onChange={handleAddressChange}
              />
              <input
                className="input"
                name="city"
                placeholder="City"
                onChange={handleAddressChange}
              />
              <input
                className="input"
                name="state"
                placeholder="State"
                onChange={handleAddressChange}
              />
              <input
                className="input"
                name="postalCode"
                placeholder="Post Code"
                onChange={handleAddressChange}
              />
              <input
                className="input"
                name="country"
                placeholder="Country"
                onChange={handleAddressChange}
              />
            </div>
          </fieldset>

          <button type="submit" className="button mt-4" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <hr className="my-2" />

        <p>Already have an account?</p>
        <div className="flex justify-center">
          <button
            type="button"
            className="w-full bg-sky-600 button"
            onClick={() => router.push("/user/login")}
          >
            Login your account
          </button>
        </div>
      </section>
    </main>
  );
}
