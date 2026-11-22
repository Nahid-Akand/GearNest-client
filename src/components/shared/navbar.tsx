
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  UserRound,
  X,
  PlusCircle,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/auth-context";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Equipment", href: "/equipment" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading, isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Normalize role so OWNER and owner are treated equally.
  const role = String(user?.role || "customer").toLowerCase();

  const dashboardHref =
    role === "admin"
      ? "/admin/dashboard"
      : role === "owner"
        ? "/owner/dashboard"
        : "/dashboard";

  const dashboardLabel =
    role === "admin"
      ? "Admin Dashboard"
      : role === "owner"
        ? "Owner Dashboard"
        : "My Dashboard";

  // Close account dropdown when clicking outside.
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Close menus when navigating.
  useEffect(() => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    logout();
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) => {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");
  };

  const accountLinkClass =
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700";

  const mobileLinkClass =
    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700";

  return (
    <header className="sticky top-0 z-50 h-[74px] border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <ShoppingBag size={21} strokeWidth={2.2} />
            </div>

            <div>
              <h1 className="text-[23px] font-extrabold tracking-tight text-slate-900">
                Gear<span className="text-emerald-600">Nest</span>
              </h1>

              <p className="-mt-1 text-[9px] font-semibold uppercase tracking-[2px] text-slate-400">
                Equipment Marketplace
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                  isActive(link.href)
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Account Menu */}
          <div
            ref={accountMenuRef}
            className="relative hidden shrink-0 lg:block"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm text-emerald-600" />
            ) : isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((open) => !open)}
                  aria-expanded={accountMenuOpen}
                  aria-label="Open account options"
                  className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 transition hover:border-emerald-400 hover:bg-emerald-50"
                >
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {user?.photo ? (
                      <img
                        src={user.photo}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </span>

                  <span className="text-xs font-semibold capitalize text-slate-700">
                    {role}
                  </span>

                  <ChevronDown
                    size={15}
                    className={`text-slate-400 transition-transform ${
                      accountMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 top-full z-[999] mt-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10">

                    {/* User Information */}
                    <div className="mb-2 rounded-xl bg-gradient-to-r from-emerald-50 to-white p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-600 font-bold text-white">
                          {user?.photo ? (
                            <img
                              src={user.photo}
                              alt={user.name || "User"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            user?.name?.charAt(0).toUpperCase() || "U"
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {user?.name || "GearNest User"}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      <span className="mt-3 inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold capitalize text-emerald-700">
                        {role} account
                      </span>
                    </div>

                    {/* Common Dashboard */}
                    <Link
                      href={dashboardHref}
                      onClick={() => setAccountMenuOpen(false)}
                      className={accountLinkClass}
                    >
                      <LayoutDashboard size={17} />
                      {dashboardLabel}
                    </Link>

                    {/* Profile */}
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setAccountMenuOpen(false)}
                      className={accountLinkClass}
                    >
                      <UserRound size={17} />
                      My Profile
                    </Link>

                    {/* Owner Menu */}
                    {role === "owner" && (
                      <>
                        <div className="my-2 border-t border-slate-100" />

                        <Link
                          href="/owner/equipment"
                          onClick={() => setAccountMenuOpen(false)}
                          className={accountLinkClass}
                        >
                          <Package size={17} />
                          My Equipment
                        </Link>

                        <Link
                          href="/owner/equipment/create"
                          onClick={() => setAccountMenuOpen(false)}
                          className={accountLinkClass}
                        >
                          <PlusCircle size={17} />
                          Add Equipment
                        </Link>

                        <Link
                          href="/owner/bookings"
                          onClick={() => setAccountMenuOpen(false)}
                          className={accountLinkClass}
                        >
                          <ClipboardList size={17} />
                          Owner Bookings
                        </Link>
                      </>
                    )}

                    {/* Customer Menu */}
                    {role === "customer" && (
                      <>
                        <Link
                          href="/dashboard/bookings"
                          onClick={() => setAccountMenuOpen(false)}
                          className={accountLinkClass}
                        >
                          <Package size={17} />
                          My Rentals
                        </Link>

                        <Link
                          href="/dashboard/favorites"
                          onClick={() => setAccountMenuOpen(false)}
                          className={accountLinkClass}
                        >
                          <Heart size={17} />
                          My Favorites
                        </Link>
                      </>
                    )}

                    {/* Admin Menu */}
                    {role === "admin" && (
                      <>
                        <div className="my-2 border-t border-slate-100" />

                        <Link
                          href="/admin/users"
                          onClick={() => setAccountMenuOpen(false)}
                          className={accountLinkClass}
                        >
                          <Users size={17} />
                          Manage Users
                        </Link>

                        <Link
                          href="/admin/equipment"
                          onClick={() => setAccountMenuOpen(false)}
                          className={accountLinkClass}
                        >
                          <Settings size={17} />
                          Manage Equipment
                        </Link>

                        <Link
                          href="/admin/analytics"
                          onClick={() => setAccountMenuOpen(false)}
                          className={accountLinkClass}
                        >
                          <BarChart3 size={17} />
                          Analytics
                        </Link>
                      </>
                    )}

                    <div className="my-2 border-t border-slate-100" />

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  Get Started
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-[74px] z-50 border-b border-slate-200 bg-white px-4 py-4 shadow-xl lg:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                    isActive(link.href)
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="my-4 border-t border-slate-200" />

            {loading ? (
              <div className="flex justify-center py-3">
                <span className="loading loading-spinner loading-sm text-emerald-600" />
              </div>
            ) : isAuthenticated ? (
              <div className="space-y-2">

                {/* Mobile User Information */}
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-100 font-bold text-emerald-700">
                    {user?.photo ? (
                      <img
                        src={user.photo}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {user?.name || "My Account"}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user?.email}
                    </p>

                    <p className="mt-1 text-[10px] font-bold capitalize text-emerald-700">
                      {role} account
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  <LayoutDashboard size={18} />
                  {dashboardLabel}
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  <UserRound size={18} />
                  My Profile
                </Link>

                {/* Mobile Owner Menu */}
                {role === "owner" && (
                  <>
                    <Link
                      href="/owner/equipment"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      <Package size={18} />
                      My Equipment
                    </Link>

                    <Link
                      href="/owner/equipment/create"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      <PlusCircle size={18} />
                      Add Equipment
                    </Link>

                    <Link
                      href="/owner/bookings"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      <ClipboardList size={18} />
                      Owner Bookings
                    </Link>
                  </>
                )}

                {/* Mobile Customer Menu */}
                {role === "customer" && (
                  <>
                    <Link
                      href="/dashboard/bookings"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      <Package size={18} />
                      My Rentals
                    </Link>

                    <Link
                      href="/dashboard/favorites"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      <Heart size={18} />
                      My Favorites
                    </Link>
                  </>
                )}

                {/* Mobile Admin Menu */}
                {role === "admin" && (
                  <>
                    <Link
                      href="/admin/users"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      <Users size={18} />
                      Manage Users
                    </Link>

                    <Link
                      href="/admin/equipment"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      <Settings size={18} />
                      Manage Equipment
                    </Link>

                    <Link
                      href="/admin/analytics"
                      onClick={() => setMobileMenuOpen(false)}
                      className={mobileLinkClass}
                    >
                      <BarChart3 size={18} />
                      Analytics
                    </Link>
                  </>
                )}

                <div className="my-2 border-t border-slate-200" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
