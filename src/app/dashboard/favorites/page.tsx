
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  Trash2,
  Package,
  Loader2,
  ArrowRight,
  MapPin,
  Search,
  Sparkles,
  SlidersHorizontal,
  ShoppingBag,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";

interface Favorite {
  _id: string;
  equipment?: {
    _id: string;
    name: string;
    category?: string;
    pricePerDay: number;
    images?: string[];
    location?: string;
  };
}

export default function MyFavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/favorites");
      setFavorites(response.data.favorites || []);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      setError("Unable to load your favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

    fetchFavorites();
  }, [user, authLoading, router]);

  const handleRemoveFavorite = async (equipmentId: string) => {
    try {
      setRemovingId(equipmentId);

      await api.delete(`/favorites/${equipmentId}`);

      setFavorites((previous) =>
        previous.filter(
          (favorite) => favorite.equipment?._id !== equipmentId
        )
      );

      toast.success("Removed from favorites");
    } catch (err) {
      console.error("Remove favorite failed:", err);
      toast.error("Could not remove this favorite");
    } finally {
      setRemovingId(null);
    }
  };

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        favorites
          .map((favorite) => favorite.equipment?.category)
          .filter((category): category is string => Boolean(category))
      )
    );

    return ["All", ...uniqueCategories];
  }, [favorites]);

  const filteredFavorites = useMemo(() => {
    return favorites.filter((favorite) => {
      const equipment = favorite.equipment;

      if (!equipment) return false;

      const matchesSearch =
        equipment.name.toLowerCase().includes(search.toLowerCase()) ||
        (equipment.category || "").toLowerCase().includes(search.toLowerCase()) ||
        (equipment.location || "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        equipment.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [favorites, search, selectedCategory]);

  if (authLoading || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f7fa]">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your favorites...
          </p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "customer") return null;

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">

        {/* Back Navigation */}
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
                My Favorites
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-300">
                Your favorite equipment, saved in one place.
                Easily find the items you are interested in renting.
              </p>
            </div>

            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-emerald-400">
              <Heart size={38} />
            </div>
          </div>
        </motion.section>

        {/* Summary */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Saved Equipment
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#101c2c]">
                {favorites.length}
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <Heart size={24} />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Available Categories
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#101c2c]">
                {Math.max(categories.length - 1, 0)}
              </h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Tag size={24} />
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>
            <button
              className="rounded-lg bg-white px-4 py-2 font-bold transition hover:bg-red-100"
              onClick={fetchFavorites}
            >
              Retry
            </button>
          </div>
        )}

        {/* Favorites Content */}
        {!error && (
          <section className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm">

            {/* Search and Filters */}
            <div className="border-b border-slate-100 p-6 md:p-8">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-black text-[#101c2c]">
                    Your Saved Collection
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Browse and manage your favorite equipment.
                  </p>
                </div>

                <div className="relative w-full md:max-w-xs">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search saved equipment..."
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {/* Category Filters */}
              {favorites.length > 0 && (
                <div className="mt-7 flex flex-wrap items-center gap-2">
                  <div className="mr-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                    <SlidersHorizontal size={15} />
                    Categories
                  </div>

                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                        selectedCategory === category
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Equipment Grid */}
            <div className="p-5 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-600">
                  {filteredFavorites.length} saved item(s)
                </p>
              </div>

              {favorites.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500">
                    <Heart size={31} />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-[#101c2c]">
                    No favorite equipment yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Save equipment you like while exploring GearNest
                    and find your collection here.
                  </p>

                  <Link
                    href="/equipment"
                    className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    Explore Equipment
                    <ArrowRight size={17} />
                  </Link>
                </div>
              ) : filteredFavorites.length === 0 ? (
                <div className="py-16 text-center">
                  <Search
                    size={38}
                    className="mx-auto text-slate-300"
                  />
                  <h3 className="mt-4 text-lg font-bold text-[#101c2c]">
                    No matching equipment
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Try another search or category.
                  </p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("All");
                    }}
                    className="mt-5 text-sm font-bold text-emerald-700 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredFavorites.map((favorite, index) => {
                    const equipment = favorite.equipment;

                    if (!equipment) return null;

                    const image = equipment.images?.[0];
                    const isRemoving = removingId === equipment._id;

                    return (
                      <motion.article
                        key={favorite._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.35,
                          delay: index * 0.05,
                        }}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-900/5"
                      >
                        {/* Image */}
                        <div className="relative h-56 overflow-hidden bg-slate-100">
                          {image ? (
                            <Image
                              src={image}
                              alt={equipment.name}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-300">
                              <Package size={48} />
                            </div>
                          )}

                          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 shadow-sm">
                            {equipment.category || "Equipment"}
                          </span>

                          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-rose-500 shadow-md">
                            <Heart size={19} fill="currentColor" />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-5">
                          <h3 className="line-clamp-1 text-lg font-black text-[#101c2c] transition group-hover:text-emerald-700">
                            {equipment.name}
                          </h3>

                          {equipment.location && (
                            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <MapPin size={14} className="text-emerald-600" />
                              {equipment.location}
                            </p>
                          )}

                          <div className="my-5 flex items-end justify-between border-t border-slate-100 pt-4">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Rental Price
                              </p>
                              <p className="mt-1 text-2xl font-black text-[#101c2c]">
                                ৳{Number(equipment.pricePerDay).toLocaleString()}
                                <span className="ml-1 text-xs font-medium text-slate-400">
                                  / day
                                </span>
                              </p>
                            </div>

                            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                              <ShoppingBag size={14} />
                              Saved
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="grid grid-cols-2 gap-3">
                            <Link
                              href={`/equipment/${equipment._id}`}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white transition hover:bg-emerald-700"
                            >
                              View Details
                              <ArrowRight size={15} />
                            </Link>

                            <button
                              onClick={() =>
                                handleRemoveFavorite(equipment._id)
                              }
                              disabled={isRemoving}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isRemoving ? (
                                <Loader2 size={15} className="animate-spin" />
                              ) : (
                                <Trash2 size={15} />
                              )}
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
