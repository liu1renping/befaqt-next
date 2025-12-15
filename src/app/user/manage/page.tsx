"use client";

import { useState, useEffect } from "react";
import { USER_ROLE, USER_STATUS } from "@/lib/constants";
import Link from "next/link";
import { UserType } from "@/models/User";

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [changedUsers, setChangedUsers] = useState<
    Record<string, Partial<UserType>>
  >({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/user/manage");
      if (!res.ok) {
        if (res.status === 401) {
          setError("Unauthorized. access denied.");
        } else {
          setError("Failed to fetch users.");
        }
        return;
      }
      const data = await res.json();
      setUsers(data);
      setChangedUsers({});
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (
    userId: string,
    field: "role" | "status",
    value: string
  ) => {
    setChangedUsers((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  const saveUser = async (userId: string) => {
    const changes = changedUsers[userId];
    if (!changes) return;

    setUpdating(userId);
    try {
      const payload = { userId, ...changes };
      const res = await fetch("/api/user/manage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const updatedUser = await res.json();

      setUsers((prev) =>
        prev.map((u) =>
          u._id === updatedUser._id ? { ...u, ...updatedUser } : u
        )
      );
      // Remove from changedUsers
      setChangedUsers((prev) => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    } finally {
      setUpdating(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setDeleting(userId);
    try {
      const res = await fetch(`/api/user/manage?userId=${userId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }

      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err: Error | unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error}</p>
        <Link href="/" className="mt-4 text-blue-500 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <main className="main-page">
      <section className="section-content max-w-7xl">
        <h1 className="text-2xl font-bold ps-3">User Management</h1>
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-sky-700 text-white text-left text-xs font-semibold uppercase tracking-wider">
              <th className="px-3 py-2 border-b-2">User</th>
              <th className="px-3 py-2 border-b-2">Email</th>
              <th className="px-3 py-2 border-b-2">Role</th>
              <th className="px-3 py-2 border-b-2">Status</th>
              <th className="px-3 py-2 border-b-2">Registered</th>
              <th className="px-3 py-2 border-b-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const changes = changedUsers[user._id] || {};
              const role = (changes.role as USER_ROLE) || user.role;
              const status = (changes.status as USER_STATUS) || user.status;
              const hasChanges = !!changedUsers[user._id];

              return (
                <tr key={user._id} className="even:bg-gray-100 odd:bg-white">
                  <td className="px-2 py-2 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap font-semibold">
                      {user.fname}&nbsp;{user.lname}
                    </p>
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {user.email}
                    </p>
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 text-sm">
                    <select
                      name="role"
                      value={role}
                      disabled={updating === user._id || deleting === user._id}
                      onChange={(e) =>
                        handleFieldChange(user._id, "role", e.target.value)
                      }
                      className={`block w-full border border-gray-400 hover:border-gray-500 px-2 py-1 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-xs ${
                        role === USER_ROLE.SELLER
                          ? "bg-green-100 border-green-400 text-green-700"
                          : role === USER_ROLE.ADMIN
                            ? "bg-red-100 border-red-400 text-red-700"
                            : ""
                      }`}
                    >
                      {Object.values(USER_ROLE).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 text-sm">
                    <select
                      name="status"
                      value={status}
                      disabled={updating === user._id || deleting === user._id}
                      onChange={(e) =>
                        handleFieldChange(user._id, "status", e.target.value)
                      }
                      className={`block w-full border px-2 py-1 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-xs ${
                        status === USER_STATUS.ACTIVE
                          ? "bg-green-100 border-green-400 text-green-700"
                          : status === USER_STATUS.INACTIVE
                            ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                            : "bg-slate-800 border-slate-800 text-slate-200"
                      }`}
                    >
                      {Object.values(USER_STATUS).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-2 py-2 border-b border-gray-200 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveUser(user._id)}
                        disabled={!hasChanges || updating === user._id}
                        className="button-sm"
                      >
                        {updating === user._id ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        disabled={
                          user.status !== USER_STATUS.DISABLED ||
                          deleting === user._id
                        }
                        className="button-sm bg-black"
                      >
                        {deleting === user._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-4 text-center text-gray-500">No users found.</div>
        )}
      </section>
    </main>
  );
}
