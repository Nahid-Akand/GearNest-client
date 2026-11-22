
"use client";

import { motion } from "framer-motion";
import {
  Wallet,
  ShieldCheck,
  CalendarDays,
  CreditCard,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const benefits = [
  {
    number: "01",
    title: "Affordable Rental Prices",
    description:
      "Get access to quality equipment without the high cost of ownership. Pay only for the time you need it.",
    icon: Wallet,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    number: "02",
    title: "Verified Equipment Owners",
    description:
      "Equipment listings go through an admin approval process, helping customers discover more reliable rental options.",
    icon: ShieldCheck,
    color: "bg-blue-50 text-blue-600",
  },
  {
    number: "03",
    title: "Flexible Rental Periods",
    description:
      "Choose your own rental start and end dates. Find a schedule that works for your project and your budget.",
    icon: CalendarDays,
    color: "bg-orange-50 text-orange-600",
  },
  {
    number: "04",
    title: "Secure Online Payments",
    description:
      "Complete your rental payment through Stripe Checkout with a secure and straightforward payment experience.",
    icon: CreditCard,
    color: "bg-purple-50 text-purple-600",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

export default function WhyChooseUs() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#f5f7fa] py-20 md:py-28"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-emerald-200/30 blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-200/30 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-700">
            <Sparkles size={15} />
            About GearNest
          </span>

          <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight text-[#101c2c] md:text-5xl">
            Everything You Need,
            <span className="block text-emerald-600">
              Without Owning It.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate-500 md:text-base">
            GearNest makes equipment rental simple, affordable,
            and accessible. Whether you are working on a project
            or growing your business, find the right equipment
            without the burden of purchasing it.
          </p>
        </motion.div>

        {/* Main content */}
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Left information panel */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="relative overflow-hidden rounded-[2rem] bg-[#101c2c] p-8 text-white shadow-2xl shadow-slate-900/10 md:p-10"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                <Sparkles size={27} />
              </div>

              <h3 className="mt-8 text-3xl font-black leading-tight md:text-4xl">
                Renting Made
                <span className="block text-emerald-400">
                  Smarter.
                </span>
              </h3>

              <p className="mt-5 text-sm leading-8 text-slate-300">
                We believe getting the right equipment should
                not be complicated or expensive. GearNest brings
                customers and equipment owners together through
                one convenient rental platform.
              </p>

              <div className="my-8 h-px bg-white/10" />

              <div className="space-y-5">
                {[
                  "Discover equipment across multiple categories",
                  "Compare rental prices and equipment details",
                  "Book equipment with your preferred dates",
                  "Manage your rentals from one place",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />
                    <p className="text-sm font-medium text-slate-200">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <a
                href="/equipment"
                className="mt-9 inline-flex h-13 items-center gap-3 rounded-xl bg-emerald-500 px-6 text-sm font-black text-white transition hover:bg-emerald-400"
              >
                Explore Equipment
                <ArrowUpRight size={18} />
              </a>
            </div>
          </motion.div>

          {/* Right benefit cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-5 sm:grid-cols-2"
          >
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <motion.div
                  key={benefit.number}
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-[1.7rem] border border-slate-200/80 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${benefit.color} transition duration-300 group-hover:scale-110`}
                    >
                      <Icon size={26} />
                    </div>

                    <span className="text-sm font-black tracking-widest text-slate-200 transition group-hover:text-emerald-500">
                      {benefit.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-lg font-black leading-snug text-[#101c2c]">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {benefit.description}
                  </p>

                  <div className="mt-6 h-1 w-10 rounded-full bg-emerald-500 transition-all duration-300 group-hover:w-20" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-6 py-7 text-center md:px-10"
        >
          <p className="text-base font-bold leading-7 text-[#101c2c] md:text-lg">
            The right equipment. The right price.
            <span className="text-emerald-600">
              {" "}A smarter way to get things done.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
