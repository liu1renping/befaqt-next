"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { type UserType } from "@/models/User";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<Partial<UserType>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function getProfile() {
      try {
        const res = await fetch("/api/user/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const data = await res.json();
        if (data && data.user) {
          setUserProfile(data.user);
        }
      } catch (err) {
        console.error(err);
        setFormError(
          err instanceof Error ? err.message : "Failed to load profile"
        );
      }
    }
    getProfile();
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setFormError("");
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    setFieldErrors({});

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userProfile),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      router.push("/user/dashboard");
      router.refresh();
    } else {
      setFormError(data?.message || "Failed to update profile");
      if (data?.errors && typeof data.errors === "object")
        setFieldErrors(data.errors);
    }
    setSaving(false);
  };

  const FieldError = ({ name }: { name?: string }) =>
    fieldErrors[name as string] ? (
      <p className="text-sm text-red-600">{fieldErrors[name as string]}</p>
    ) : null;

  return (
    <main className="main-page">
      <section className="section-form max-w-2xl w-full">
        <header>
          <p className="text-sm uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Profile
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            User Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Update your profile information.
          </p>
        </header>
        {formError && (
          <div className="border border-red-300 bg-red-50 text-red-700 p-3 rounded">
            <p className="text-sm">{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-2">
            <div>
              <input
                type="text"
                placeholder="First Name"
                name="fname"
                value={userProfile.fname || ""}
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
                value={userProfile.lname || ""}
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
                value={userProfile.email || ""}
                onChange={handleChange}
                className="input bg-gray-100 cursor-not-allowed"
                disabled
              />
              <FieldError name="email" />
            </div>

            <div>
              <input
                type="text"
                placeholder="Phone Number"
                name="phone"
                value={userProfile.phone || ""}
                onChange={handleChange}
                className="input"
              />
              <FieldError name="phone" />
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
                value={userProfile.address?.street || ""}
              />
              <input
                className="input"
                name="city"
                placeholder="City"
                onChange={handleAddressChange}
                value={userProfile.address?.city || ""}
              />
              <input
                className="input"
                name="state"
                placeholder="State"
                onChange={handleAddressChange}
                value={userProfile.address?.state || ""}
              />
              <input
                className="input"
                name="postalCode"
                placeholder="Post Code"
                onChange={handleAddressChange}
                value={userProfile.address?.postalCode || ""}
              />
              <input
                className="input"
                name="country"
                placeholder="Country"
                onChange={handleAddressChange}
                value={userProfile.address?.country || ""}
              />
            </div>
          </fieldset>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="button w-full md:w-auto"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
