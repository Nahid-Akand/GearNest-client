
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Package,
  ArrowUpDown,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Camera,
  CheckCircle2,
  X,
} from "lucide-react";

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
  status: string;
  isAvailable: boolean;
}

interface EquipmentResponse {
  success: boolean;
  equipment: Equipment[];
  totalEquipment: number;
}

const categories = [
  "All",
  "Construction",
  "Photography",
  "Vehicles & Transportation",
  "Agriculture Equipment",
  "Electronics",
  "Event Equipment",
];

const categoryDescriptions: Record<string, string> = {
  All: "Explore quality equipment for every project, occasion and adventure.",
  Construction:
    "Find reliable tools and machinery for your next construction project.",
  Photography:
    "Discover cameras, lenses and professional photography equipment.",
  "Vehicles & Transportation":
    "Find dependable transportation for business, travel and everyday needs.",
  "Agriculture Equipment":
    "Explore farming machinery and equipment for agricultural work.",
  Electronics:
    "Rent modern electronics and technology for work and entertainment.",
  "Event Equipment":
    "Everything you need to create memorable events and celebrations.",
};

function EquipmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "All";

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const controller = new AbortController();

    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError("");
        setEquipment([]);

        const params: Record<string, string> = {};

        if (search.trim()) params.search = search.trim();
        if (category !== "All") params.category = category;
        if (sort !== "default") params.sort = sort;

        const response = await api.get<EquipmentResponse>(
          "/equipment",
          {
            params,
            signal: controller.signal,
          }
        );

        if (!controller.signal.aborted) {
          const results = response.data.equipment || [];

          const filteredResults =
            category === "All"
              ? results
              : results.filter(
                  (item) => item.category === category
                );

          setEquipment(filteredResults);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Fetch equipment error:", err);
          setError("Unable to load equipment. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void fetchEquipment();

    return () => controller.abort();
  }, [search, category, sort]);

  const updateSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    const query = params.toString();

    router.replace(
      query ? `/equipment?${query}` : "/equipment",
      { scroll: false }
    );
  };

  const updateCategory = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value !== "All") {
      params.set("category", value);
    } else {
      params.delete("category");
    }

    const query = params.toString();

    router.replace(
      query ? `/equipment?${query}` : "/equipment",
      { scroll: false }
    );
  };

  const resetFilters = () => {
    setSort("default");
    router.replace("/equipment", { scroll: false });
  };

  const pageTitle =
    category === "All" ? "Explore Equipment" : category;

  const pageDescription =
    categoryDescriptions[category] || categoryDescriptions.All;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Premium Hero */}
      <section className="relative isolate overflow-hidden bg-[#101c2c]">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              <Sparkles size={15} />
              GEAR NEST COLLECTION
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              {pageTitle}
              <span className="mt-2 block text-emerald-400">
                Made available for you.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              {pageDescription}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-6 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-400" />
                Quality equipment
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-400" />
                Flexible rental
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-400" />
                Easy booking
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-emerald-600">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/equipment"
            className="transition hover:text-emerald-600"
          >
            Equipment
          </Link>

          {category !== "All" && (
            <>
              <span>/</span>
              <span className="font-semibold text-slate-800">
                {category}
              </span>
            </>
          )}
        </div>

        {/* Search and Filters */}
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                Find your equipment
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                What are you looking for?
              </h2>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
            >
              <RotateCcw size={15} />
              Reset filters
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_0.8fr_0.7fr]">
            {/* Search */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10">
              <Search size={20} className="shrink-0 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search equipment..."
                aria-label="Search equipment"
                className="min-w-0 flex-1 bg-transparent py-4 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => updateSearch("")}
                  aria-label="Clear search"
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {/* Category */}
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500">
              <SlidersHorizontal
                size={19}
                className="shrink-0 text-emerald-600"
              />

              <select
                value={category}
                onChange={(event) => updateCategory(event.target.value)}
                aria-label="Filter by category"
                className="w-full min-w-0 bg-transparent py-4 text-sm font-medium text-slate-700 outline-none"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Categories" : item}
                  </option>
                ))}
              </select>
            </label>

            {/* Sort */}
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500">
              <ArrowUpDown
                size={19}
                className="shrink-0 text-emerald-600"
              />

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort equipment"
                className="w-full min-w-0 bg-transparent py-4 text-sm font-medium text-slate-700 outline-none"
              >
                <option value="default">Default sorting</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>
          </div>

          {category !== "All" && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Active filter:
              </span>

              <button
                onClick={() => updateCategory("All")}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                {category}
                <X size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              OUR COLLECTION
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {category === "All" ? "Available Equipment" : category}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {loading
                ? "Finding the best equipment for you..."
                : `${equipment.length} equipment ${
                    equipment.length === 1 ? "item" : "items"
                  } found`}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Package size={17} />
            <span>GearNest Marketplace</span>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
              >
                <div className="h-60 animate-pulse bg-slate-200" />
                <div className="space-y-4 p-6">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-11 animate-pulse rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-100 bg-white px-6 py-20 text-center shadow-sm">
            <Package size={46} className="mx-auto text-red-400" />

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Something went wrong
            </h3>

            <p className="mt-2 text-sm text-slate-500">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[#101c2c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Try Again
            </button>
          </div>
        ) : equipment.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-24 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50">
              <Package size={38} className="text-emerald-600" />
            </div>

            <h3 className="mt-6 text-2xl font-bold text-slate-900">
              No equipment found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
              We couldn&apos;t find any equipment matching your current
              filters. Try another category or search term.
            </p>

            <button
              onClick={resetFilters}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#101c2c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Clear all filters
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          /* Equipment Cards */
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item) => (
              <article
                key={item._id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-[0_20px_55px_rgba(15,23,42,0.10)]"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Camera size={48} className="text-slate-300" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/10" />

                  <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 backdrop-blur">
                    {item.category}
                  </span>

                  <span className="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>

                  <div className="absolute bottom-4 left-5 text-white">
                    {item.brand && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/75">
                        {item.brand}
                      </p>
                    )}

                    <p className="mt-1 text-lg font-bold drop-shadow">
                      {item.name}
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-600">
                      {item.condition} condition
                    </span>

                    <div className="text-right">
                      <p className="text-xl font-black text-emerald-600">
                        ৳{item.pricePerDay.toLocaleString("en-BD")}
                      </p>

                      <p className="text-xs text-slate-400">per day</p>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
                    <MapPin size={16} className="shrink-0 text-emerald-600" />
                    <span className="truncate">{item.location}</span>
                  </div>

                  <Link
                    href={`/equipment/${item._id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#101c2c] px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-emerald-600"
                  >
                    View Equipment
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function EquipmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      }
    >
      <EquipmentContent />
    </Suspense>
  );
}
