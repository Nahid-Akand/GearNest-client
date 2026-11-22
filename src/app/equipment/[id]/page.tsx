
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import {
  ArrowLeft,
  MapPin,
  Package,
  ShieldCheck,
  CalendarDays,
  CheckCircle2,
  X,
  Clock,
  Loader2,
  CreditCard,
  Tag,
  Truck,
  Sparkles,
  Heart,
  UserRound,
  FileText,
  Boxes,
  Star,
} from "lucide-react";

interface EquipmentOwner {
  _id: string;
  name: string;
  photo?: string;
}

interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand?: string;
  condition: string;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  rentalTypes?: ("daily" | "weekly" | "monthly")[];
  availableQuantity?: number;
  rentalTerms?: string;
  location: string;
  images: string[];
  status: string;
  isAvailable: boolean;
  owner?: EquipmentOwner;
}

interface EquipmentResponse {
  success: boolean;
  message: string;
  equipment: Equipment;
}

interface BookingResponse {
  success: boolean;
  message: string;
  booking?: {
    _id: string;
  };
  bookingId?: string;
  id?: string;
}

interface CheckoutResponse {
  success: boolean;
  message?: string;
  url?: string;
  checkoutUrl?: string;
  sessionUrl?: string;
  session?: {
    url?: string;
  };
}

interface FavoriteItem {
  _id?: string;
  equipmentId?: string | { _id?: string };
  equipment?: { _id?: string };
}

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatPrice = (price: number) =>
  Number(price || 0).toLocaleString("en-BD");

function EquipmentDetailsContent()  {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingId, setBookingId] = useState("");

  const isCustomer = user?.role === "customer";

  // Check whether the equipment is already in the customer's favorites.
  const fetchFavoriteStatus = async () => {
    if (user?.role !== "customer") return;

    try {
      const response = await api.get("/favorites");

      const favoriteItems: FavoriteItem[] =
        response.data.favorites ??
        response.data.data ??
        [];

      const found = favoriteItems.some((item) => {
        const equipmentReference =
          item.equipment ?? item.equipmentId;

        const favoriteEquipmentId =
          typeof equipmentReference === "string"
            ? equipmentReference
            : equipmentReference?._id;

        return String(favoriteEquipmentId) === String(id);
      });

      setIsFavorite(found);
    } catch (err) {
      console.error("Favorite status error:", err);
    }
  };

  // Fetch equipment details after authentication is checked.
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!id) return;

    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<EquipmentResponse>(
          `/equipment/${id}`
        );

        setEquipment(response.data.equipment);
      } catch (err) {
        console.error("Equipment details error:", err);

        setError("Unable to load equipment details.");
      } finally {
        setLoading(false);
      }
    };

    void fetchEquipment();
  }, [id, authLoading, isAuthenticated, router]);

  // Load favorite status for customers.
  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role === "customer" && id) {
      void fetchFavoriteStatus();
    }
  }, [authLoading, isAuthenticated, user?.role, id]);

  // Add or remove equipment from favorites.
  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isCustomer || !equipment) return;

    try {
      setFavoriteLoading(true);
      setFavoriteMessage("");

      if (isFavorite) {
        await api.delete(`/favorites/${equipment._id}`);

        setIsFavorite(false);
        setFavoriteMessage("Removed from your favorites.");
      } else {
        await api.post("/favorites", {
          equipmentId: equipment._id,
        });

        setIsFavorite(true);
        setFavoriteMessage("Added to your favorites.");
      }
    } catch (err: unknown) {
      console.error("Favorite update error:", err);

      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      setFavoriteMessage(
        error.response?.data?.message ||
          error.message ||
          "Unable to update favorites. Please try again."
      );
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Calculate rental duration in days.
  const rentalDays =
    startDate && endDate
      ? Math.max(
          0,
          Math.ceil(
            (new Date(`${endDate}T00:00:00`).getTime() -
              new Date(`${startDate}T00:00:00`).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  // Current booking API uses daily pricing.
  const totalPrice = equipment
    ? rentalDays * equipment.pricePerDay
    : 0;

  // Open booking modal.
  const handleOpenBooking = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isCustomer) return;

    if (!equipment?.isAvailable) return;

    setBookingError("");
    setBookingSuccess("");
    setBookingId("");
    setStartDate("");
    setEndDate("");
    setShowBookingModal(true);
  };

  // Start Stripe Checkout for an existing booking.
  const handleCheckout = async (currentBookingId: string) => {
    try {
      setBookingLoading(true);
      setBookingError("");

      const response = await api.post<CheckoutResponse>(
        "/payments/checkout",
        {
          bookingId: currentBookingId,
        }
      );

      const checkoutUrl =
        response.data.url ||
        response.data.checkoutUrl ||
        response.data.sessionUrl ||
        response.data.session?.url;

      if (!checkoutUrl) {
        throw new Error(
          response.data.message ||
            "Stripe did not return a checkout URL."
        );
      }

      window.location.assign(checkoutUrl);
    } catch (err: unknown) {
      console.error("Stripe checkout error:", err);

      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      setBookingError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Create booking and start Stripe Checkout.
  const handleCreateBooking = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!equipment || !startDate || !endDate) {
      setBookingError("Please select both rental dates.");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setBookingError("End date must be after the start date.");
      return;
    }

    if (!isCustomer) {
      setBookingError("Only customers can book equipment.");
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");

      // Step 1: Create booking.
      const response = await api.post<BookingResponse>(
        "/bookings",
        {
          equipmentId: equipment._id,
          startDate: new Date(
            `${startDate}T00:00:00`
          ).toISOString(),
          endDate: new Date(
            `${endDate}T00:00:00`
          ).toISOString(),
        }
      );

      const newBookingId =
        response.data.booking?._id ||
        response.data.bookingId ||
        response.data.id;

      if (!newBookingId) {
        throw new Error(
          "Booking was created, but the server did not return its ID."
        );
      }

      setBookingId(newBookingId);
      setBookingSuccess(
        "Your booking has been created. Continue to payment."
      );

      // Step 2: Create Stripe Checkout session.
      const checkoutResponse =
        await api.post<CheckoutResponse>(
          "/payments/checkout",
          {
            bookingId: newBookingId,
          }
        );

      const checkoutUrl =
        checkoutResponse.data.url ||
        checkoutResponse.data.checkoutUrl ||
        checkoutResponse.data.sessionUrl ||
        checkoutResponse.data.session?.url;

      if (!checkoutUrl) {
        throw new Error(
          checkoutResponse.data.message ||
            "Booking created, but Stripe did not return a checkout URL."
        );
      }

      // Step 3: Redirect to Stripe.
      window.location.assign(checkoutUrl);
    } catch (err: unknown) {
      console.error("Booking or payment error:", err);

      const error = err as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      setBookingError(
        error.response?.data?.message ||
          error.message ||
          "Unable to complete your request. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // Authentication loading state.
  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-[#f5f7fa] px-4 py-12">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-5 w-44 rounded bg-slate-200" />

          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="min-h-[420px] rounded-[2rem] bg-slate-200" />

            <div className="space-y-5 py-5">
              <div className="h-5 w-32 rounded bg-slate-200" />
              <div className="h-12 w-4/5 rounded bg-slate-200" />
              <div className="h-24 rounded bg-slate-200" />
              <div className="h-28 rounded-2xl bg-slate-200" />
              <div className="h-14 rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // The user is being redirected to login.
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fa]">
        <Loader2 className="animate-spin text-emerald-600" size={35} />
      </main>
    );
  }

  // Error state.
  if (error || !equipment) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Package
            size={52}
            className="mx-auto text-slate-300"
          />

          <h1 className="mt-5 text-2xl font-black text-[#101c2c]">
            Equipment Not Found
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            {error || "This equipment may no longer be available."}
          </p>

          <Link
            href="/equipment"
            className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#101c2c] px-6 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            <ArrowLeft size={18} />
            Browse Equipment
          </Link>
        </div>
      </main>
    );
  }

  const availableRentalTypes =
    equipment.rentalTypes?.length
      ? equipment.rentalTypes
      : ["daily"];

  const availableQuantity = equipment.availableQuantity ?? 1;

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      {/* Top section */}
      <section className="relative overflow-hidden bg-[#101c2c]">
        <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-emerald-400"
          >
            <ArrowLeft size={18} />
            Back to Equipment
          </Link>

          <div className="mt-10 max-w-3xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-400">
                {equipment.category}
              </span>

              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
                  equipment.isAvailable
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-red-400/10 text-red-400"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    equipment.isAvailable
                      ? "bg-emerald-400"
                      : "bg-red-400"
                  }`}
                />

                {equipment.isAvailable
                  ? "Available for rent"
                  : "Currently unavailable"}
              </span>
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tight text-white md:text-5xl">
              {equipment.name}
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Explore equipment details, check rental pricing, and
              reserve the equipment for your next project.
            </p>
          </div>
        </div>
      </section>

      {/* Equipment details */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Image section */}
          <div>
            <div className="group relative min-h-[320px] overflow-hidden rounded-[2rem] bg-slate-200 shadow-sm md:min-h-[520px]">
              {equipment.images?.[0] ? (
                <Image
                  src={equipment.images[0]}
                  alt={equipment.name}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex min-h-[320px] items-center justify-center md:min-h-[520px]">
                  <Package
                    size={80}
                    className="text-slate-400"
                  />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#101c2c]/50 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/20 bg-[#101c2c]/80 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                <ShieldCheck
                  size={15}
                  className="text-emerald-400"
                />
                Verified Equipment
              </div>
            </div>

            {/* Category and condition */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Tag size={17} />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Category
                  </span>
                </div>

                <p className="mt-3 font-bold text-[#101c2c]">
                  {equipment.category}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Package size={17} />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Condition
                  </span>
                </div>

                <p className="mt-3 font-bold capitalize text-[#101c2c]">
                  {equipment.condition.replace("-", " ")}
                </p>
              </div>
            </div>

            {/* Owner information */}
            <div className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <UserRound size={18} />
                EQUIPMENT OWNER
              </div>

              {equipment.owner ? (
                <div className="mt-6 flex items-center gap-4">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-emerald-600">
                    {equipment.owner.photo ? (
                      <Image
                        src={equipment.owner.photo}
                        alt={equipment.owner.name}
                        fill
                        unoptimized
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <UserRound size={30} />
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-[#101c2c]">
                      {equipment.owner.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Equipment owner
                    </p>

                    <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <ShieldCheck size={14} />
                      Owner information
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-5 text-sm text-slate-500">
                  Owner information is currently unavailable.
                </p>
              )}
            </div>
          </div>

          {/* Information and pricing */}
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <Sparkles size={17} />
                EQUIPMENT OVERVIEW
              </div>

              <h2 className="mt-4 text-2xl font-black leading-tight text-[#101c2c] md:text-3xl">
                {equipment.name}
              </h2>

              {equipment.brand && (
                <p className="mt-3 text-sm font-medium text-slate-500">
                  Brand:{" "}
                  <span className="font-bold text-[#101c2c]">
                    {equipment.brand}
                  </span>
                </p>
              )}

              <div className="my-6 border-t border-slate-100" />

              <h3 className="text-sm font-bold text-[#101c2c]">
                Description
              </h3>

              <p className="mt-3 whitespace-pre-line text-sm leading-8 text-slate-500">
                {equipment.description}
              </p>

              <div className="my-6 border-t border-slate-100" />

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#101c2c]">
                      {equipment.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Boxes size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      Available Quantity
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#101c2c]">
                      {availableQuantity} unit(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      Listing Status
                    </p>

                    <p className="mt-1 text-sm font-bold capitalize text-[#101c2c]">
                      {equipment.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental pricing */}
            <div className="overflow-hidden rounded-[2rem] bg-[#101c2c] shadow-xl shadow-slate-900/10">
              <div className="p-6 md:p-8">
                <p className="text-sm font-semibold text-slate-400">
                  Rental pricing
                </p>

                <div className="mt-5 space-y-4">
                  {availableRentalTypes.includes("daily") && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">
                        Daily
                      </span>

                      <span className="text-xl font-black text-white">
                        ৳{formatPrice(equipment.pricePerDay)}
                        <span className="ml-1 text-xs font-medium text-slate-400">
                          / day
                        </span>
                      </span>
                    </div>
                  )}

                  {availableRentalTypes.includes("weekly") && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">
                        Weekly
                      </span>

                      <span className="text-xl font-black text-white">
                        ৳{formatPrice(equipment.pricePerWeek ?? 0)}
                        <span className="ml-1 text-xs font-medium text-slate-400">
                          / week
                        </span>
                      </span>
                    </div>
                  )}

                  {availableRentalTypes.includes("monthly") && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">
                        Monthly
                      </span>

                      <span className="text-xl font-black text-white">
                        ৳{formatPrice(equipment.pricePerMonth ?? 0)}
                        <span className="ml-1 text-xs font-medium text-slate-400">
                          / month
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="my-6 border-t border-white/10" />

                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2
                    size={18}
                    className="text-emerald-400"
                  />
                  Multiple rental options
                </div>

                <div className="mt-4 flex items-center gap-3 text-sm text-slate-300">
                  <ShieldCheck
                    size={18}
                    className="text-emerald-400"
                  />
                  Secure Stripe Checkout
                </div>

                {isCustomer ? (
                  <button
                    type="button"
                    disabled={
                      !equipment.isAvailable ||
                      availableQuantity <= 0
                    }
                    onClick={handleOpenBooking}
                    className="mt-8 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-emerald-500 px-5 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:shadow-none"
                  >
                    <CalendarDays size={20} />

                    {equipment.isAvailable && availableQuantity > 0
                      ? "Book This Equipment"
                      : "Currently Unavailable"}
                  </button>
                ) : (
                  <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm leading-6 text-slate-300">
                    Booking is available for customer accounts.
                  </div>
                )}

                <p className="mt-4 text-center text-xs leading-6 text-slate-400">
                  Select your rental dates to calculate the estimated
                  cost before payment. The current booking form uses
                  daily pricing.
                </p>

                {/* Favorite button */}
                {isCustomer && (
                  <button
                    type="button"
                    onClick={handleToggleFavorite}
                    disabled={favoriteLoading}
                    className={`mt-4 flex h-13 w-full items-center justify-center gap-2 rounded-xl border px-5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      isFavorite
                        ? "border-pink-400/40 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20"
                        : "border-white/20 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {favoriteLoading ? (
                      <Loader2 size={19} className="animate-spin" />
                    ) : (
                      <Heart
                        size={19}
                        className={isFavorite ? "fill-current" : ""}
                      />
                    )}

                    {favoriteLoading
                      ? "Updating..."
                      : isFavorite
                        ? "Remove from Favorites"
                        : "Add to Favorites"}
                  </button>
                )}

                {favoriteMessage && (
                  <p className="mt-3 text-center text-xs text-emerald-300">
                    {favoriteMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rental terms */}
        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FileText size={21} />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#101c2c]">
                Rental Terms & Conditions
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Important information from the equipment owner
              </p>
            </div>
          </div>

          <p className="mt-5 whitespace-pre-line text-sm leading-8 text-slate-500">
            {equipment.rentalTerms?.trim() ||
              "No additional rental terms and conditions have been provided by the owner."}
          </p>
        </div>

        {/* Bottom benefits */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h3 className="font-bold text-[#101c2c]">
                Verified Listing
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Reviewed and approved equipment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CreditCard size={23} />
            </div>

            <div>
              <h3 className="font-bold text-[#101c2c]">
                Secure Payment
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Protected checkout through Stripe
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:col-span-2 lg:col-span-1">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Truck size={23} />
            </div>

            <div>
              <h3 className="font-bold text-[#101c2c]">
                Easy Rental
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Choose dates that suit your project
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#101c2c]/75 px-4 py-8 backdrop-blur-sm">
          <div className="relative my-auto w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            {/* Modal header */}
            <div className="relative overflow-hidden bg-[#101c2c] px-6 py-7 text-white md:px-8">
              <div className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />

              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                disabled={bookingLoading}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-50"
              >
                <X size={19} />
              </button>

              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                <CalendarDays size={25} />
              </div>

              <h2 className="relative mt-5 text-2xl font-black">
                Book Equipment
              </h2>

              <p className="relative mt-2 pr-8 text-sm leading-6 text-slate-300">
                Select your rental period for {equipment.name}.
              </p>
            </div>

            <div className="p-6 md:p-8">
              {bookingSuccess ? (
                <div className="py-5 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={38} />
                  </div>

                  <h2 className="mt-5 text-2xl font-black text-[#101c2c]">
                    Booking Created!
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {bookingSuccess}
                  </p>

                  <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-left text-xs leading-6 text-amber-800">
                    Your booking is still pending until payment
                    is successfully confirmed.
                  </div>

                  {bookingError && (
                    <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-left text-sm text-red-600">
                      {bookingError}
                    </div>
                  )}

                  {bookingId && (
                    <button
                      type="button"
                      disabled={bookingLoading}
                      onClick={() => handleCheckout(bookingId)}
                      className="mt-7 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 font-bold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                    >
                      {bookingLoading ? (
                        <>
                          <Loader2
                            size={19}
                            className="animate-spin"
                          />
                          Connecting to Stripe...
                        </>
                      ) : (
                        <>
                          <CreditCard size={19} />
                          Retry Payment
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(false);
                      router.push("/dashboard");
                    }}
                    className="mt-3 h-12 w-full rounded-xl border border-slate-200 font-bold text-[#101c2c] transition hover:bg-slate-50"
                  >
                    Go to Dashboard
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateBooking}>
                  {/* Start date */}
                  <div className="mb-5">
                    <label
                      htmlFor="startDate"
                      className="mb-2 block text-sm font-bold text-[#101c2c]"
                    >
                      Rental Start Date
                    </label>

                    <input
                      id="startDate"
                      type="date"
                      required
                      min={getToday()}
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setBookingError("");

                        if (
                          endDate &&
                          e.target.value >= endDate
                        ) {
                          setEndDate("");
                        }
                      }}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#101c2c] outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    />
                  </div>

                  {/* End date */}
                  <div className="mb-6">
                    <label
                      htmlFor="endDate"
                      className="mb-2 block text-sm font-bold text-[#101c2c]"
                    >
                      Rental End Date
                    </label>

                    <input
                      id="endDate"
                      type="date"
                      required
                      min={
                        startDate
                          ? (() => {
                              const date = new Date(
                                `${startDate}T00:00:00`
                              );

                              date.setDate(date.getDate() + 1);

                              return `${date.getFullYear()}-${String(
                                date.getMonth() + 1
                              ).padStart(2, "0")}-${String(
                                date.getDate()
                              ).padStart(2, "0")}`;
                            })()
                          : getToday()
                      }
                      value={endDate}
                      disabled={!startDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setBookingError("");
                      }}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#101c2c] outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />
                  </div>

                  {/* Rental summary */}
                  <div className="rounded-2xl border border-slate-200 bg-[#f5f7fa] p-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-500">
                        <Clock size={16} />
                        Rental Duration
                      </span>

                      <span className="font-bold text-[#101c2c]">
                        {rentalDays > 0
                          ? `${rentalDays} day(s)`
                          : "Not selected"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        Price per day
                      </span>

                      <span className="font-bold text-[#101c2c]">
                        ৳{formatPrice(equipment.pricePerDay)}
                      </span>
                    </div>

                    <div className="my-4 border-t border-slate-200" />

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#101c2c]">
                        Estimated Total
                      </span>

                      <span className="text-2xl font-black text-emerald-600">
                        ৳{formatPrice(totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Error message */}
                  {bookingError && (
                    <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                      {bookingError}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={
                      bookingLoading ||
                      rentalDays <= 0 ||
                      !startDate ||
                      !endDate
                    }
                    className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2
                          size={20}
                          className="animate-spin"
                        />
                        Creating Booking...
                      </>
                    ) : (
                      <>
                        <CreditCard size={19} />
                        Confirm & Pay
                      </>
                    )}
                  </button>

                  <p className="mt-4 text-center text-xs leading-6 text-slate-400">
                    You will be redirected to Stripe Checkout to
                    complete your payment securely.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
export default function EquipmentDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <span className="loading loading-spinner loading-lg text-emerald-600" />
        </div>
      }
    >
      <EquipmentDetailsContent />
    </Suspense>
  );
}
