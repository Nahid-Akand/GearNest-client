
"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "What is GearNest?",
    answer:
      "GearNest is an equipment rental marketplace where customers can discover and rent different types of equipment from equipment owners.",
  },
  {
    question: "How can I rent equipment?",
    answer:
      "Create an account, explore the available equipment, select the item you need, choose your rental dates and submit your booking.",
  },
  {
    question: "How do I become an equipment owner?",
    answer:
      "Register with an owner account and submit your equipment details. Once your listing is reviewed and approved, it can appear in the marketplace.",
  },
  {
    question: "How is the rental price calculated?",
    answer:
      "Each equipment listing has a daily rental price. Your rental cost is calculated using the daily price and the number of rental days.",
  },
  {
    question: "Is online payment available?",
    answer:
      "GearNest is designed to support secure online payments through Stripe. Payment availability will depend on the booking and payment workflow.",
  },
  {
    question: "Can I manage my equipment listings?",
    answer:
      "Yes. Equipment owners can manage their submitted listings and view relevant rental information through their owner dashboard.",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="bg-base-100 py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:sticky lg:top-28 lg:h-fit"
        >
          <span className="badge badge-primary badge-outline mb-5 px-4 py-3 font-semibold">
            Got Questions?
          </span>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Frequently Asked{" "}
            <span className="text-primary">Questions</span>
          </h2>

          <p className="mt-5 max-w-md leading-8 text-base-content/60">
            Everything you need to know about renting equipment,
            becoming an owner and getting started with GearNest.
          </p>

          <div className="mt-9 rounded-3xl bg-base-200/70 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageCircle size={24} />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              Still have questions?
            </h3>

            <p className="mt-2 text-sm leading-6 text-base-content/60">
              Can't find the answer you're looking for? Get in
              touch with our team.
            </p>

            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3"
            >
              Contact Us
              <ArrowRight size={17} />
            </Link>
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.06,
                }}
                className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "border-primary/30 bg-primary/5 shadow-sm"
                    : "border-base-200 bg-base-100 hover:border-primary/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(isOpen ? null : index)
                  }
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                      isOpen
                        ? "bg-primary text-primary-content"
                        : "bg-base-200 text-base-content/50"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex-1 text-sm font-bold sm:text-base">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-base-content/50 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="border-t border-base-200/70 px-5 pb-6 pt-4 pl-[4.75rem] text-sm leading-7 text-base-content/60 sm:pl-[5.25rem]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
