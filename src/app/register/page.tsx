
"use client";

import Link from "next/link";
import {
  loginUser,
  registerUser,
  googleLogin,
} from "@/services/auth.service";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { GoogleLogin } from "@react-oauth/google";
import {
  ArrowRight,
  Camera,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShoppingBag,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const photo = (formData.get("photo") as string).trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name) {
      setError("Please enter your full name.");
      toast.error("Please enter your full name.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      toast.error("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      toast.error("Password must contain an uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      toast.error("Password must contain a lowercase letter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    if (photo) {
      try {
        new URL(photo);
      } catch {
        setError("Please enter a valid photo URL.");
        toast.error("Please enter a valid photo URL.");
        return;
      }
    }

    try {
      setLoading(true);

      const response = await registerUser({
        name,
        email,
        photo: photo || undefined,
        password,
        role: "customer",
      });

      if (response.success) {
        const loginResponse = await loginUser({ email, password });

        if (loginResponse.success && loginResponse.token) {
          localStorage.setItem("gearnest-token", loginResponse.token);

          await refreshUser();

          toast.success("Registration successful! Welcome to GearNest.");

          form.reset();
          router.push("/");
        } else {
          toast.success("Account created! Please sign in.");
          router.push("/login");
        }
      } else {
        setError(response.message || "Registration failed.");
        toast.error(response.message || "Registration failed.");
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);

      let message = "Unable to connect to the server. Please try again.";

      if (typeof err === "object" && err !== null && "response" in err) {
        const apiError = err as {
          response?: { data?: { message?: string } };
        };

        message =
          apiError.response?.data?.message ||
          "Registration failed. Please try again.";
      }

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async (credential: string) => {
    try {
      setGoogleLoading(true);
      setError("");

      const response = await googleLogin({ credential });

      if (!response.success || !response.token) {
        throw new Error(response.message || "Google registration failed.");
      }

      localStorage.setItem("gearnest-token", response.token);

      await refreshUser();

      toast.success("Google registration successful! Welcome to GearNest.");

      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      console.error("Google registration error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Google registration failed. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080f0d] px-4 py-12 text-white">
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#101b17] shadow-2xl lg:grid-cols-2"
      >
        {/* Left promotional panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-emerald-950 via-[#102b20] to-[#08130f] p-12 lg:flex">
          <div className="absolute -right-20 top-20 h-72 w-72 rounded-full border border-emerald-400/10" />
          <div className="absolute -right-10 top-32 h-52 w-52 rounded-full border border-emerald-400/10" />

          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400 text-[#08130f]">
              <ShoppingBag size={27} />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">
              Gear<span className="text-emerald-400">Nest</span>
            </span>
          </Link>

          <div className="relative z-10">
            <span className="mb-5 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Join the community
            </span>

            <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
              Make More.
              <span className="mt-2 block text-emerald-400">
                Own Less.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-gray-300">
              Create your GearNest account and discover a smarter way to
              access the equipment you need for every project.
            </p>

            <div className="mt-10 space-y-4 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Discover quality equipment
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Book equipment with ease
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Manage your rentals in one place
              </div>
            </div>
          </div>

          <p className="relative z-10 text-sm text-gray-400">
            Your next project starts with GearNest.
          </p>
        </div>

        {/* Registration form */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-12">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-xl font-extrabold lg:hidden"
          >
            <ShoppingBag className="text-emerald-400" size={26} />
            Gear<span className="text-emerald-400">Nest</span>
          </Link>

          <div className="mb-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Get started today
            </p>

            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Create Account
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Join GearNest and start exploring equipment rentals.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              {success}
              <Link
                href="/login"
                className="ml-1 font-semibold underline underline-offset-4"
              >
                Sign in now
              </Link>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-white/10 bg-[#0a1410] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-[#0a1410] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Profile Photo URL
                <span className="ml-2 text-xs text-gray-500">(Optional)</span>
              </label>

              <div className="relative">
                <Camera
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="url"
                  name="photo"
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full rounded-xl border border-white/10 bg-[#0a1410] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Paste a direct image link or an ImgBB image URL.
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/10 bg-[#0a1410] py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-emerald-400"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                At least 6 characters, including uppercase and lowercase letters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/10 bg-[#0a1410] py-3.5 pl-12 pr-12 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-emerald-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 py-4 font-bold text-[#08130f] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-semibold tracking-widest text-gray-500">
              OR SIGN UP WITH
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google signup */}
          <div className="flex min-h-12 w-full justify-center">
            {googleLoading ? (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />
                Creating account with Google...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (!credentialResponse.credential) {
                    toast.error("Google did not return a valid credential.");
                    return;
                  }

                  void handleGoogleRegister(credentialResponse.credential);
                }}
                onError={() => {
                  toast.error("Google sign-up was unsuccessful.");
                }}
                theme="filled_black"
                shape="pill"
                size="large"
                text="signup_with"
                width="280"
              />
            )}
          </div>

          <p className="mt-7 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-400 transition hover:text-emerald-300"
            >
              Sign in
            </Link>
          </p>

          <Link
            href="/"
            className="mt-5 text-center text-xs text-gray-500 transition hover:text-emerald-400"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
