
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Loader2,
  ImagePlus,
  Package,
  MapPin,
  Tag,
  ShieldCheck,
  Plus,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

const categories = [
  "Camera",
  "Laptop",
  "Gaming",
  "Audio",
  "Lighting",
  "Drone",
  "Tools",
  "Other",
];

const conditions = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

type RentalType = "daily" | "weekly" | "monthly";

interface EquipmentForm {
  name: string;
  description: string;
  category: string;
  brand: string;
  condition: string;
  pricePerDay: string;
  pricePerWeek: string;
  pricePerMonth: string;
  rentalTypes: RentalType[];
  availableQuantity: string;
  location: string;
  rentalTerms: string;
  images: string[];
}

interface EquipmentResponse {
  _id: string;
  name?: string;
  description?: string;
  category?: string;
  brand?: string;
  condition?: string;
  pricePerDay?: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  rentalTypes?: RentalType[];
  availableQuantity?: number;
  location?: string;
  rentalTerms?: string;
  images?: string[];
}

const initialForm: EquipmentForm = {
  name: "",
  description: "",
  category: "Camera",
  brand: "",
  condition: "good",
  pricePerDay: "",
  pricePerWeek: "",
  pricePerMonth: "",
  rentalTypes: ["daily"],
  availableQuantity: "1",
  location: "",
  rentalTerms: "",
  images: [""],
};

 function EditEquipmentContent() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const equipmentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<EquipmentForm>(initialForm);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "owner") {
      router.replace("/");
      return;
    }

    const fetchEquipment = async () => {
      try {
        const response = await api.get("/equipment/my-equipment");

        const equipmentList: EquipmentResponse[] =
          response.data.equipment || [];

        const equipment = equipmentList.find(
          (item) => item._id === equipmentId
        );

        if (!equipment) {
          toast.error("Equipment not found.");
          router.replace("/owner/equipment");
          return;
        }

        setForm({
          name: equipment.name || "",
          description: equipment.description || "",
          category: equipment.category || "Camera",
          brand: equipment.brand || "",
          condition: equipment.condition || "good",
          pricePerDay: String(equipment.pricePerDay ?? ""),
          pricePerWeek: String(equipment.pricePerWeek ?? ""),
          pricePerMonth: String(equipment.pricePerMonth ?? ""),
          rentalTypes:
            equipment.rentalTypes?.length
              ? equipment.rentalTypes
              : ["daily"],
          availableQuantity: String(equipment.availableQuantity ?? 1),
          location: equipment.location || "",
          rentalTerms: equipment.rentalTerms || "",
          images:
            Array.isArray(equipment.images) && equipment.images.length
              ? equipment.images
              : [""],
        });
      } catch (error) {
        console.error("Failed to load equipment:", error);
        toast.error("Could not load equipment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [equipmentId, user, authLoading, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleRentalType = (type: RentalType) => {
    setForm((previous) => {
      const exists = previous.rentalTypes.includes(type);

      return {
        ...previous,
        rentalTypes: exists
          ? previous.rentalTypes.filter((item) => item !== type)
          : [...previous.rentalTypes, type],
      };
    });
  };

  const updateImage = (index: number, value: string) => {
    setForm((previous) => ({
      ...previous,
      images: previous.images.map((image, i) =>
        i === index ? value : image
      ),
    }));
  };

  const addImage = () => {
    if (form.images.length >= 5) {
      toast.error("You can add a maximum of 5 images.");
      return;
    }

    setForm((previous) => ({
      ...previous,
      images: [...previous.images, ""],
    }));
  };

  const removeImage = (index: number) => {
    if (form.images.length === 1) {
      toast.error("At least one image field is required.");
      return;
    }

    setForm((previous) => ({
      ...previous,
      images: previous.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const images = form.images
      .map((image) => image.trim())
      .filter(Boolean);

    if (images.length === 0) {
      toast.error("Please provide at least one image URL.");
      return;
    }

    if (images.length > 5) {
      toast.error("You can add a maximum of 5 images.");
      return;
    }

    if (form.rentalTypes.length === 0) {
      toast.error("Select at least one rental type.");
      return;
    }

    const pricePerDay = Number(form.pricePerDay);
    const pricePerWeek = Number(form.pricePerWeek);
    const pricePerMonth = Number(form.pricePerMonth);
    const availableQuantity = Number(form.availableQuantity);

    if (!Number.isFinite(pricePerDay) || pricePerDay <= 0) {
      toast.error("Enter a valid daily rental price.");
      return;
    }

    if (
      form.rentalTypes.includes("weekly") &&
      (!Number.isFinite(pricePerWeek) || pricePerWeek <= 0)
    ) {
      toast.error("Enter a valid weekly rental price.");
      return;
    }

    if (
      form.rentalTypes.includes("monthly") &&
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

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        brand: form.brand.trim(),
        condition: form.condition,
        pricePerDay,
        pricePerWeek: form.rentalTypes.includes("weekly")
          ? pricePerWeek
          : undefined,
        pricePerMonth: form.rentalTypes.includes("monthly")
          ? pricePerMonth
          : undefined,
        rentalTypes: form.rentalTypes,
        availableQuantity,
        location: form.location.trim(),
        rentalTerms: form.rentalTerms.trim(),
        images,
      };

      const response = await api.patch(
        `/equipment/my-equipment/${equipmentId}`,
        payload
      );

      if (response.data.success) {
        toast.success(
          "Equipment updated! It is now waiting for admin approval."
        );
        router.push("/owner/equipment");
      } else {
        toast.error(response.data.message || "Update failed.");
      }
    } catch (error: unknown) {
      console.error("Equipment update failed:", error);

      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error
          ? (
              error as {
                response?: {
                  data?: { message?: string };
                };
              }
            ).response?.data?.message
          : undefined;

      toast.error(message || "Could not update equipment. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/owner/equipment"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
        >
          <ArrowLeft size={18} />
          Back to My Equipment
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Package size={27} />
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Edit Equipment
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Update your equipment details, rental prices, availability, and
            images. Your changes will be reviewed by an administrator.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Package size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Basic Information
                </h2>
                <p className="text-xs text-slate-500">
                  General information about your equipment
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Equipment Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full rounded-xl bg-white"
                  placeholder="e.g. Canon EOS 90D Camera"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="select select-bordered w-full rounded-xl bg-white"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Brand
                  </label>
                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    className="input input-bordered w-full rounded-xl bg-white"
                    placeholder="e.g. Canon, Sony, Apple"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                    required
                    className="select select-bordered w-full rounded-xl bg-white"
                  >
                    {conditions.map((condition) => (
                      <option key={condition.value} value={condition.value}>
                        {condition.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Available Quantity *
                  </label>
                  <input
                    type="number"
                    name="availableQuantity"
                    value={form.availableQuantity}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    required
                    className="input input-bordered w-full rounded-xl bg-white"
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="textarea textarea-bordered w-full rounded-xl bg-white"
                  placeholder="Describe your equipment, its features, and what is included..."
                />
              </div>
            </div>
          </section>

          {/* Rental Pricing */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Tag size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Rental Pricing
                </h2>
                <p className="text-xs text-slate-500">
                  Choose your rental periods and set prices in BDT
                </p>
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-sm font-bold text-slate-700">
                Available Rental Types *
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    { value: "daily", label: "Daily", description: "Per day" },
                    { value: "weekly", label: "Weekly", description: "Per week" },
                    {
                      value: "monthly",
                      label: "Monthly",
                      description: "Per month",
                    },
                  ] as const
                ).map((type) => {
                  const selected = form.rentalTypes.includes(type.value);

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => toggleRentalType(type.value)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 bg-white hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">
                          {type.label}
                        </span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            selected
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300"
                          }`}
                        >
                          {selected && <span className="text-xs">✓</span>}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Daily Price (৳) *
                </label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={form.pricePerDay}
                  onChange={handleChange}
                  min="1"
                  required
                  className="input input-bordered w-full rounded-xl bg-white"
                  placeholder="1500"
                />
              </div>

              {form.rentalTypes.includes("weekly") && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Weekly Price (৳) *
                  </label>
                  <input
                    type="number"
                    name="pricePerWeek"
                    value={form.pricePerWeek}
                    onChange={handleChange}
                    min="1"
                    required
                    className="input input-bordered w-full rounded-xl bg-white"
                    placeholder="9000"
                  />
                </div>
              )}

              {form.rentalTypes.includes("monthly") && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Monthly Price (৳) *
                  </label>
                  <input
                    type="number"
                    name="pricePerMonth"
                    value={form.pricePerMonth}
                    onChange={handleChange}
                    min="1"
                    required
                    className="input input-bordered w-full rounded-xl bg-white"
                    placeholder="25000"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Location and Terms */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <MapPin size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Location & Rental Terms
                </h2>
                <p className="text-xs text-slate-500">
                  Help customers understand where and how to rent
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Location *
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full rounded-xl bg-white"
                  placeholder="e.g. Dhaka, Bangladesh"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Rental Terms & Conditions
                </label>
                <textarea
                  name="rentalTerms"
                  value={form.rentalTerms}
                  onChange={handleChange}
                  rows={4}
                  className="textarea textarea-bordered w-full rounded-xl bg-white"
                  placeholder="Mention deposit requirements, pickup instructions, late return policy, and other conditions..."
                />
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <ImagePlus size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Equipment Images
                </h2>
                <p className="text-xs text-slate-500">
                  Update your equipment image URLs (maximum 5)
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {form.images.map((image, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => updateImage(index, e.target.value)}
                    required={index === 0}
                    className="input input-bordered min-w-0 flex-1 rounded-xl bg-white"
                    placeholder={`Image URL ${index + 1}`}
                  />

                  {form.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="btn btn-square btn-ghost text-red-500 hover:bg-red-50"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {form.images.length < 5 && (
              <button
                type="button"
                onClick={addImage}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-emerald-400 px-4 py-3 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
              >
                <Plus size={17} />
                Add Another Image
              </button>
            )}

            <p className="mt-3 text-xs text-slate-400">
              Use publicly accessible image URLs. At least one image is
              required.
            </p>
          </section>

          {/* Approval Notice */}
          <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <ShieldCheck
              size={22}
              className="mt-0.5 shrink-0 text-amber-600"
            />
            <div>
              <h3 className="font-bold text-amber-900">
                Admin Approval Required
              </h3>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                Updating your equipment changes its status to pending. An
                administrator must approve it again before it appears publicly.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <Link
              href="/owner/equipment"
              className="btn btn-outline flex-1 rounded-xl border-slate-300"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="btn flex-1 rounded-xl border-0 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
export default function EditEquipmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <span className="loading loading-spinner loading-lg text-emerald-600" />
        </div>
      }
    >
      <EditEquipmentContent />
    </Suspense>
  );
}