
"use client";

import { motion } from "framer-motion";
import { Star, Quote, ArrowUpRight } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Ahmed",
    role: "Photographer",
    initials: "SA",
    color: "bg-violet-500",
    review:
      "GearNest made it incredibly easy to find the camera equipment I needed for my photography project. The booking experience was smooth and convenient!",
  },
  {
    name: "Rakib Hasan",
    role: "Small Business Owner",
    initials: "RH",
    color: "bg-sky-500",
    review:
      "Instead of purchasing expensive tools, I found everything I needed for my business through GearNest. It saved me money and time.",
  },
  {
    name: "Nusrat Jahan",
    role: "Content Creator",
    initials: "NJ",
    color: "bg-rose-500",
    review:
      "I love having access to different equipment without owning everything. The platform is simple to use and makes discovering equipment easy.",
  },
  {
    name: "Tanvir Rahman",
    role: "Event Organizer",
    initials: "TR",
    color: "bg-emerald-500",
    review:
      "Finding equipment for events used to be difficult. GearNest gives me a convenient way to explore rental options for different occasions.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-base-200/40 py-20 sm:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="badge badge-primary badge-outline mb-4 px-4 py-3 font-semibold">
            Customer Stories
          </span>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Loved by People Who{" "}
            <span className="text-primary">Create</span>
          </h2>

          <p className="mt-5 leading-8 text-base-content/60">
            Discover how GearNest makes equipment rentals easier
            for creators, professionals and everyday innovators.
          </p>
        </div>

        {/* Review Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item, index) => (
            <motion.article
              key={item.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              className="group flex flex-col rounded-3xl border border-base-200 bg-base-100 p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Quote Icon */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Quote size={22} />
                </div>

                <div className="flex gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill="currentColor"
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
              </div>

              {/* Review */}
              <p className="flex-1 text-sm leading-7 text-base-content/65">
                "{item.review}"
              </p>

              {/* Customer */}
              <div className="mt-8 flex items-center gap-3 border-t border-base-200 pt-5">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${item.color} text-sm font-bold text-white`}
                >
                  {item.initials}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold">
                    {item.name}
                  </h3>

                  <p className="mt-1 truncate text-xs text-base-content/50">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-sm text-base-content/50">
            Your next great rental experience starts here.
          </p>

          <a
            href="/equipment"
            className="mt-4 inline-flex items-center gap-2 font-bold text-primary transition-colors hover:text-secondary"
          >
            Explore GearNest
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
