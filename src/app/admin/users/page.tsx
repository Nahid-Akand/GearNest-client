
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  RefreshCw,
  Loader2,
  ShieldCheck,
  UserRound,
  Store,
  Shield,
  UserCog,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "owner" | "admin";
  isActive?: boolean;
}

type RoleFilter = "all" | AdminUser["role"];

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/users");
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Unable to load users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace(
        user.role === "owner" ? "/owner/dashboard" : "/dashboard"
      );
      return;
    }

    fetchUsers();
  }, [user, authLoading, router, fetchUsers]);

  const handleRoleChange = async (
    userId: string,
    newRole: AdminUser["role"]
  ) => {
    if (userId === user?.id) {
      toast.error("You cannot change your own admin role.");
      return;
    }

    const previousUser = users.find((item) => item._id === userId);

    if (!previousUser || previousUser.role === newRole) return;

    try {
      setUpdatingId(userId);

      await api.patch(`/users/${userId}/role`, {
        role: newRole,
      });

      setUsers((previous) =>
        previous.map((item) =>
          item._id === userId
            ? { ...item, role: newRole }
            : item
        )
      );

      toast.success("User role updated successfully.");
    } catch (error) {
      console.error("Role update failed:", error);
      toast.error("Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" || item.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const customerCount = users.filter(
    (item) => item.role === "customer"
  ).length;

  const ownerCount = users.filter(
    (item) => item.role === "owner"
  ).length;

  const adminCount = users.filter(
    (item) => item.role === "admin"
  ).length;

  const getRoleStyle = (role: AdminUser["role"]) => {
    switch (role) {
      case "admin":
        return "bg-purple-50 text-purple-700 ring-purple-200";
      case "owner":
        return "bg-amber-50 text-amber-700 ring-amber-200";
      default:
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    }
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "U"
    );
  };

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading users...
          </p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wider text-emerald-700">
              <ShieldCheck size={18} />
              ADMINISTRATION
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Manage Users
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Manage registered accounts and control platform user roles.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh Users
          </button>
        </div>

        {/* Statistics */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Users
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {users.length}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              All registered accounts
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Customers
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {customerCount}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UserRound size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Equipment renters
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Equipment Owners
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {ownerCount}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Store size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Equipment providers
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Administrators
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {adminCount}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Shield size={24} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Platform administrators
            </p>
          </div>
        </section>

        {/* Users Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Registered Accounts
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {filteredUsers.length} of {users.length} users displayed
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-400">
                <UserCog size={18} />
                Role Management
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Role Filter */}
              <div className="relative lg:w-56">
                <Filter
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(event.target.value as RoleFilter)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customers</option>
                  <option value="owner">Owners</option>
                  <option value="admin">Administrators</option>
                </select>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Users size={30} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-800">
                No users found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or role filter.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setRoleFilter("all");
                }}
                className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead className="bg-slate-50">
                  <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email Address</th>
                    <th className="px-6 py-4">Current Role</th>
                    <th className="px-6 py-4">Change Role</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((item) => (
                    <tr
                      key={item._id}
                      className="transition hover:bg-slate-50/80"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                            {getInitials(item.name)}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {item.name}
                            </p>
                            {item._id === user.id && (
                              <span className="mt-1 inline-block text-xs font-semibold text-emerald-600">
                                Your account
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.email}
                      </td>

                      {/* Current Role */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ring-inset ${getRoleStyle(item.role)}`}
                        >
                          {item.role === "admin" ? (
                            <ShieldCheck size={13} />
                          ) : item.role === "owner" ? (
                            <Store size={13} />
                          ) : (
                            <UserRound size={13} />
                          )}
                          {item.role}
                        </span>
                      </td>

                      {/* Change Role */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={item.role}
                            disabled={
                              item._id === user.id ||
                              updatingId === item._id
                            }
                            onChange={(event) =>
                              handleRoleChange(
                                item._id,
                                event.target.value as AdminUser["role"]
                              )
                            }
                            className="w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                          >
                            <option value="customer">Customer</option>
                            <option value="owner">Owner</option>
                            <option value="admin">Admin</option>
                          </select>

                          {updatingId === item._id && (
                            <Loader2
                              size={17}
                              className="animate-spin text-emerald-600"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          {filteredUsers.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-700">
                  {filteredUsers.length}
                </span>{" "}
                users. Your own administrator role cannot be changed here.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
