
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Package,
  TrendingUp,
} from "lucide-react";

export default function OwnerCTA() {
  const benefits = [
    "List your equipment easily",
    "Connect with potential renters",
    "Manage your rental listings",
    "Earn from equipment you own",
  ];

  return (
    <section className="bg-base-100 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-secondary"
        >
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative grid items-center gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
            {/* Left Content */}
            <div className="text-primary-content">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider">
                <TrendingUp size={15} />
                For Equipment Owners
              </span>

              <h2 className="mt-7 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Your Equipment.
                <span className="mt-2 block text-white/75">
                  Your Opportunity.
                </span>
              </h2>

              <p className="mt-6 max-w-lg leading-8 text-white/80">
                Have equipment sitting unused? List it on GearNest,
                connect with people who need it, and turn your
                equipment into a rental opportunity.
              </p>

              {/* Benefits */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 text-sm font-medium text-white/90"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-white"
                    />
                    {benefit}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-bold text-primary shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  Become an Owner
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Sign In
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/70">
                      Owner Dashboard
                    </p>
                    <h3 className="mt-1 text-2xl font-extrabold text-white">
                      Manage Your Gear
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                    <Package size={25} />
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 p-5">
                    <Package className="text-white/80" size={23} />
                    <p className="mt-5 text-2xl font-black text-white">
                      Easy
                    </p>
                    <p className="mt-1 text-xs text-white/65">
                      Equipment Listing
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5">
                    <CircleDollarSign className="text-white/80" size={23} />
                    <p className="mt-5 text-2xl font-black text-white">
                      Flexible
                    </p>
                    <p className="mt-1 text-xs text-white/65">
                      Rental Pricing
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-base-content/50">
                        Your next opportunity
                      </p>
                      <p className="mt-1 font-bold text-base-content">
                        Start listing today
                      </p>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
                      <TrendingUp size={23} />
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-base-200">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-primary to-secondary" />
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-3 -top-5 hidden items-center gap-2 rounded-2xl bg-white px-4 py-3 text-primary shadow-xl sm:flex"
              >
                <CheckCircle2 size={20} />
                <span className="text-sm font-bold">
                  Simple to Get Started
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
