import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/session";
import connectDB from "@/lib/mongoose";
import { UserModel as User, type UserType } from "@/models/User";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.userData?._id) {
    redirect("/user/login");
  }

  await connectDB();
  const user = await User.findById(session.userData._id)
    .select("-password")
    .lean<UserType>();

  if (!user) {
    redirect("/user/login");
  }

  return (
    <main className="main-page">
      <h1 className="page-title">Dashboard</h1>
      <section className="section-content max-w-2xl w-full mx-auto">
        <header className="mb-6 border-b pb-4 flex items-center gap-4">
          {user.avatar ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-300">
              <Image
                src={user.avatar}
                alt={user.fname}
                fill
                sizes="64px" // 64px corresponds to the size of the avatar in the dashboard header w-16 h-16
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-sky-500 flex items-center justify-center text-2xl font-bold text-white">
              {user.fname.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-semibold mb-1 text-slate-800 dark:text-white">
              Welcome, {user.fname}!
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Manage your account and settings.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">
              Profile Information
            </h3>
            <div className="space-y-1 text-slate-600 dark:text-slate-400">
              <p>
                <span className="font-medium">Name:</span> {user.fname}{" "}
                {user.lname}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {user.tel || "Not provided"}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">
              Address
            </h3>
            <div className="space-y-1 text-slate-600 dark:text-slate-400">
              {user.address ? (
                <>
                  <p>{user.address.street}</p>
                  <p>
                    {user.address.city}, {user.address.state}
                  </p>
                  <p>
                    {user.address.postalCode}, {user.address.country}
                  </p>
                </>
              ) : (
                <p>No address provided</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <Link href="/user/profile" className="button inline-block text-white">
            Edit Profile
          </Link>
        </div>
      </section>
    </main>
  );
}
