
"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  X,
  Package,
  Loader2,
  ImagePlus,
  MapPin,
  IndianRupee,
  ClipboardList,
  CheckCircle2,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";

const categories = [
  "Photography",
  "Electronics",
  "Tools",
  "Sports",
  "Camping",
  "Audio",
  "Other",
];

const rentalOptions = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
] as const;

type RentalType = (typeof rentalOptions)[number]["value"];

export default function CreateEquipmentPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    condition: "good",
    pricePerDay: "",
    pricePerWeek: "",
    pricePerMonth: "",
    availableQuantity: "1",
    rentalTerms: "",
    location: "",
  });

  const [rentalTypes, setRentalTypes] = useState<RentalType[]>(["daily"]);
  const [images, setImages] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);

  // Redirect unauthorized users
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "owner")) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  // Wait until authentication is checked
  if (authLoading || !user || user.role !== "owner") {
    return null;
  }

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const toggleRentalType = (type: RentalType) => {
    setRentalTypes((previous) => {
      if (previous.includes(type)) {
        if (previous.length === 1) {
          toast.error("Select at least one rental type.");
          return previous;
        }

        return previous.filter((item) => item !== type);
      }

      return [...previous, type];
    });
  };

  const handleImageChange = (index: number, value: string) => {
    setImages((previous) =>
      previous.map((image, i) => (i === index ? value : image))
    );
  };

  const addImageField = () => {
    if (images.length >= 5) {
      toast.error("You can add up to 5 images.");
      return;
    }

    setImages((previous) => [...previous, ""]);
  };

  const removeImageField = (index: number) => {
    setImages((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validImages = images
      .map((image) => image.trim())
      .filter(Boolean);

    const pricePerDay = Number(form.pricePerDay);
    const pricePerWeek = Number(form.pricePerWeek);
    const pricePerMonth = Number(form.pricePerMonth);
    const availableQuantity = Number(form.availableQuantity);

    if (!form.category) {
      toast.error("Please select an equipment category.");
      return;
    }

    if (!Number.isFinite(pricePerDay) || pricePerDay <= 0) {
      toast.error("Enter a valid daily rental price.");
      return;
    }

    if (
      rentalTypes.includes("weekly") &&
      (!Number.isFinite(pricePerWeek) || pricePerWeek <= 0)
    ) {
      toast.error("Enter a valid weekly rental price.");
      return;
    }

    if (
      rentalTypes.includes("monthly") &&
      (!Number.isFinite(pricePerMonth) || pricePerMonth <= 0)
    ) {
      toast.error("Enter a valid monthly rental price.");
      return;
    }

    if (
      !Number.isInteger(availableQuantity) ||
      availableQuantity < 1
    ) {
      toast.error("Available quantity must be at least 1.");
      return;
    }

    if (rentalTypes.length === 0) {
      toast.error("Select at least one rental type.");
      return;
    }

    if (validImages.length === 0) {
      toast.error("Please provide at least one image URL.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        brand: form.brand.trim(),
        condition: form.condition,
        pricePerDay,
        ...(rentalTypes.includes("weekly") && { pricePerWeek }),
        ...(rentalTypes.includes("monthly") && { pricePerMonth }),
        rentalTypes,
        availableQuantity,
        rentalTerms: form.rentalTerms.trim(),
        location: form.location.trim(),
        images: validImages,
      };

      const response = await api.post("/equipment", payload);

      if (response.data.success) {
        toast.success(
          "Equipment submitted! Waiting for admin approval."
        );
        router.push("/owner/equipment");
      } else {
        toast.error(
          response.data.message || "Unable to add equipment."
        );
      }
    } catch (error: unknown) {
      console.error("Equipment creation failed:", error);

      const message =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } })
              .response?.data?.message
          : undefined;

      toast.error(
        message || "Failed to submit equipment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </main>
    );
  }

  if (!user) {
  return null;
}

  if (user.role !== "owner") {
    router.replace(
      user.role === "admin" ? "/admin/dashboard" : "/dashboard"
    );
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/owner/equipment"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          Back to My Equipment
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <Package size={14} />
            Owner Workspace
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Add New Equipment
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
            Create a rental listing and make your equipment available
            to customers on GearNest.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Equipment Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                <Package size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Equipment Information
                </h2>
                <p className="text-sm text-slate-500">
                  Basic details about your equipment
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                  Equipment Name *
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Canon EOS 90D Camera"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                  minLength={2}
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your equipment, features, specifications, and what makes it useful..."
                  className="min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  required
                  minLength={10}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="brand" className="mb-2 block text-sm font-semibold text-slate-700">
                    Brand
                  </label>
                  <input
                    id="brand"
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="e.g. Canon, Sony, Bosch"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="condition" className="mb-2 block text-sm font-semibold text-slate-700">
                  Equipment Condition *
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="new">New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
            </div>
          </section>

          {/* Rental Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                <IndianRupee size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Rental Information
                </h2>
                <p className="text-sm text-slate-500">
                  Set your rental prices and availability
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Available Rental Types *
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  {rentalOptions.map((option) => {
                    const selected = rentalTypes.includes(option.value);

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleRentalType(option.value)}
                        className={`flex items-center justify-between rounded-xl border p-4 text-sm font-semibold transition ${
                          selected
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300"
                        }`}
                      >
                        {option.label} Rental
                        {selected && <CheckCircle2 size={18} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="pricePerDay" className="mb-2 block text-sm font-semibold text-slate-700">
                    Daily Price (৳) *
                  </label>
                  <input
                    id="pricePerDay"
                    name="pricePerDay"
                    type="number"
                    min="1"
                    step="0.01"
                    value={form.pricePerDay}
                    onChange={handleChange}
                    placeholder="1500"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                </div>

                {rentalTypes.includes("weekly") && (
                  <div>
                    <label htmlFor="pricePerWeek" className="mb-2 block text-sm font-semibold text-slate-700">
                      Weekly Price (৳) *
                    </label>
                    <input
                      id="pricePerWeek"
                      name="pricePerWeek"
                      type="number"
                      min="1"
                      step="0.01"
                      value={form.pricePerWeek}
                      onChange={handleChange}
                      placeholder="9000"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      required
                    />
                  </div>
                )}

                {rentalTypes.includes("monthly") && (
                  <div>
                    <label htmlFor="pricePerMonth" className="mb-2 block text-sm font-semibold text-slate-700">
                      Monthly Price (৳) *
                    </label>
                    <input
                      id="pricePerMonth"
                      name="pricePerMonth"
                      type="number"
                      min="1"
                      step="0.01"
                      value={form.pricePerMonth}
                      onChange={handleChange}
                      placeholder="30000"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      required
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="availableQuantity" className="mb-2 block text-sm font-semibold text-slate-700">
                    Available Quantity *
                  </label>
                  <input
                    id="availableQuantity"
                    name="availableQuantity"
                    type="number"
                    min="1"
                    step="1"
                    value={form.availableQuantity}
                    onChange={handleChange}
                    placeholder="1"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="location" className="mb-2 block text-sm font-semibold text-slate-700">
                    Equipment Location *
                  </label>
                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="location"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g. Dhanmondi, Dhaka"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Rental Terms */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                <ClipboardList size={22} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Rental Terms and Conditions
                </h2>
                <p className="text-sm text-slate-500">
                  Explain any rules customers should follow
                </p>
              </div>
            </div>

            <textarea
              id="rentalTerms"
              name="rentalTerms"
              value={form.rentalTerms}
              onChange={handleChange}
              placeholder="Example: Please return the equipment in the same condition. A valid ID may be required at pickup..."
              className="min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </section>

          {/* Images */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                  <ImagePlus size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Equipment Images
                  </h2>
                  <p className="text-sm text-slate-500">
                    Add 1–5 image URLs
                  </p>
                </div>
              </div>
              <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                {images.filter((image) => image.trim()).length}/5
              </span>
            </div>

            <div className="space-y-3">
              {images.map((image, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(event) =>
                      handleImageChange(index, event.target.value)
                    }
                    placeholder="https://example.com/equipment.jpg"
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    required={index === 0}
                  />

                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50"
                      aria-label="Remove image field"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {images.length < 5 && (
              <button
                type="button"
                onClick={addImageField}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                <Plus size={17} />
                Add Another Image
              </button>
            )}
          </section>

          {/* Approval Notice */}
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <Info size={21} className="mt-0.5 shrink-0 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-amber-800">
                Admin Approval Required
              </h3>
              <p className="mt-1 text-sm leading-6 text-amber-700">
                Your equipment listing will remain pending until an
                administrator reviews and approves it. Once approved,
                customers can view your listing.
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/owner/equipment"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Submit Equipment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
