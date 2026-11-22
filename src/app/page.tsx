
import HeroSection from "@/components/home/hero-section";
import CategoriesSection from "@/components/home/categories-section";
import FeaturedEquipment from "@/components/home/featured-equipment";
import WhyChooseUs from "@/components/home/why-choose-us";
import TestimonialsSection from "@/components/home/testimonials-section";
import OwnerCTA from "@/components/home/owner-cta";
import FAQSection from "@/components/home/faq-section";
import NewsletterSection from "@/components/home/newsletter-section";

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-base-100">
      <HeroSection />

      <CategoriesSection />

      <FeaturedEquipment />

      <section className="bg-base-200/60 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="badge badge-primary badge-outline mb-4 px-4 py-3 font-semibold">
              Simple Process
            </span>

            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Rent Equipment in{" "}
              <span className="text-primary">4 Easy Steps</span>
            </h2>

            <p className="mt-4 leading-7 text-base-content/60">
              Getting the equipment you need has never been easier.
              Follow these simple steps and get started.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                icon: "🔍",
                title: "Explore Equipment",
                description:
                  "Browse a wide range of quality equipment for your needs.",
              },
              {
                number: "02",
                icon: "📅",
                title: "Book Your Rental",
                description:
                  "Choose your preferred dates and submit your booking.",
              },
              {
                number: "03",
                icon: "💳",
                title: "Make Payment",
                description:
                  "Complete your booking through our secure payment process.",
              },
              {
                number: "04",
                icon: "🚀",
                title: "Start Creating",
                description:
                  "Get your equipment and bring your next project to life.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="group rounded-3xl border border-base-200 bg-base-100 p-7 transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-4xl">{step.icon}</span>
                  <span className="text-3xl font-black text-base-200 transition-colors group-hover:text-primary/30">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold">{step.title}</h3>

                <p className="mt-3 text-sm leading-7 text-base-content/60">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <TestimonialsSection />
      <OwnerCTA />
      <FAQSection />
      <NewsletterSection />
    </div>
  );
}
