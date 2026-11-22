
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  ShieldCheck,
  Camera,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";

export default function CustomerProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    photo: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

    const fetchProfile = async () => {
      try {
        const response = await api.get("/users/me");
        const profile = response.data.user;

        setForm({
          name: profile.name || "",
          phone: profile.phone || "",
          address: profile.address || "",
          photo: profile.photo || "",
        });
      } catch (error) {
        console.error("Profile loading failed:", error);
        toast.error("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, authLoading, router]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.patch("/users/me", {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        photo: form.photo.trim(),
      });

      if (response.data.success) {
        await refreshUser();
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.data.message || "Profile update failed.");
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f7fa]">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  if (!user || user.role !== "customer") return null;

  const initials = form.name.trim()
    ? form.name.trim().charAt(0).toUpperCase()
    : "U";

  return (
    <main className="min-h-screen bg-[#f5f7fa]">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">

        {/* Back Navigation */}
        <Link
          href="/dashboard"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Page Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-9 overflow-hidden rounded-[2rem] bg-[#101c2c] p-7 md:p-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <Sparkles size={14} />
                Customer Account
              </span>

              <h1 className="mt-5 text-3xl font-black text-white md:text-4xl">
                My Profile
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-300">
                Keep your personal information up to date and
                manage your GearNest account details.
              </p>
            </div>

            <div className="hidden h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-emerald-400 sm:flex">
              <UserRound size={38} />
            </div>
          </div>
        </motion.section>

        {/* Profile Content */}
        <div className="grid items-start gap-7 lg:grid-cols-[340px_1fr]">

          {/* Profile Summary */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm"
          >
            <div className="h-28 bg-[#101c2c]">
              <div className="h-full bg-gradient-to-br from-emerald-500/20 to-transparent" />
            </div>

            <div className="-mt-14 px-6 pb-7">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-emerald-100 text-3xl font-black text-emerald-700 shadow-lg">
                {form.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.photo}
                    alt={form.name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <h2 className="mt-5 break-words text-xl font-black text-[#101c2c]">
                {form.name || user.name}
              </h2>

              <p className="mt-1 break-all text-sm text-slate-500">
                {user.email}
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold capitalize text-emerald-700">
                <CheckCircle2 size={14} />
                {user.role} account
              </span>

              <div className="my-7 border-t border-slate-100" />

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-400">
                      Email Address
                    </p>
                    <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      Phone Number
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {form.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      Address
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {form.address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ShieldCheck size={19} />
                  <p className="text-sm font-bold">
                    Account Information
                  </p>
                </div>

                <p className="mt-2 text-xs leading-6 text-slate-500">
                  Your account information helps you manage
                  your equipment rentals more conveniently.
                </p>
              </div>
            </div>
          </motion.aside>

          {/* Edit Profile Form */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8"
          >
            <div className="mb-8 flex items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-xl font-black text-[#101c2c]">
                  Personal Information
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Edit your profile details below.
                </p>
              </div>

              <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:flex">
                <UserRound size={23} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>

                <div className="flex h-14 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                  <UserRound size={19} className="shrink-0 text-slate-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="h-full w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Email Address
                </label>

                <div className="flex h-14 items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 px-4">
                  <Mail size={19} className="shrink-0 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={user.email}
                    readOnly
                    className="h-full w-full cursor-not-allowed bg-transparent text-sm font-medium text-slate-500 outline-none"
                  />
                  <ShieldCheck size={17} className="shrink-0 text-emerald-600" />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Your email address cannot be changed here.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Phone Number
                </label>

                <div className="flex h-14 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                  <Phone size={19} className="shrink-0 text-slate-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="h-full w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Address
                </label>

                <div className="flex h-14 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                  <MapPin size={19} className="shrink-0 text-slate-400" />
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    className="h-full w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label
                  htmlFor="photo"
                  className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700"
                >
                  <Camera size={17} className="text-emerald-600" />
                  Profile Photo URL
                </label>

                <input
                  id="photo"
                  name="photo"
                  type="url"
                  value={form.photo}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                  className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Add a publicly accessible image URL to update your profile picture.
                </p>
              </div>

              {/* Photo Preview */}
              {form.photo.trim() && (
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.photo}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      Profile Photo Preview
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      This is how your profile picture will appear.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="border-t border-slate-100 pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 px-7 text-sm font-black text-white shadow-lg shadow-emerald-600/15 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save size={19} />
                      Save Changes
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
