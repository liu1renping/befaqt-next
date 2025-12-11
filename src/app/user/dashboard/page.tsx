import { redirect } from "next/navigation";
import Link from "next/link";
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
      <section className="section-content max-w-2xl w-full">
        <header className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-white">
            Welcome, {user.fname}!
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Manage your account and settings.
          </p>
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
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {user.phone || "Not provided"}
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
          <Link href="/user/profile" className="button">
            Edit Profile
          </Link>
        </div>
      </section>
    </main>
  );
}
