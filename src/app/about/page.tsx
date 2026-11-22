
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Target,
  Eye,
  Lightbulb,
  Wallet,
  ShieldCheck,
  CalendarDays,
  CreditCard,
  Search,
  ClipboardCheck,
  PackageCheck,
  Sparkles,
  Users,
  Handshake,
} from "lucide-react";

const values = [
  {
    icon: Wallet,
    title: "Affordable Rentals",
    description:
      "Access the equipment you need without making expensive purchases. Pay for the time you actually use it.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    description:
      "Equipment listings go through an admin approval process to help customers find more reliable options.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: CalendarDays,
    title: "Flexible Periods",
    description:
      "Choose rental start and end dates that fit your schedule, project, and requirements.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Complete your rental payments through a secure Stripe Checkout experience.",
    color: "bg-purple-50 text-purple-600",
  },
];

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Explore Equipment",
    description:
      "Browse different equipment categories and discover options that match your needs.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Choose Your Dates",
    description:
      "Select your preferred rental period and review the estimated rental cost.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Complete Payment",
    description:
      "Continue to secure checkout and complete your rental payment.",
  },
  {
    number: "04",
    icon: PackageCheck,
    title: "Manage Your Rental",
    description:
      "Keep track of your bookings and rental information through your dashboard.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-[#f5f7fa]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#101c2c]">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <Sparkles size={15} />
              Get to know GearNest
            </span>

            <h1 className="mt-7 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              Making Equipment
              <span className="block text-emerald-400">
                Rental Simple.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-sm leading-8 text-slate-300 md:text-base">
              We bring equipment owners and customers together
              through a convenient rental platform. Find the
              equipment you need, choose your rental dates, and
              make your next project easier with GearNest.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/equipment"
                className="inline-flex h-14 items-center gap-3 rounded-xl bg-emerald-500 px-7 text-sm font-black text-white transition hover:bg-emerald-400"
              >
                Explore Equipment
                <ArrowRight size={19} />
              </Link>

              <Link
                href="/register"
                className="inline-flex h-14 items-center rounded-xl border border-white/20 px-7 text-sm font-bold text-white transition hover:border-emerald-400 hover:text-emerald-400"
              >
                Join GearNest
              </Link>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-sm md:p-6">
              <div className="rounded-[1.5rem] bg-[#17283b] p-7 md:p-9">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                      The GearNest approach
                    </p>
                    <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">
                      Rent Smarter.
                      <br />
                      Work Better.
                    </h2>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white">
                    <Lightbulb size={28} />
                  </div>
                </div>

                <div className="my-8 h-px bg-white/10" />

                <div className="space-y-5">
                  {[
                    "Discover equipment in one place",
                    "Compare options and rental prices",
                    "Choose flexible rental dates",
                    "Manage bookings conveniently",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                        <span className="text-xs font-black">
                          0{index + 1}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-slate-200">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xl md:-left-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Handshake size={23} />
                </div>
                <div>
                  <p className="text-sm font-black text-[#101c2c]">
                    One Rental Platform
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Connecting people and equipment
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="grid items-center gap-12 lg:grid-cols-2"
        >
          <div>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
              Our Story
            </span>

            <h2 className="mt-5 text-3xl font-black leading-tight text-[#101c2c] md:text-5xl">
              Better Access to
              <span className="block text-emerald-600">
                the Right Equipment.
              </span>
            </h2>

            <p className="mt-7 text-sm leading-8 text-slate-500 md:text-base">
              Buying equipment for every project can be expensive
              and impractical. At the same time, many equipment
              owners have resources that are not always in use.
            </p>

            <p className="mt-5 text-sm leading-8 text-slate-500 md:text-base">
              GearNest is designed to make equipment rental
              more accessible by connecting customers with
              equipment owners through a single digital platform.
              Our goal is to make discovering, booking, and
              managing rentals easier.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] bg-[#101c2c] p-8 md:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                <Users size={28} />
              </div>

              <h3 className="mt-7 text-2xl font-black text-white md:text-3xl">
                Built Around Better Connections
              </h3>

              <p className="mt-5 text-sm leading-8 text-slate-300">
                We want customers to find suitable equipment
                and owners to make their equipment available
                to more people. GearNest creates a shared space
                where both sides can benefit from easier rental
                experiences.
              </p>

              <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-7">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <p className="text-sm font-semibold text-emerald-400">
                  Connecting needs with possibilities
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* MISSION AND VISION */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
              What Drives Us
            </span>

            <h2 className="mt-5 text-3xl font-black text-[#101c2c] md:text-5xl">
              Our Mission & Vision
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-500 md:text-base">
              Our direction is guided by a simple idea:
              equipment access should be easier for everyone.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-[2rem] border border-slate-200 bg-[#f5f7fa] p-8 md:p-10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Target size={28} />
              </div>

              <h3 className="mt-7 text-2xl font-black text-[#101c2c]">
                Our Mission
              </h3>

              <p className="mt-4 text-sm leading-8 text-slate-500">
                To simplify equipment rental by providing a
                convenient platform where customers can discover,
                compare, and book equipment while owners can
                make their equipment available to potential renters.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className="rounded-[2rem] border border-slate-200 bg-[#f5f7fa] p-8 md:p-10"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Eye size={28} />
              </div>

              <h3 className="mt-7 text-2xl font-black text-[#101c2c]">
                Our Vision
              </h3>

              <p className="mt-4 text-sm leading-8 text-slate-500">
                To build a trusted and accessible equipment
                rental ecosystem that helps people and businesses
                make better use of resources and find the tools
                they need for their work.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#f5f7fa] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
              Why GearNest
            </span>

            <h2 className="mt-5 text-3xl font-black text-[#101c2c] md:text-5xl">
              A Better Way to Rent
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-500 md:text-base">
              We focus on the things that matter most when
              renting equipment: affordability, trust,
              convenience, and payment security.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="group rounded-[1.7rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-xl"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${value.color} transition duration-300 group-hover:scale-110`}
                  >
                    <Icon size={26} />
                  </div>

                  <h3 className="mt-7 text-lg font-black text-[#101c2c]">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
              Simple Process
            </span>

            <h2 className="mt-5 text-3xl font-black text-[#101c2c] md:text-5xl">
              How GearNest Works
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-500 md:text-base">
              Finding and booking equipment is designed to be
              straightforward, from discovery to payment.
            </p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.12,
                  }}
                  className="relative"
                >
                  <div className="relative rounded-[1.7rem] border border-slate-200 bg-[#f5f7fa] p-7">
                    <div className="flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#101c2c] text-emerald-400">
                        <Icon size={25} />
                      </div>

                      <span className="text-3xl font-black text-slate-200">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-7 text-lg font-black text-[#101c2c]">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {step.description}
                    </p>
                  </div>

                  {index !== steps.length - 1 && (
                    <div className="absolute -right-5 top-12 z-10 hidden text-emerald-500 lg:block">
                      <ArrowRight size={20} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f5f7fa] px-4 py-16 md:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#101c2c] px-7 py-14 text-center md:px-16 md:py-20"
        >
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <Sparkles size={15} />
              Start with GearNest
            </span>

            <h2 className="mt-7 text-3xl font-black leading-tight text-white md:text-5xl">
              Ready to Find the
              <span className="block text-emerald-400">
                Right Equipment?
              </span>
            </h2>

            <p className="mt-5 text-sm leading-8 text-slate-300 md:text-base">
              Explore available equipment, compare rental
              options, and make your next project easier.
            </p>

            <Link
              href="/equipment"
              className="mt-9 inline-flex h-14 items-center gap-3 rounded-xl bg-emerald-500 px-8 text-sm font-black text-white transition hover:bg-emerald-400"
            >
              Browse Equipment
              <ArrowRight size={19} />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
