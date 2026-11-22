
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Package,
  UserRound,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Search,
  CreditCard,
  TrendingUp,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";

interface Booking {
  _id: string;
  status: string;
  paymentStatus: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  equipment?: {
    _id: string;
    name: string;
  };
  customer?: {
    name: string;
    email: string;
  };
}

const filters = [
  "all",
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

export default function OwnerBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/owner-bookings");
      setBookings(response.data.bookings || []);
    } catch (err) {
      console.error("Owner bookings loading failed:", err);
      setError("Unable to load rental bookings. Please try again.");
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

    fetchBookings();
  }, [user, authLoading, router, fetchBookings]);

  const stats = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: bookings.filter((b) => b.status === "confirmed").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      revenue: bookings
        .filter((b) => b.paymentStatus === "paid")
        .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0),
    }),
    [bookings]
  );

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesFilter =
        filter === "all" || booking.status === filter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        !searchText ||
        booking.equipment?.name?.toLowerCase().includes(searchText) ||
        booking.customer?.name?.toLowerCase().includes(searchText) ||
        booking.customer?.email?.toLowerCase().includes(searchText) ||
        booking._id.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [bookings, filter, search]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      case "completed":
        return "bg-blue-50 text-blue-700 ring-blue-200";
      case "cancelled":
        return "bg-red-50 text-red-700 ring-red-200";
      default:
        return "bg-amber-50 text-amber-700 ring-amber-200";
    }
  };

  const getPaymentStyle = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      case "refunded":
        return "bg-blue-50 text-blue-700 ring-blue-200";
      default:
        return "bg-amber-50 text-amber-700 ring-amber-200";
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === "confirmed" || status === "completed") {
      return <CheckCircle2 size={14} />;
    }

    if (status === "cancelled") {
      return <XCircle size={14} />;
    }

    return <Clock size={14} />;
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
          <p className="mt-4 text-sm text-slate-500">
            Loading your bookings...
          </p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "owner") return null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/owner/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <ClipboardList size={14} />
              Owner Management
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Rental Bookings
            </h1>

            <p className="mt-2 text-sm text-slate-500 md:text-base">
              Track customer reservations and monitor your rental activity.
            </p>
          </div>

          <button
            onClick={fetchBookings}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh Bookings
          </button>
        </div>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                <ClipboardList size={21} />
              </div>
              <span className="text-xs font-semibold text-slate-400">
                All bookings
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {stats.total}
            </p>
            <p className="mt-1 text-sm text-slate-500">Total reservations</p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock size={21} />
              </div>
              <span className="text-xs font-semibold text-amber-600">
                Waiting
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {stats.pending}
            </p>
            <p className="mt-1 text-sm text-slate-500">Pending bookings</p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={21} />
              </div>
              <span className="text-xs font-semibold text-emerald-600">
                Approved
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {stats.confirmed}
            </p>
            <p className="mt-1 text-sm text-slate-500">Confirmed bookings</p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Package size={21} />
              </div>
              <span className="text-xs font-semibold text-blue-600">
                Finished
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {stats.completed}
            </p>
            <p className="mt-1 text-sm text-slate-500">Completed bookings</p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                <TrendingUp size={21} />
              </div>
              <span className="text-xs font-semibold text-purple-600">
                Paid only
              </span>
            </div>
            <p className="mt-4 text-2xl font-extrabold text-slate-900">
              ৳{stats.revenue.toLocaleString("en-BD")}
            </p>
            <p className="mt-1 text-sm text-slate-500">Paid booking totals</p>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-red-700">
              <AlertCircle size={20} />
              {error}
            </div>
            <button
              onClick={fetchBookings}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Search and filters */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search equipment, customer, booking ID..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((status) => {
                const count =
                  status === "all"
                    ? bookings.length
                    : bookings.filter((b) => b.status === status).length;

                return (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`rounded-xl px-3 py-2 text-xs font-bold capitalize transition sm:px-4 sm:text-sm ${
                      filter === status
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {status} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Booking list */}
        {filteredBookings.length === 0 && !error ? (
          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CalendarDays size={30} />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              {search || filter !== "all"
                ? "No matching bookings"
                : "No bookings yet"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {search || filter !== "all"
                ? "Try changing your search term or selecting another status."
                : "When customers book your equipment, their reservations will appear here."}
            </p>

            {search || filter !== "all" ? (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-6 rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/owner/equipment"
                className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                View My Equipment
              </Link>
            )}
          </section>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Booking Results
              </h2>
              <span className="text-sm text-slate-500">
                {filteredBookings.length} found
              </span>
            </div>

            {filteredBookings.map((booking) => (
              <article
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-6 lg:flex-row">
                    {/* Equipment and customer */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                          <Package size={23} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-slate-900">
                            {booking.equipment?.name || "Equipment"}
                          </h3>
                          <p className="mt-1 break-all text-xs text-slate-400">
                            Booking ID: {booking._id}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                            Customer
                          </p>

                          <div className="space-y-2 text-sm text-slate-600">
                            <p className="flex items-center gap-2">
                              <UserRound
                                size={16}
                                className="shrink-0 text-slate-400"
                              />
                              {booking.customer?.name || "Customer"}
                            </p>

                            {booking.customer?.email && (
                              <p className="flex items-center gap-2 break-all">
                                <Mail
                                  size={16}
                                  className="shrink-0 text-slate-400"
                                />
                                {booking.customer.email}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                            Rental Period
                          </p>

                          <div className="space-y-2 text-sm text-slate-600">
                            <p className="flex items-center gap-2">
                              <CalendarDays
                                size={16}
                                className="shrink-0 text-slate-400"
                              />
                              {formatDate(booking.startDate)} –{" "}
                              {formatDate(booking.endDate)}
                            </p>

                            <p className="flex items-center gap-2">
                              <Clock
                                size={16}
                                className="shrink-0 text-slate-400"
                              />
                              {booking.totalDays} day(s)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price and status */}
                    <div className="flex flex-col justify-between gap-5 border-t border-slate-100 pt-5 lg:min-w-52 lg:items-end lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                      <div className="lg:text-right">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Booking Total
                        </p>
                        <p className="mt-1 text-2xl font-extrabold text-emerald-700">
                          ৳{Number(booking.totalPrice || 0).toLocaleString("en-BD")}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ring-inset ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ring-inset ${getPaymentStyle(
                            booking.paymentStatus
                          )}`}
                        >
                          <CreditCard size={13} />
                          {booking.paymentStatus || "unpaid"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
