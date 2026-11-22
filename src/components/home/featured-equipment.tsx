
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Package,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand?: string;
  condition: string;
  pricePerDay: number;
  location: string;
  images: string[];
  status: string;
  isAvailable: boolean;
}

interface EquipmentResponse {
  success: boolean;
  message: string;
  totalEquipment: number;
  equipment: Equipment[];
}

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

export default function FeaturedEquipment() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await api.get<EquipmentResponse>("/equipment", {
          params: {
            limit: 6,
          },
        });

        const featuredItems = response.data.equipment
          .filter(
            (item) =>
              item.status === "approved" && item.isAvailable
          )
          .slice(0, 6);

        setEquipment(featuredItems);
      } catch (err) {
        console.error("Failed to fetch featured equipment:", err);
        setError("Unable to load equipment. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const handleViewDetails = (equipmentId: string) => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    router.push(`/equipment/${equipmentId}`);
  };

  return (
    <section className="overflow-hidden bg-base-100 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Animated Section Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <div>
            <motion.span
              variants={cardVariants}
              className="badge badge-primary badge-outline mb-4 px-4 py-3 font-semibold"
            >
              Featured Collection
            </motion.span>

            <motion.h2
              variants={cardVariants}
              className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Explore Our{" "}
              <span className="text-primary">Equipment</span>
            </motion.h2>

            <motion.p
              variants={cardVariants}
              className="mt-4 max-w-xl leading-7 text-base-content/60"
            >
              Discover quality equipment available for rent.
              Find the right tools for your next project.
            </motion.p>
          </div>

          <motion.button
            variants={cardVariants}
            onClick={() => router.push("/equipment")}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.96 }}
            className="group inline-flex items-center gap-2 text-sm font-bold text-primary"
          >
            Explore All Equipment
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </motion.button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[430px] animate-pulse rounded-3xl bg-base-200"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-3xl border border-error/20 bg-error/5 p-10 text-center">
            <p className="font-semibold text-error">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary btn-sm mt-5"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && equipment.length === 0 && (
          <div className="rounded-3xl border border-base-200 bg-base-200/40 px-6 py-16 text-center">
            <Package
              size={42}
              className="mx-auto text-base-content/30"
            />

            <h3 className="mt-5 text-xl font-bold">
              No Equipment Available Yet
            </h3>

            <p className="mt-2 text-sm text-base-content/60">
              Approved equipment listings will appear here.
            </p>
          </div>
        )}

        {/* Animated Equipment Cards */}
        {!loading && !error && equipment.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
          >
            {equipment.map((item) => (
              <motion.article
                key={item._id}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.25 },
                }}
                className="group overflow-hidden rounded-3xl border border-base-200 bg-base-100 transition-colors hover:border-primary/30 hover:shadow-xl"
              >
                {/* Image */}
                <button
                  type="button"
                  onClick={() => handleViewDetails(item._id)}
                  aria-label={`View details of ${item.name}`}
                  className="relative block h-56 w-full overflow-hidden bg-base-200 text-left"
                >
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package
                        size={48}
                        className="text-base-content/30"
                      />
                    </div>
                  )}

                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="absolute left-4 top-4 rounded-full bg-success px-3 py-1.5 text-xs font-bold text-success-content"
                  >
                    Available
                  </motion.span>
                </button>

                {/* Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {item.category}
                    </span>

                    <span className="rounded-lg bg-base-200 px-2 py-1 text-xs capitalize text-base-content/60">
                      {item.condition}
                    </span>
                  </div>

                  <h3 className="mt-3 line-clamp-1 text-lg font-bold transition-colors group-hover:text-primary">
                    {item.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-base-content/55">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-xs text-base-content/50">
                    <MapPin size={15} />
                    <span className="line-clamp-1">
                      {item.location}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-base-200 pt-4">
                    <div>
                      <p className="text-xs text-base-content/50">
                        Rental price
                      </p>

                      <p className="mt-1 text-xl font-black text-primary">
                        ৳{item.pricePerDay.toLocaleString("en-BD")}
                        <span className="text-xs font-medium text-base-content/50">
                          /day
                        </span>
                      </p>
                    </div>

                    <motion.button
                      type="button"
                      onClick={() => handleViewDetails(item._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-primary btn-sm rounded-xl"
                    >
                      View Details
                      <ArrowRight size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Animated Bottom Link */}
        {!loading && !error && equipment.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/equipment")}
              className="btn btn-outline btn-primary rounded-xl px-8"
            >
              View All Equipment
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
