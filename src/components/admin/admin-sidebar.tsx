
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ChartNoAxesCombined,
  Home,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview",
  },
  {
    name: "Manage Users",
    href: "/admin/users",
    icon: Users,
    description: "User accounts",
  },
  {
    name: "Manage Equipment",
    href: "/admin/equipment",
    icon: Package,
    description: "Equipment listings",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: ChartNoAxesCombined,
    description: "Platform insights",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="border-b border-slate-800 px-6 py-7">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
            <ShieldCheck size={25} />
          </div>

          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white">
              GearNest
            </h2>
            <p className="mt-0.5 text-xs font-medium text-slate-400">
              Administration Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-7">
        <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Management
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center justify-between rounded-xl px-3 py-3 transition-all duration-200 ${
                  active
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-950/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Icon
                    size={20}
                    className={
                      active
                        ? "text-white"
                        : "text-slate-400 group-hover:text-emerald-400"
                    }
                  />

                  <div>
                    <p className="text-sm font-semibold">
                      {item.name}
                    </p>
                    <p
                      className={`mt-0.5 text-[11px] ${
                        active ? "text-emerald-100" : "text-slate-500"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className={`transition ${
                    active
                      ? "text-white"
                      : "text-slate-600 group-hover:translate-x-1 group-hover:text-emerald-400"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Admin status */}
        <div className="mt-9 rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">
              System Active
            </span>
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            Your administrator access is active. Manage the marketplace from
            this panel.
          </p>
        </div>
      </div>

      {/* Profile and actions */}
      <div className="border-t border-slate-800 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-800/70 p-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-extrabold text-emerald-400">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">
              {user?.name || "GearNest Admin"}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Administrator
            </p>
          </div>
        </div>

        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="mb-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <Home size={19} />
          Back to Website
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-md lg:hidden"
        aria-label="Open admin menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          aria-label="Close menu overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Mobile close button */}
        <div className="absolute right-3 top-4 z-10 lg:hidden">
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close admin menu"
          >
            <X size={20} />
          </button>
        </div>

        {sidebarContent}
      </aside>
    </>
  );
}
