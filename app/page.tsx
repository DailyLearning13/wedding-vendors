import Link from "next/link";
import FeaturedVendors from "./components/FeaturedVendors";

const CATEGORY_MAP = [
  { label: "Makeup", value: "Makeup" },
  { label: "Hair", value: "Hair" },
  { label: "Decor", value: "Decor" },
  { label: "DJ / Live Music", value: "DJ / Music" },
  { label: "Tent", value: "Tent" },
  { label: "Photographer", value: "Photographer" },
  { label: "Videographer", value: "Videographer" },
  { label: "Venue", value: "Venue" },
  { label: "Catering", value: "Catering" },
];

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      {/* HERO */}
      <section className="px-6 pb-6 pt-12 text-center md:pb-8 md:pt-16">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-neutral-500 md:mb-5">
            Punjabi Wedding Marketplace
          </p>

          <h1 className="text-5xl font-serif leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Celebrate Bigger.
            <br />
            Plan Smarter.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600 md:mt-6 md:text-lg">
            A refined marketplace for modern Punjabi weddings.
            Discover culturally fluent vendors across the United States.
          </p>
        </div>
      </section>

      <FeaturedVendors />

      {/* CATEGORIES */}
      <section className="px-6 py-10 md:py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-center font-serif text-3xl md:mb-8 md:text-4xl">
            Explore by Category
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {CATEGORY_MAP.map((category) => (
              <Link
                key={category.label}
                href={`/vendors?category=${encodeURIComponent(category.value)}`}
                className="rounded-xl border border-neutral-200 bg-white p-6 text-center font-serif text-xl tracking-wide transition duration-300 hover:border-amber-600 hover:text-amber-600 dark:border-neutral-700 dark:bg-neutral-900 md:p-8 md:text-2xl lg:text-[1.625rem] lg:leading-snug"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="bg-white px-6 py-10 md:py-12 dark:bg-neutral-900">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 font-serif text-3xl md:text-4xl">
            Begin Your Celebration.
          </h2>

          <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
            From Sangeet to Baraat to Anand Karaj, our vendors understand
            the scale, detail, and tradition of multi-day Punjabi celebrations.
            We curate professionals who blend heritage with modern refinement.
          </p>
        </div>
      </section>

      {/* BECOME A VENDOR */}
      <section className="border-t border-neutral-200 bg-neutral-50 px-6 py-10 md:py-12 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-neutral-500 dark:text-neutral-400">
            For professionals
          </p>
          <h2 className="mt-3 font-serif text-2xl text-neutral-900 dark:text-neutral-50 md:mt-4 md:text-3xl lg:text-4xl">
            List your services on the marketplace
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 md:text-base">
            Reach couples planning Punjabi weddings across the United States.
          </p>
          <Link
            href="/become-a-vendor"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-neutral-900 px-7 py-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 md:mt-8 md:px-8 md:py-3"
          >
            Become a vendor
          </Link>
        </div>
      </section>
    </main>
  );
}
