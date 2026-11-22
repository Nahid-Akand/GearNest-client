
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Heart,
  Package,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  LayoutDashboard,
  UserRound,
  Sparkles,
  TrendingUp,
  ShoppingBag,
  Wallet,
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
    images?: string[];
    category?: string;
  };
}

interface Favorite {
  _id: string;
  equipment?: {
    _id: string;
    name: string;
    pricePerDay: number;
    images?: string[];
    category?: string;
  };
}

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function CustomerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role === "owner") {
      router.replace("/owner/dashboard");
      return;
    }

    if (user.role === "admin") {
      router.replace("/admin/dashboard");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const [bookingResponse, favoriteResponse] = await Promise.all([
          api.get("/bookings/my-bookings"),
          api.get("/favorites"),
        ]);

        setBookings(bookingResponse.data.bookings || []);
        setFavorites(favoriteResponse.data.favorites || []);
      } catch (err) {
        console.error("Dashboard loading failed:", err);
        setError(
          "Unable to load your dashboard. Please refresh the page."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f7fa]">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Preparing your dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "customer") return null;

  const activeBookings = bookings.filter(
    (booking) =>
      booking.status === "pending" ||
      booking.status === "confirmed"
  );

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed"
  );

  const stats = [
    {
      label: "Total Bookings",
      value: bookings.length,
      description: "All your rental activity",
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      iconBg: "bg-blue-50",
    },
    {
      label: "Active Bookings",
      value: activeBookings.length,
      description: "Pending or confirmed rentals",
      icon: CalendarDays,
      color: "bg-emerald-50 text-emerald-600",
      iconBg: "bg-emerald-50",
    },
    {
      label: "Completed Rentals",
      value: completedBookings.length,
      description: "Successfully completed",
      icon: CheckCircle2,
      color: "bg-purple-50 text-purple-600",
      iconBg: "bg-purple-50",
    },
    {
      label: "Saved Favorites",
      value: favorites.length,
      description: "Equipment you have saved",
      icon: Heart,
      color: "bg-rose-50 text-rose-600",
      iconBg: "bg-rose-50",
    },
  ];

  const quickLinks = [
    {
      title: "My Rentals",
      description: "Track and manage your bookings",
      href: "/dashboard/bookings",
      icon: CalendarDays,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "My Favorites",
      description: "Explore your saved equipment",
      href: "/dashboard/favorites",
      icon: Heart,
      color: "bg-rose-50 text-rose-600",
    },
    {
      title: "My Profile",
      description: "Manage your personal information",
      href: "/dashboard/profile",
      icon: UserRound,
      color: "bg-blue-50 text-blue-600",
    },
  ];

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

  const getStatusIcon = (status: string) => {
    if (status === "confirmed" || status === "completed") {
      return <CheckCircle2 size={14} />;
    }

    if (status === "cancelled") {
      return <XCircle size={14} />;
    }

    return <Clock size={14} />;
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">

        {/* Dashboard Header */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative mb-9 overflow-hidden rounded-[2rem] bg-[#101c2c] p-7 shadow-xl shadow-slate-900/10 md:p-11"
        >
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <Sparkles size={14} />
                Customer Dashboard
              </div>

              <h1 className="text-3xl font-black leading-tight text-white md:text-5xl">
                Welcome back,
                <span className="block text-emerald-400">
                  {user.name || "Customer"}!
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                Everything you need to manage your equipment rentals
                is right here. Check your bookings, revisit your
                favorites, and discover something new.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <UserRound size={16} className="text-emerald-400" />
                  {user.email}
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-slate-500 sm:block" />
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold capitalize text-emerald-300">
                  {user.role} account
                </span>
              </div>
            </div>

            <Link
              href="/equipment"
              className="inline-flex h-14 shrink-0 items-center justify-center gap-3 rounded-xl bg-emerald-500 px-7 text-sm font-black text-white transition hover:bg-emerald-400"
            >
              <ShoppingBag size={18} />
              Explore Equipment
              <ArrowRight size={17} />
            </Link>
          </div>
        </motion.section>

        {/* Error Message */}
        {error && (
          <div className="mb-7 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
            <XCircle size={20} />
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                Overview
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#101c2c]">
                Your Activity
              </h2>
            </div>

            <div className="hidden items-center gap-2 text-xs font-semibold text-slate-400 sm:flex">
              <TrendingUp size={16} />
              Rental summary
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg} ${item.color.split(" ")[1]}`}
                    >
                      <Icon size={23} />
                    </div>

                    <span className="text-3xl font-black tabular-nums text-[#101c2c]">
                      {item.value}
                    </span>
                  </div>

                  <h3 className="mt-6 text-sm font-bold text-slate-800">
                    {item.label}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Quick Access */}
        <section className="mb-10">
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
              Quick Access
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#101c2c]">
              Manage Your Account
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {quickLinks.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="group flex h-full items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${item.color}`}
                      >
                        <Icon size={25} />
                      </div>

                      <div>
                        <h3 className="font-black text-[#101c2c]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <ArrowRight
                      size={19}
                      className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Recent Bookings */}
        <section className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-6 md:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                Rental History
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#101c2c]">
                Recent Bookings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep track of your latest equipment rentals.
              </p>
            </div>

            <Link
              href="/dashboard/bookings"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-emerald-500 hover:text-emerald-600"
            >
              View All
              <ArrowRight size={15} />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
                <LayoutDashboard size={35} />
              </div>

              <h3 className="mt-6 text-xl font-black text-[#101c2c]">
                No bookings yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-7 text-slate-500">
                You haven't rented any equipment yet. Explore
                available listings and find what you need for
                your next project.
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
            <div className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="flex flex-col justify-between gap-5 px-6 py-6 transition hover:bg-slate-50/80 md:flex-row md:items-center md:px-8"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <Package size={22} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-[#101c2c]">
                        {booking.equipment?.name || "Equipment"}
                      </h3>

                      {booking.equipment?.category && (
                        <p className="mt-1 text-xs text-slate-400">
                          {booking.equipment.category}
                        </p>
                      )}

                      <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <CalendarDays size={14} />
                        {new Date(booking.startDate).toLocaleDateString()}
                        <span>—</span>
                        {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 md:justify-end">
                    <div className="mr-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Total Price
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-base font-black text-[#101c2c]">
                        <Wallet size={15} className="text-emerald-600" />
                        ৳{Number(booking.totalPrice).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold capitalize ${getStatusStyle(booking.status)}`}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-[11px] font-bold capitalize ${
                        booking.paymentStatus === "paid"
                          ? "bg-emerald-50 text-emerald-700"
                          : booking.paymentStatus === "refunded"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Bottom CTA */}
        <section className="mt-8 flex flex-col items-center justify-between gap-5 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-6 sm:flex-row md:p-8">
          <div>
            <h3 className="text-lg font-black text-[#101c2c]">
              Looking for something else?
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Discover more equipment for your next project.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-[#101c2c] px-6 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            Explore More
            <ArrowRight size={17} />
          </Link>
        </section>
      </div>
    </main>
  );
}
