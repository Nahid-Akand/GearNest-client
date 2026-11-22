
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  Zap,
  CheckCircle2,
  MoveUpRight,
} from "lucide-react";

const features = [
  "Verified equipment",
  "Flexible rental periods",
  "Secure online booking",
];

const steps = [
  { number: "01", title: "Discover", text: "Explore available gear" },
  { number: "02", title: "Choose", text: "Find the right equipment" },
  { number: "03", title: "Book", text: "Reserve your rental" },
  { number: "04", title: "Create", text: "Bring your ideas to life" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#080f0d] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-emerald-400/10 blur-[140px]" />

      {/* Hero content */}
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-20 sm:pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-28 lg:pt-32">

        {/* Left side */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
              The smarter way to rent
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="max-w-2xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-[5rem]"
          >
            Don&apos;t Buy It.
            <span className="mt-3 block text-emerald-400">
              Just Rent It.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="mt-8 max-w-xl text-base leading-8 text-slate-400 sm:text-lg"
          >
            Get the right equipment for every project without the
            cost of ownership. Explore quality gear, book effortlessly,
            and make more happen with GearNest.
          </motion.p>

          {/* Search */}
          <motion.form
            variants={itemVariants}
            action="/equipment"
            method="GET"
            className="mt-10 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-2 backdrop-blur-xl sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <Search className="shrink-0 text-emerald-400" size={22} />
              <input
                type="search"
                name="search"
                minLength={2}
                placeholder="What are you looking for?"
                aria-label="Search equipment"
                className="w-full min-w-0 bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-400 px-7 text-sm font-bold text-[#07110d] transition-all hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/20"
            >
              Find Equipment
              <ArrowRight size={18} />
            </button>
          </motion.form>

          {/* Animated feature list */}
          <motion.div
            variants={containerVariants}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-3"
          >
            {features.map((feature) => (
              <motion.span
                key={feature}
                variants={itemVariants}
                className="flex items-center gap-2 text-xs font-medium text-slate-400 sm:text-sm"
              >
                <CheckCircle2 size={16} className="text-emerald-400" />
                {feature}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/equipment"
              className="group flex items-center gap-3 rounded-xl bg-emerald-400 px-7 py-4 text-sm font-bold text-[#07110d] transition-all hover:-translate-y-1 hover:bg-emerald-300"
            >
              Explore Equipment
              <MoveUpRight
                size={18}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl border border-white/15 px-7 py-4 text-sm font-semibold text-white transition-all hover:border-emerald-400/50 hover:bg-white/5"
            >
              Become an Owner
            </Link>
          </motion.div>
        </motion.div>

        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, x: 35 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.25,
            ease: "easeOut",
          }}
          className="relative mx-auto w-full max-w-xl"
        >
          {/* Image glow */}
          <motion.div
            animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.06, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-5 rounded-[2.5rem] bg-emerald-400/10 blur-2xl"
          />

          {/* Floating image */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative aspect-[4/5] max-h-[620px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#14201c] shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=90&w=1200&auto=format&fit=crop"
              alt="Professional construction equipment"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#080f0d] via-[#080f0d]/10 to-transparent" />

            <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 backdrop-blur-xl">
              <Zap size={15} className="text-emerald-400" />
              <span className="text-xs font-semibold tracking-wide text-white">
                RENT SMARTER
              </span>
            </div>

            <div className="absolute bottom-8 left-7 right-7">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
                Your next project starts here
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
                The right gear.
                <br />
                The right moment.
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
                Everything you need to get the job done, all in one place.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated bottom information strip */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="relative border-t border-white/10 bg-white/[0.025]"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-9 md:grid-cols-4">
          {steps.map((item) => (
            <motion.div
              key={item.number}
              variants={itemVariants}
              className="flex items-start gap-4"
            >
              <span className="text-xs font-bold text-emerald-400">
                {item.number}
              </span>
              <div>
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
