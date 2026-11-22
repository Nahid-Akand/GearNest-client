
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ShoppingBag,
  CreditCard,
  Sparkles,
  SlidersHorizontal,
  Search,
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
    category?: string;
    images?: string[];
  };
}

const filters = [
  "all",
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "customer") {
      router.replace(
        user.role === "admin" ? "/admin/dashboard" : "/owner/dashboard"
      );
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/bookings/my-bookings");
        setBookings(response.data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Could not load your bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, authLoading, router]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      filter === "all" || booking.status === filter;

    const matchesSearch =
      booking.equipment?.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ?? false;

    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return <CheckCircle2 size={15} />;
      case "cancelled":
        return <XCircle size={15} />;
      default:
        return <Clock size={15} />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  const getPaymentStyle = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700";
      case "refunded":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending",
      value: bookings.filter((b) => b.status === "pending").length,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Confirmed",
      value: bookings.filter((b) => b.status === "confirmed").length,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Completed",
      value: bookings.filter((b) => b.status === "completed").length,
      icon: ShoppingBag,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  if (authLoading || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f7fa]">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your bookings...
          </p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "customer") return null;

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">

        {/* Back */}
        <Link
          href="/dashboard"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8 overflow-hidden rounded-[2rem] bg-[#101c2c] p-7 md:p-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <Sparkles size={14} />
                Customer Dashboard
              </span>

              <h1 className="mt-5 text-3xl font-black text-white md:text-4xl">
                My Bookings
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-300">
                Keep track of your equipment rentals, booking
                dates, and payment information in one place.
              </p>
            </div>

            <Link
              href="/equipment"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              Explore Equipment
              <ArrowRight size={17} />
            </Link>
          </div>
        </motion.section>

        {/* Statistics */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {item.label}
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-[#101c2c]">
                      {item.value}
                    </h2>
                  </div>

                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                    <Icon size={23} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button
              onClick={() => window.location.reload()}
              className="shrink-0 font-bold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Booking List */}
        <section className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm">

          {/* Section Header */}
          <div className="border-b border-slate-100 p-6 md:p-8">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl font-black text-[#101c2c]">
                  Your Rental History
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  View and manage all your equipment bookings.
                </p>
              </div>

              <div className="relative w-full lg:max-w-xs">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search equipment..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="mt-7 flex flex-wrap items-center gap-2">
              <div className="mr-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                <SlidersHorizontal size={15} />
                Filter
              </div>

              {filters.map((status) => {
                const count =
                  status === "all"
                    ? bookings.length
                    : bookings.filter((b) => b.status === status).length;

                return (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition ${
                      filter === status
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                    }`}
                  >
                    {status}
                    <span className="ml-2 opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results */}
          <div className="p-5 md:p-8">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">
                {filteredBookings.length} booking(s) found
              </p>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Package size={31} />
                </div>

                <h3 className="mt-5 text-xl font-black text-[#101c2c]">
                  No bookings found
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  {filter === "all"
                    ? "You haven't booked any equipment yet. Explore our collection and find what you need."
                    : `You don't have any ${filter} bookings matching your search.`}
                </p>

                <Link
                  href="/equipment"
                  className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  Browse Equipment
                  <ArrowRight size={17} />
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredBookings.map((booking, index) => (
                  <motion.article
                    key={booking._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/5"
                  >
                    <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:p-6">

                      {/* Equipment Image */}
                      <div className="h-44 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 md:h-32 md:w-40">
                        {booking.equipment?.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={booking.equipment.images[0]}
                            alt={booking.equipment.name || "Equipment"}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-300">
                            <Package size={42} />
                          </div>
                        )}
                      </div>

                      {/* Equipment Details */}
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            {booking.equipment?.category || "Equipment"}
                          </span>

                          <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold capitalize ${getStatusStyle(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </span>
                        </div>

                        <h3 className="text-lg font-black text-[#101c2c] transition group-hover:text-emerald-700">
                          {booking.equipment?.name || "Equipment rental"}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-2">
                            <CalendarDays size={15} className="text-emerald-600" />
                            {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
                          </span>

                          <span className="flex items-center gap-2">
                            <Clock size={15} className="text-emerald-600" />
                            {booking.totalDays} day(s)
                          </span>
                        </div>
                      </div>

                      {/* Price and Payment */}
                      <div className="flex shrink-0 flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 md:min-w-[170px] md:flex-col md:items-end md:border-l md:border-t-0 md:pl-6 md:pt-0">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Total Amount
                          </p>
                          <p className="mt-1 text-2xl font-black text-[#101c2c]">
                            ৳{Number(booking.totalPrice).toLocaleString()}
                          </p>
                        </div>

                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getPaymentStyle(booking.paymentStatus)}`}>
                          <CreditCard size={13} />
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
