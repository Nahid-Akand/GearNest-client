
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  CalendarDays,
  Home,
  LogOut,
  Menu,
  X,
  Store,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const navigation = [
  {
    name: "Dashboard",
    href: "/owner/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Equipment",
    href: "/owner/equipment",
    icon: Package,
  },
  {
    name: "Add Equipment",
    href: "/owner/equipment/create",
    icon: PlusCircle,
  },
  {
    name: "Rental Bookings",
    href: "/owner/bookings",
    icon: CalendarDays,
  },
];

export default function OwnerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-base-100">
      <div className="flex items-center justify-between border-b border-base-300 px-6 py-6">
        <Link href="/owner/dashboard" className="flex items-center gap-3">
          <div className="rounded-xl bg-primary p-2 text-primary-content">
            <Store size={23} />
          </div>
          <div>
            <h2 className="text-xl font-black">GearNest</h2>
            <p className="text-xs text-base-content/50">Owner Panel</p>
          </div>
        </Link>

        <button
          onClick={() => setMobileOpen(false)}
          className="btn btn-ghost btn-sm lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={21} />
        </button>
      </div>

      <div className="px-4 py-6">
        <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-base-content/40">
          Owner Menu
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/owner/dashboard" &&
                pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-primary text-primary-content shadow-md"
                    : "text-base-content/70 hover:bg-base-200"
                }`}
              >
                <Icon size={19} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-base-300 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-base-200 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-content">
            {user?.name?.charAt(0).toUpperCase() || "O"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">
              {user?.name || "Equipment Owner"}
            </p>
            <p className="text-xs capitalize text-base-content/50">
              {user?.role || "Owner"}
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-base-content/70 hover:bg-base-200"
        >
          <Home size={19} />
          Back to Website
        </Link>

        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-error hover:bg-error/10"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="btn btn-primary btn-square fixed left-4 top-4 z-40 shadow-lg lg:hidden"
        aria-label="Open owner menu"
      >
        <Menu size={22} />
      </button>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-base-300 lg:block">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu overlay"
          />
          <aside className="absolute inset-y-0 left-0 w-72 shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
