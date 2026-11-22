
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  MapPin,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const footerLinks = {
  explore: [
    { label: "Browse Equipment", href: "/equipment" },
    { label: "About GearNest", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],
  account: [
    { label: "Sign In", href: "/login" },
    { label: "Create Account", href: "/register" },
    { label: "My Dashboard", href: "/dashboard" },
  ],
  support: [
    { label: "Contact Support", href: "/contact" },
    { label: "My Rentals", href: "/dashboard/bookings" },
    { label: "My Favorites", href: "/dashboard/favorites" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                <ShoppingBag size={25} />
              </span>

              <span>
                <span className="block text-2xl font-extrabold tracking-tight text-white">
                  Gear<span className="text-emerald-400">Nest</span>
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[2.5px] text-slate-500">
                  Equipment Marketplace
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
              Find the right equipment for every project. Discover quality
              equipment, connect with owners, and rent with confidence.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300">
                <ShieldCheck size={16} className="text-emerald-400" />
                Secure Rentals
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300">
                <Headphones size={16} className="text-emerald-400" />
                Customer Support
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-5 text-sm font-bold text-white">
              Explore
            </h3>

            <ul className="space-y-4">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-400"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-5 text-sm font-bold text-white">
              Your Account
            </h3>

            <ul className="space-y-4">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-400"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-5 text-sm font-bold text-white">
              Help & Support
            </h3>

            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-400"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-400"
            >
              Get in touch
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Location / message strip */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin size={15} className="text-emerald-400" />
            <span>Making equipment rental easier</span>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 transition hover:text-emerald-300"
          >
            Find your equipment
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Copyright */}
        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 GearNest. All rights reserved.
          </p>

          <p>
            Built for smarter equipment rentals.
          </p>
        </div>
      </div>
    </footer>
  );
}
