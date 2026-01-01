"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { type UserType } from "@/models/User";

export default function ProfilePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<Partial<UserType>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getProfile() {
      try {
        const res = await fetch("/api/user/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (res.status === 401) {
          router.replace("/user/signin");
          // Throwing an error to break the flow, handled in catch
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to load profile");
        }
        const data = await res.json();
        if (data && data.user) {
          setUserProfile(data.user);
          setLoading(false);
        }
      } catch (err) {
        if (err instanceof Error && err.message === "Unauthorized") {
          return;
        }
        console.error(err);
        setFormError(
          err instanceof Error ? err.message : "Failed to load profile"
        );
        setLoading(false);
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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFormError("");
    setFieldErrors({});

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUserProfile((prev) => ({ ...prev, avatar: data.url }));
        router.refresh(); // Refresh to update session data if needed
      } else {
        setFormError(data.message || "Failed to upload avatar");
        setFieldErrors({ avatar: data.message || "Failed to upload avatar" });
      }
    } catch (err) {
      console.error(err);
      setFormError(
        err instanceof Error ? err.message : "Failed to upload avatar"
      );
    } finally {
      setUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
    setSaving(false);
    if (res.ok) {
      router.push("/user/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      setFormError(data.message || "Failed to update profile");
      if (data.errors) {
        setFieldErrors(data.errors);
      }
    }
  };

  const FieldError = ({ name }: { name?: string }) =>
    fieldErrors[name as string] ? (
      <p className="text-sm text-red-600">{fieldErrors[name as string]}</p>
    ) : null;

  if (loading) {
    return (
      <main className="main-page">
        <div className="flex justify-center items-center h-64">
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </main>
    );
  }

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
          <div className="flex flex-col items-center mb-6 gap-4">
            {userProfile.avatar ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-300">
                <Image
                  src={userProfile.avatar}
                  alt="Avatar"
                  fill
                  sizes="96px" // 96px corresponds to the size of the avatar in the profile page w-24 h-24
                  priority
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-sky-500 flex items-center justify-center text-3xl font-bold text-white">
                {userProfile.fname?.charAt(0)}
              </div>
            )}
            <FieldError name="avatar" />

            <div className="flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className={`cursor-pointer text-sm text-blue-600 hover:text-blue-500 hover:underline ${
                  uploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {uploading ? "Uploading..." : "Change Photo"}
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-2">
            <div>
              <input
                type="text"
                placeholder="First Name"
                name="fname"
                autoComplete="given-name"
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
                autoComplete="family-name"
                value={userProfile.lname || ""}
                onChange={handleChange}
                className="input"
                required
              />
              <FieldError name="lname" />
            </div>
            <div>
              <input
                type="text"
                placeholder="Phone Number"
                name="tel"
                autoComplete="tel"
                value={userProfile.tel || ""}
                onChange={handleChange}
                className="input"
              />
              <FieldError name="tel" />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                name="email"
                autoComplete="email"
                value={userProfile.email || ""}
                onChange={handleChange}
                className="input bg-gray-100 cursor-not-allowed"
                disabled
              />
              <FieldError name="email" />
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
                autoComplete="street-address"
                placeholder="Street"
                onChange={handleAddressChange}
                value={userProfile.address?.street || ""}
              />
              <input
                className="input"
                name="city"
                autoComplete="address-level2"
                placeholder="City"
                onChange={handleAddressChange}
                value={userProfile.address?.city || ""}
              />
              <input
                className="input"
                name="state"
                autoComplete="address-level1"
                placeholder="State"
                onChange={handleAddressChange}
                value={userProfile.address?.state || ""}
              />
              <input
                className="input"
                name="postalCode"
                autoComplete="postal-code"
                placeholder="Post Code"
                onChange={handleAddressChange}
                value={userProfile.address?.postalCode || ""}
              />
              <input
                className="input"
                name="country"
                autoComplete="country-name"
                placeholder="Country"
                onChange={handleAddressChange}
                value={userProfile.address?.country || ""}
              />
            </div>
          </fieldset>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              className="button bg-slate-200 text-slate-700 hover:bg-slate-300 w-full md:w-auto mr-2"
              onClick={() => router.push("/user/dashboard")}
            >
              Cancel
            </button>
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
