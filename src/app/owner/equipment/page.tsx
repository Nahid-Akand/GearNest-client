
"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Package,
  MapPin,
  Loader2,
  Eye,
  RefreshCw,
  Pencil,
  CheckCircle2,
  Clock,
  XCircle,
  Boxes,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";

interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand?: string;
  condition: string;
  pricePerDay: number;
  location: string;
  images?: string[];
  status: "pending" | "approved" | "rejected";
  isAvailable: boolean;
}

type FilterType = "all" | "approved" | "pending" | "rejected";

export default function OwnerEquipmentPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/equipment/my-equipment");
      setEquipment(response.data.equipment || []);
    } catch (err) {
      console.error("Equipment loading failed:", err);
      setError("Unable to load your equipment. Please try again.");
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

    fetchEquipment();
  }, [user, authLoading, router, fetchEquipment]);

  const totalCount = equipment.length;
  const approvedCount = equipment.filter(
    (item) => item.status === "approved"
  ).length;
  const pendingCount = equipment.filter(
    (item) => item.status === "pending"
  ).length;
  const rejectedCount = equipment.filter(
    (item) => item.status === "rejected"
  ).length;

  const filteredEquipment =
    filter === "all"
      ? equipment
      : equipment.filter((item) => item.status === filter);

  const filters: { label: string; value: FilterType; count: number }[] = [
    { label: "All Equipment", value: "all", count: totalCount },
    { label: "Approved", value: "approved", count: approvedCount },
    { label: "Pending", value: "pending", count: pendingCount },
    { label: "Rejected", value: "rejected", count: rejectedCount },
  ];

  const getStatusStyle = (status: Equipment["status"]) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-700 ring-red-200";
      default:
        return "bg-amber-50 text-amber-700 ring-amber-200";
    }
  };

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your equipment...
          </p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "owner") return null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back Navigation */}
        <Link
          href="/owner/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Page Heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Package size={14} />
              Owner Workspace
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              My Equipment
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage your listings, track approval status, and keep your
              rental equipment up to date.
            </p>
          </div>

          <Link
            href="/owner/equipment/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            <Plus size={19} />
            Add New Equipment
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Equipment
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {totalCount}
                </h2>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Boxes size={23} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              All your equipment listings
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Approved
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-emerald-600">
                  {approvedCount}
                </h2>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={23} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Approved listings
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-amber-500">
                  {pendingCount}
                </h2>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Clock size={23} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Waiting for admin approval
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Rejected
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-red-600">
                  {rejectedCount}
                </h2>
              </div>
              <div className="rounded-xl bg-red-50 p-3 text-red-600">
                <XCircle size={23} />
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Listings needing attention
            </p>
          </div>
        </div>

        {/* Equipment Section */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Your Listings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                View and manage all your equipment.
              </p>
            </div>

            <button
              onClick={fetchEquipment}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-100 pb-5">
            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  filter === item.value
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item.label}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs ${
                    filter === item.value
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex flex-col justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center">
              <p className="text-sm font-medium text-red-700">{error}</p>
              <button
                onClick={fetchEquipment}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredEquipment.length === 0 && !error ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Package size={32} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                {filter === "all"
                  ? "No equipment listed yet"
                  : `No ${filter} equipment`}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {filter === "all"
                  ? "Start earning by adding your first equipment listing to GearNest."
                  : `You currently don't have any ${filter} listings. Try another filter.`}
              </p>

              {filter === "all" && (
                <Link
                  href="/owner/equipment/create"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  <Plus size={18} />
                  Add Your First Equipment
                </Link>
              )}
            </div>
          ) : (
            /* Equipment Cards */
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredEquipment.map((item) => {
                const image = item.images?.[0];

                return (
                  <article
                    key={item._id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/60"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      {image ? (
                        <Image
                          src={image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <Package size={55} />
                        </div>
                      )}

                      <span
                        className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-bold capitalize shadow-sm ring-1 ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>

                      <span className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                        {item.category}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-bold text-slate-900 transition group-hover:text-emerald-700">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-xs capitalize text-slate-400">
                            {item.brand ? `${item.brand} · ` : ""}
                            {item.condition}
                          </p>
                        </div>

                        <ArrowUpRight
                          size={19}
                          className="shrink-0 text-slate-300 transition group-hover:text-emerald-600"
                        />
                      </div>

                      <p className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin size={15} className="shrink-0 text-emerald-600" />
                        <span className="truncate">{item.location}</span>
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-xs text-slate-400">
                            Rental price
                          </p>
                          <p className="mt-1 text-xl font-extrabold text-emerald-700">
                            ৳{Number(item.pricePerDay).toLocaleString("en-BD")}
                            <span className="ml-1 text-xs font-medium text-slate-400">
                              / day
                            </span>
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.isAvailable
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <Link
                          href={`/equipment/${item._id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Eye size={16} />
                          View
                        </Link>

                        <Link
                          href={`/owner/equipment/${item._id}/edit`}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                          <Pencil size={16} />
                          Edit
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Bottom Note */}
        <p className="mt-6 text-center text-xs text-slate-400">
          GearNest Owner Workspace · Manage your rental business with ease.
        </p>
      </div>
    </main>
  );
}
