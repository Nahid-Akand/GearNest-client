
"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Send, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    // Newsletter backend integration will be added later.
    toast.success("Thanks for your interest in GearNest!");
    setEmail("");
  };

  return (
    <section className="bg-base-200/50 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-secondary px-6 py-14 shadow-xl sm:px-12 sm:py-16 lg:px-16"
        >
          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-10 -top-20 h-60 w-60 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative grid items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <div className="text-primary-content">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={15} />
                Stay in the Loop
              </span>

              <h2 className="mt-6 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                Get More Out of
                <span className="mt-2 block text-white/75">
                  Every Opportunity.
                </span>
              </h2>

              <p className="mt-5 max-w-lg leading-8 text-white/80">
                Be the first to hear about new equipment,
                platform updates and exciting opportunities
                from the GearNest community.
              </p>

              <div className="mt-7 flex items-center gap-3 text-sm text-white/75">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <Mail size={20} />
                </div>
                <span>Useful updates, delivered to your inbox.</span>
              </div>
            </div>

            {/* Subscription Form */}
            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-6">
                <h3 className="text-xl font-extrabold text-white">
                  Join Our Newsletter
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Enter your email to stay connected with GearNest.
                </p>
              </div>

              <form onSubmit={handleSubscribe}>
                <label
                  htmlFor="newsletter-email"
                  className="mb-2 block text-sm font-semibold text-white/90"
                >
                  Email Address
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/20 bg-white px-4 text-base-content">
                    <Mail size={18} className="shrink-0 text-base-content/40" />
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-base-content/40"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-primary shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    Subscribe
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </form>

              <div className="mt-6 flex items-center gap-2 text-xs text-white/60">
                <Send size={14} />
                <span>No spam. Just useful GearNest updates.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
