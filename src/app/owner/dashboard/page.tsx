
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  PlusCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  Loader2,
  TrendingUp,
  LayoutDashboard,
  RefreshCw,
  Wallet,
  CircleCheck,
  AlertCircle,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";

interface Equipment {
  _id: string;
  name: string;
  pricePerDay: number;
  status: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  createdAt?: string;
}

interface Booking {
  _id: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  startDate: string;
  endDate: string;
  equipment?: {
    name: string;
  };
  customer?: {
    name: string;
    email: string;
  };
}

const formatPrice = (amount: number) =>
  `৳${Number(amount || 0).toLocaleString("en-BD")}`;

const formatDate = (date: string) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
    case "confirmed":
    case "completed":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";

    case "pending":
      return "bg-amber-50 text-amber-700 ring-amber-200";

    case "rejected":
    case "cancelled":
      return "bg-red-50 text-red-700 ring-red-200";

    default:
      return "bg-slate-100 text-slate-600 ring-slate-200";
  }
};

export default function OwnerDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [equipmentResponse, bookingResponse] = await Promise.all([
        api.get("/equipment/my-equipment"),
        api.get("/bookings/owner-bookings"),
      ]);

      setEquipment(equipmentResponse.data.equipment || []);
      setBookings(bookingResponse.data.bookings || []);
    } catch (err) {
      console.error("Owner dashboard error:", err);
      setError("We couldn't load your dashboard. Please try again.");
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

    if (user.role !== "owner") {
      router.replace(
        user.role === "admin" ? "/admin/dashboard" : "/dashboard"
      );
      return;
    }

    fetchDashboard();
  }, [user, authLoading, router, fetchDashboard]);

  const pendingEquipment = equipment.filter(
    (item) => item.status === "pending"
  );

  const approvedEquipment = equipment.filter(
    (item) => item.status === "approved"
  );

  const rejectedEquipment = equipment.filter(
    (item) => item.status === "rejected"
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  );

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );

  const paidEarnings = bookings
    .filter((booking) => booking.paymentStatus === "paid")
    .reduce(
      (total, booking) => total + Number(booking.totalPrice || 0),
      0
    );

  const stats = [
    {
      label: "Total Equipment",
      value: equipment.length,
      description: "All your listings",
      icon: Package,
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      label: "Approved Listings",
      value: approvedEquipment.length,
      description: "Visible to customers",
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Pending Approval",
      value: pendingEquipment.length,
      description: "Waiting for admin review",
      icon: Clock,
      iconStyle: "bg-amber-50 text-amber-600",
    },
    {
      label: "Paid Earnings",
      value: formatPrice(paidEarnings),
      description: "From paid bookings",
      icon: Wallet,
      iconStyle: "bg-purple-50 text-purple-600",
    },
  ];

  if (authLoading || (loading && !error)) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "owner") {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <LayoutDashboard size={17} />
              OWNER WORKSPACE
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back, {user.name?.split(" ")[0] || "Owner"}!
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Here's an overview of your equipment rental business.
            </p>
          </div>

          <Link
            href="/owner/equipment/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/15 transition hover:-translate-y-0.5 hover:bg-emerald-700"
          >
            <PlusCircle size={18} />
            Add New Equipment
          </Link>
        </section>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="shrink-0 text-red-600" size={20} />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>

            <button
              type="button"
              onClick={fetchDashboard}
              className="inline-flex items-center gap-2 self-start rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-700 ring-1 ring-red-200 transition hover:bg-red-100 sm:self-auto"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        )}

        {!error && (
          <>
            {/* Overview Cards */}
            <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {stat.label}
                        </p>

                        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">
                          {stat.value}
                        </h2>
                      </div>

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconStyle}`}
                      >
                        <Icon size={23} />
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                      {stat.description}
                    </p>
                  </div>
                );
              })}
            </section>

            {/* Booking Summary */}
            <section className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CalendarCheck size={21} />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Confirmed Bookings
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {confirmedBookings.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Clock size={21} />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Pending Bookings
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {pendingBookings.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <XCircle size={21} />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Rejected Listings
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {rejectedEquipment.length}
                  </p>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="mb-8">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  Quick Actions
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage your rental business quickly.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Link
                  href="/owner/equipment"
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Package size={23} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        My Equipment
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Manage your listings
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={19}
                    className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600"
                  />
                </Link>

                <Link
                  href="/owner/bookings"
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <CalendarDays size={23} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Rental Bookings
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        View customer rentals
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={19}
                    className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                  />
                </Link>

                <Link
                  href="/owner/equipment/create"
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <PlusCircle size={23} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Add Equipment
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Create a new listing
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={19}
                    className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-purple-600"
                  />
                </Link>
              </div>
            </section>

            {/* Recent Equipment */}
            <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    My Equipment
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your latest equipment listings
                  </p>
                </div>

                <Link
                  href="/owner/equipment"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
                >
                  View All
                  <ArrowRight size={16} />
                </Link>
              </div>

              {equipment.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Package size={30} />
                  </div>

                  <h3 className="mt-4 font-bold text-slate-900">
                    No equipment listed yet
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Start your rental business by adding your first item.
                  </p>

                  <Link
                    href="/owner/equipment/create"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    <PlusCircle size={17} />
                    Add Your First Equipment
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {equipment.slice(0, 5).map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col justify-between gap-3 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:px-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <Package size={21} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {formatPrice(item.pricePerDay)} / day
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pl-14 sm:pl-0">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusStyle(item.status)}`}
                        >
                          {item.status}
                        </span>

                        <span
                          className={`text-xs font-medium ${
                            item.isAvailable
                              ? "text-emerald-600"
                              : "text-slate-400"
                          }`}
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Recent Bookings */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Recent Rental Bookings
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Latest activity from your customers
                  </p>
                </div>

                <Link
                  href="/owner/bookings"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
                >
                  View All
                  <ArrowRight size={16} />
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <ClipboardList size={30} />
                  </div>

                  <h3 className="mt-4 font-bold text-slate-900">
                    No rental bookings yet
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Customer bookings will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking._id}
                      className="flex flex-col justify-between gap-3 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:px-6"
                    >
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {booking.equipment?.name || "Equipment"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Customer: {booking.customer?.name || "Customer"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatDate(booking.startDate)} –{" "}
                          {formatDate(booking.endDate)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pl-0 sm:justify-end">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusStyle(booking.status)}`}
                        >
                          {booking.status}
                        </span>

                        <span className="font-bold text-slate-900">
                          {formatPrice(booking.totalPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
