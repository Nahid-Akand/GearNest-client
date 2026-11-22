
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  HardHat,
  Car,
  Tractor,
  Laptop,
  PartyPopper,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface Equipment {
  _id: string;
  category: string;
}

interface EquipmentResponse {
  success: boolean;
  equipment: Equipment[];
  totalEquipment: number;
}

const categories = [
  {
    name: "Construction Equipment",
    apiCategory: "Construction",
    description: "Excavators, drills & building tools",
    icon: HardHat,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    name: "Photography Equipment",
    apiCategory: "Photography",
    description: "Cameras, lenses & lighting",
    icon: Camera,
    color: "bg-violet-500/10 text-violet-600",
  },
  {
    name: "Vehicles & Transportation",
    apiCategory: "Vehicles & Transportation",
    description: "Cars, trucks & transport vehicles",
    icon: Car,
    color: "bg-sky-500/10 text-sky-600",
  },
  {
    name: "Agriculture Equipment",
    apiCategory: "Agriculture Equipment",
    description: "Tractors, harvesters & farming tools",
    icon: Tractor,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    name: "Electronics",
    apiCategory: "Electronics",
    description: "Laptops, computers & smart devices",
    icon: Laptop,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    name: "Event Equipment",
    apiCategory: "Event Equipment",
    description: "Sound systems, lights & event gear",
    icon: PartyPopper,
    color: "bg-rose-500/10 text-rose-600",
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

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
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

export default function CategoriesSection() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await api.get<EquipmentResponse>("/equipment");
        setEquipment(response.data.equipment ?? []);
      } catch (error) {
        console.error("Category equipment count error:", error);
        setEquipment([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  return (
    <section className="overflow-hidden bg-base-100 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Animated Section Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"
        >
          <div>
            <motion.span
              variants={cardVariants}
              className="badge badge-primary badge-outline mb-4 px-4 py-3 font-semibold"
            >
              Explore Categories
            </motion.span>

            <motion.h2
              variants={cardVariants}
              className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Find the Right Gear for{" "}
              <span className="text-primary">Every Project</span>
            </motion.h2>

            <motion.p
              variants={cardVariants}
              className="mt-4 max-w-xl leading-7 text-base-content/60"
            >
              Explore our popular equipment categories and find
              everything you need for your next project.
            </motion.p>
          </div>

          <motion.div variants={cardVariants}>
            <Link
              href="/equipment"
              className="group inline-flex items-center gap-2 text-sm font-bold text-primary"
            >
              Explore all equipment
              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Animated Category Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {categories.map((category) => {
            const Icon = category.icon;

            const count = equipment.filter(
              (item) =>
                item.category?.trim().toLowerCase() ===
                category.apiCategory.trim().toLowerCase()
            ).length;

            return (
              <motion.div
                key={category.name}
                variants={cardVariants}
                whileHover={{
                  y: -7,
                  transition: { duration: 0.25 },
                }}
              >
                <Link
                  href={`/equipment?category=${encodeURIComponent(category.apiCategory)}`}
                  className="group relative flex h-full items-center gap-5 overflow-hidden rounded-3xl border border-base-200 bg-base-100 p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                >
                  {/* Category Icon */}
                  <motion.div
                    whileHover={{
                      scale: 1.12,
                      rotate: 5,
                    }}
                    transition={{ duration: 0.25 }}
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${category.color}`}
                  >
                    <Icon size={30} strokeWidth={1.8} />
                  </motion.div>

                  {/* Category Information */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold transition-colors group-hover:text-primary">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-sm text-base-content/55">
                      {category.description}
                    </p>

                    <p className="mt-3 text-xs font-semibold text-base-content/50">
                      {loading
                        ? "Loading..."
                        : `${count} ${count === 1 ? "item" : "items"}`}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <motion.div
                    whileHover={{ rotate: 45, scale: 1.1 }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-base-200 text-base-content/50 transition-colors group-hover:bg-primary group-hover:text-primary-content"
                  >
                    <ArrowUpRight size={18} />
                  </motion.div>

                  {/* Hover Glow */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
