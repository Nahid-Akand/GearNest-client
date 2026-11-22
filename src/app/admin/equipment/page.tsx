
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Search,
  MapPin,
  CalendarDays,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
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
  images: string[];
  status: "pending" | "approved" | "rejected";
}

export default function AdminEquipmentPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/equipment/pending");
      setEquipment(response.data.equipment || []);
    } catch (error) {
      console.error("Failed to load equipment:", error);
      toast.error("Unable to load pending equipment.");
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

    fetchEquipment();
  }, [user, authLoading, router, fetchEquipment]);

  const handleStatusUpdate = async (
    equipmentId: string,
    status: "approved" | "rejected"
  ) => {
    const action = status === "approved" ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this listing?`)) {
      return;
    }

    try {
      setUpdatingId(equipmentId);

      await api.patch(`/equipment/${equipmentId}/status`, {
        status,
      });

      setEquipment((previous) =>
        previous.filter((item) => item._id !== equipmentId)
      );

      toast.success(`Equipment ${status} successfully.`);
    } catch (error) {
      console.error("Equipment status update failed:", error);
      toast.error(`Failed to ${action} equipment.`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredEquipment = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return equipment;

    return equipment.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.brand?.toLowerCase().includes(query)
      );
    });
  }, [equipment, search]);

  if (authLoading || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading equipment...
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
              <ShieldCheck size={18} />
              ADMINISTRATION
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Manage Equipment
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Review and manage equipment listings submitted by owners.
            </p>
          </div>

          <button
            onClick={fetchEquipment}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Statistics */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pending Approval
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
              Listings waiting for admin review
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Displayed Results
                </p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {filteredEquipment.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Package size={25} />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Matching pending listings
            </p>
          </div>
        </section>

        {/* Equipment Review Section */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Equipment Review Queue
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review each listing before it becomes available.
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                <Clock size={14} />
                {equipment.length} Pending
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search by equipment, category, brand or location..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Empty State */}
          {filteredEquipment.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                {equipment.length === 0 ? (
                  <CheckCircle2 size={32} />
                ) : (
                  <Search size={32} />
                )}
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-800">
                {equipment.length === 0
                  ? "All caught up!"
                  : "No equipment found"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {equipment.length === 0
                  ? "There are no equipment listings waiting for approval."
                  : "Try searching with another equipment name or category."}
              </p>

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
              {filteredEquipment.map((item) => (
                <article
                  key={item._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-52 bg-slate-100">
                    {item.images?.[0] ? (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <Package size={55} />
                      </div>
                    )}

                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold capitalize text-amber-800 shadow-sm">
                        <Clock size={13} />
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Equipment Information */}
                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                        <Tag size={13} />
                        {item.category}
                      </span>

                      <span className="text-lg font-extrabold text-emerald-700">
                        ৳{Number(item.pricePerDay).toLocaleString("en-BD")}
                        <span className="ml-1 text-xs font-medium text-slate-400">
                          /day
                        </span>
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>

                    {/* Details */}
                    <div className="mt-5 grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Brand
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {item.brand || "Not specified"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-400">
                          Condition
                        </p>
                        <p className="mt-1 text-sm font-semibold capitalize text-slate-700">
                          {item.condition}
                        </p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-xs font-medium text-slate-400">
                          Location
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                          <MapPin size={15} className="text-emerald-600" />
                          {item.location}
                        </p>
                      </div>
                    </div>

                    {/* Approval Actions */}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={() =>
                          handleStatusUpdate(item._id, "approved")
                        }
                        disabled={updatingId === item._id}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingId === item._id ? (
                          <Loader2 size={17} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={17} />
                        )}
                        Approve Listing
                      </button>

                      <button
                        onClick={() =>
                          handleStatusUpdate(item._id, "rejected")
                        }
                        disabled={updatingId === item._id}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingId === item._id ? (
                          <Loader2 size={17} className="animate-spin" />
                        ) : (
                          <XCircle size={17} />
                        )}
                        Reject Listing
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <p className="mt-5 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={15} />
          Only administrators can approve or reject equipment listings.
        </p>
      </div>
    </main>
  );
}
