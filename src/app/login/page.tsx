
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/contexts/auth-context";
import {
  loginUser,
  googleLogin,
} from "@/services/auth.service";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  Lock,
  Mail,
  ShoppingBag,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;

    try {
      setLoading(true);

      const response = await loginUser({ email, password });

      if (!response.success || !response.token) {
        const message = response.message || "Login failed.";
        setError(message);
        toast.error(message);
        return;
      }

      localStorage.setItem("gearnest-token", response.token);

      await refreshUser();

      toast.success("Welcome back! Login successful.");

      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      console.error("Login error:", err);

      let message = "Unable to connect to the server. Please try again.";

      if (typeof err === "object" && err !== null && "response" in err) {
        const apiError = err as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        message =
          apiError.response?.data?.message ||
          "Invalid email or password.";
      }

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    try {
      setGoogleLoading(true);
      setError("");

      const response = await googleLogin({ credential });

      if (!response.success || !response.token) {
        throw new Error(response.message || "Google login failed.");
      }

      localStorage.setItem("gearnest-token", response.token);

      await refreshUser();

      toast.success("Google login successful!");

      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      console.error("Google login error:", err);

      let message = "Google login failed. Please try again.";

      if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-74px)] items-center justify-center overflow-hidden bg-[#080f0d] px-4 py-12 text-white sm:px-6">
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-[130px]" />

      <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#101a16] shadow-2xl lg:grid-cols-2">
        {/* Left panel */}
        <div className="relative hidden min-h-[680px] overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=85&w=1200&auto=format&fit=crop"
            alt="Professional equipment"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#080f0d] via-[#080f0d]/60 to-[#080f0d]/20" />

          <div className="absolute inset-0 flex flex-col justify-between p-12">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400 text-[#07110d]">
                <ShoppingBag size={25} />
              </div>

              <span className="text-2xl font-black tracking-tight">
                Gear<span className="text-emerald-400">Nest</span>
              </span>
            </Link>

            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-300 backdrop-blur-md">
                <Sparkles size={15} />
                Welcome back
              </div>

              <h1 className="text-5xl font-black leading-tight">
                Your next
                <span className="block text-emerald-400">big idea</span>
                starts here.
              </h1>

              <p className="mt-6 max-w-md text-base leading-8 text-white/65">
                Access quality equipment, manage your rentals, and
                get everything you need to bring your projects to life.
              </p>

              <div className="mt-10 flex items-center gap-3 border-t border-white/15 pt-7">
                <ShieldCheck className="text-emerald-400" size={24} />
                <p className="text-sm font-medium text-white/75">
                  A smarter way to rent equipment.
                </p>
              </div>
            </div>

            <p className="text-xs tracking-wide text-white/45">
              © 2026 GearNest. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-14">
          <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-[#07110d]">
              <ShoppingBag size={23} />
            </div>

            <span className="text-2xl font-black">
              Gear<span className="text-emerald-400">Nest</span>
            </span>
          </Link>

          <div className="mb-9">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
              Your account
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Welcome back.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Sign in to continue your GearNest experience.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-200"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-emerald-400/70 focus:bg-white/[0.07] focus:ring-4 focus:ring-emerald-400/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-200"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-12 pr-12 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-emerald-400/70 focus:bg-white/[0.07] focus:ring-4 focus:ring-emerald-400/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-emerald-400"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-emerald-400 text-sm font-extrabold text-[#07110d] shadow-lg shadow-emerald-400/10 transition-all hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#07110d]/30 border-t-[#07110d]" />
                  Signing you in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-semibold tracking-widest text-slate-500">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google login */}
          <div className="flex min-h-12 w-full justify-center">
            {googleLoading ? (
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />
                Signing in with Google...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (!credentialResponse.credential) {
                    toast.error("Google did not return a valid credential.");
                    return;
                  }

                  void handleGoogleLogin(credentialResponse.credential);
                }}
                onError={() => {
                  toast.error("Google sign-in was unsuccessful.");
                }}
                theme="filled_black"
                shape="pill"
                size="large"
                text="continue_with"
                width="280"
              />
            )}
          </div>

          <p className="mt-9 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-emerald-400 transition-colors hover:text-emerald-300"
            >
              Create account
            </Link>
          </p>

          <Link
            href="/"
            className="mt-6 text-center text-xs font-medium text-slate-500 transition-colors hover:text-emerald-400"
          >
            ← Back to GearNest
          </Link>
        </div>
      </div>
    </main>
  );
}
