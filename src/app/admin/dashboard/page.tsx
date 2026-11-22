
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Package,
  Clock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
}

interface Equipment {
  _id: string;
  name: string;
  category: string;
  pricePerDay: number;
  location: string;
  status: string;
  owner?: {
    name: string;
    email: string;
  };
}

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pendingEquipment, setPendingEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [usersResponse, equipmentResponse] = await Promise.all([
        api.get("/users"),
        api.get("/equipment/pending"),
      ]);

      setUsers(usersResponse.data.users || []);
      setPendingEquipment(equipmentResponse.data.equipment || []);
    } catch (err) {
      console.error("Admin dashboard loading failed:", err);
      setError("Unable to load dashboard information.");
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

    fetchDashboard();
  }, [user, authLoading, router, fetchDashboard]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
          <p className="mt-4 text-sm text-slate-500">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  const customers = users.filter((item) => item.role === "customer");
  const owners = users.filter((item) => item.role === "owner");

  const statistics = [
    {
      label: "Total Users",
      value: users.length,
      description: "Registered platform users",
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Customers",
      value: customers.length,
      description: "Equipment renters",
      icon: Users,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Equipment Owners",
      value: owners.length,
      description: "Registered equipment owners",
      icon: Package,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Pending Equipment",
      value: pendingEquipment.length,
      description: "Listings awaiting review",
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Welcome Section */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-xl md:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <ShieldCheck size={15} />
                Administration
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                Welcome, {user.name}!
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
                Manage GearNest users, review equipment listings, and monitor
                marketplace activity from your administration dashboard.
              </p>
            </div>

            <button
              onClick={fetchDashboard}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-emerald-50"
            >
              <RefreshCw size={17} />
              Refresh Dashboard
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-white/10 pt-5 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Administrator access active
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} />
              GearNest Management
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={fetchDashboard}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics */}
        <section className="mb-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Platform Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick summary of your marketplace.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statistics.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className={`rounded-xl p-3 ${item.color}`}>
                      <Icon size={22} />
                    </div>
                    <TrendingUp size={18} className="text-slate-300" />
                  </div>

                  <h3 className="mt-5 text-3xl font-extrabold text-slate-900">
                    {item.value}
                  </h3>

                  <p className="mt-1 font-semibold text-slate-700">
                    {item.label}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Management Shortcuts */}
        <section className="mb-8">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Quick Management
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Access important administration tools.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Link
              href="/admin/users"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Manage Users</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    View users and manage roles
                  </p>
                </div>
              </div>
              <ArrowRight
                size={19}
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600"
              />
            </Link>

            <Link
              href="/admin/equipment"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    Manage Equipment
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Review and approve listings
                  </p>
                </div>
              </div>
              <ArrowRight
                size={19}
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600"
              />
            </Link>

            <Link
              href="/admin/analytics"
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Analytics</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Monitor marketplace activity
                  </p>
                </div>
              </div>
              <ArrowRight
                size={19}
                className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600"
              />
            </Link>
          </div>
        </section>

        {/* Pending Equipment */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                  <Clock size={19} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Pending Equipment Approval
                </h2>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Equipment waiting for administrative review.
              </p>
            </div>

            <Link
              href="/admin/equipment"
              className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          {pendingEquipment.length === 0 ? (
            <div className="rounded-xl bg-emerald-50/70 px-5 py-12 text-center">
              <CheckCircle2
                size={42}
                className="mx-auto mb-3 text-emerald-600"
              />
              <h3 className="font-bold text-slate-800">
                No pending equipment
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                All submitted listings have been reviewed.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingEquipment.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-emerald-200 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.category} · {item.location}
                    </p>
                    <p className="mt-2 text-sm font-bold text-emerald-700">
                      ৳{Number(item.pricePerDay).toLocaleString("en-BD")} / day
                    </p>
                    {item.owner?.name && (
                      <p className="mt-1 text-xs text-slate-400">
                        Owner: {item.owner.name}
                      </p>
                    )}
                  </div>

                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                    <Clock size={13} />
                    Pending Review
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
