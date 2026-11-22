
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Package,
  Clock,
  RefreshCw,
  Loader2,
  TrendingUp,
  UserRound,
  Store,
  ShieldCheck,
  BarChart3,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import toast from "react-hot-toast";

import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "owner" | "admin";
}

interface Equipment {
  _id: string;
  name: string;
  category: string;
  pricePerDay: number;
  status: string;
}

const COLORS = ["#3b82f6", "#10b981", "#a855f7"];

export default function AdminAnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      const [usersResponse, equipmentResponse] = await Promise.all([
        api.get("/users"),
        api.get("/equipment/pending"),
      ]);

      setUsers(usersResponse.data.users || []);
      setEquipment(equipmentResponse.data.equipment || []);
    } catch (error) {
      console.error("Analytics loading failed:", error);
      toast.error("Unable to load analytics.");
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

    fetchAnalytics();
  }, [user, authLoading, router, fetchAnalytics]);

  const roleStats = useMemo(() => {
    const customers = users.filter(
      (item) => item.role === "customer"
    ).length;

    const owners = users.filter(
      (item) => item.role === "owner"
    ).length;

    const admins = users.filter(
      (item) => item.role === "admin"
    ).length;

    return { customers, owners, admins };
  }, [users]);

  const userDistribution = useMemo(
    () => [
      { name: "Customers", value: roleStats.customers },
      { name: "Owners", value: roleStats.owners },
      { name: "Admins", value: roleStats.admins },
    ],
    [roleStats]
  );

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};

    equipment.forEach((item) => {
      const category = item.category || "Other";
      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [equipment]);

  const roleBreakdown = [
    {
      name: "Customers",
      value: roleStats.customers,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      name: "Equipment Owners",
      value: roleStats.owners,
      color: "bg-emerald-500",
      textColor: "text-emerald-600",
    },
    {
      name: "Administrators",
      value: roleStats.admins,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
  ];

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading analytics...
          </p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wider text-emerald-700">
              <TrendingUp size={18} />
              PLATFORM INSIGHTS
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Monitor GearNest users and equipment review activity.
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
          >
            <RefreshCw size={17} />
            Refresh Analytics
          </button>
        </div>

        {/* Overview Cards */}
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
                <Users size={25} />
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
                  {roleStats.customers}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserRound size={25} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Registered renters
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Equipment Owners
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {roleStats.owners}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Store size={25} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Registered providers
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Equipment
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {equipment.length}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock size={25} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Waiting for admin approval
            </p>
          </div>
        </section>

        {/* Charts */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* User Distribution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Users size={19} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  User Distribution
                </h2>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Registered accounts grouped by role.
              </p>
            </div>

            {users.length === 0 ? (
              <div className="flex h-72 items-center justify-center text-sm text-slate-400">
                No user data available.
              </div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={95}
                      innerRadius={55}
                      paddingAngle={3}
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [value, "Accounts"]}
                    />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
              {roleBreakdown.map((item) => (
                <div key={item.name} className="text-center">
                  <p className={`text-xl font-extrabold ${item.textColor}`}>
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Account Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <BarChart3 size={19} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Account Breakdown
                </h2>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Compare the number of accounts in each role.
              </p>
            </div>

            <div className="space-y-7">
              {roleBreakdown.map((item) => {
                const percentage =
                  users.length > 0
                    ? (item.value / users.length) * 100
                    : 0;

                return (
                  <div key={item.name}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-slate-700">
                        {item.name}
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {item.value}{" "}
                        <span className="font-medium text-slate-400">
                          ({percentage.toFixed(1)}%)
                        </span>
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-9 rounded-xl bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Activity size={17} />
                Platform Accounts
              </div>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {users.length}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Total registered users across all roles
              </p>
            </div>
          </div>
        </section>

        {/* Equipment Categories */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Package size={21} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Pending Equipment Categories
              </h2>
              <p className="text-sm text-slate-500">
                Category distribution of listings awaiting review.
              </p>
            </div>
          </div>

          {categoryStats.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No pending equipment available.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryStats.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-800">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Pending listings
                    </p>
                  </div>
                  <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-amber-100 px-2 text-sm font-bold text-amber-700">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-700">
          <ShieldCheck size={16} className="mt-0.5 shrink-0" />
          <p>
            Analytics are calculated from current API records. These charts
            show current account and pending equipment distributions, not
            historical trends, booking totals, or verified revenue.
          </p>
        </div>
      </div>
    </main>
  );
}
