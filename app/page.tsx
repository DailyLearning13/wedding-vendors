import Link from "next/link";
import FeaturedVendors from "./components/FeaturedVendors";

const CATEGORY_MAP = [
  { label: "Makeup", value: "Makeup" },
  { label: "Hair", value: "Hair" },
  { label: "Decor", value: "Decor" },
  { label: "DJ", value: "DJ" },
  { label: "Live Music", value: "Live Music" },
  { label: "Photographer", value: "Photographer" },
  { label: "Videographer", value: "Videographer" },
  { label: "Venue", value: "Venue" },
  { label: "Catering", value: "Catering" },
];

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">

      {/* HERO */}
      <section className="min-h-[75vh] flex flex-col justify-center items-center text-center px-6">
        <div className="max-w-4xl">

          <p className="uppercase tracking-[0.4em] text-xs text-neutral-500 mb-6">
            Punjabi Wedding Marketplace
          </p>

          <h1 className="text-6xl md:text-7xl font-serif leading-tight tracking-tight">
            Celebrate Bigger.
            <br />
            Plan Smarter.
          </h1>

          <p className="mt-8 text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            A refined marketplace for modern Punjabi weddings.
            Discover culturally fluent vendors across the United States.
          </p>

          <div className="mt-12 flex justify-center gap-12">
            <Link
              href="/vendors"
              className="text-sm uppercase tracking-[0.3em] border-b border-foreground pb-2 hover:text-amber-600 hover:border-amber-600 transition"
            >
              Explore Vendors
            </Link>

            <Link
              href="/become-a-vendor"
              className="text-sm uppercase tracking-[0.3em] border-b border-foreground pb-2 hover:text-amber-600 hover:border-amber-600 transition"
            >
              Become a Vendor
            </Link>
          </div>

        </div>
      </section>

      {/* FEATURED VENDORS */}
      <FeaturedVendors />

      {/* CATEGORIES */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">

          <h2 className="text-4xl font-serif text-center mb-14">
            Explore by Category
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CATEGORY_MAP.map((category) => (
              <Link
                key={category.label}
                href={`/vendors?category=${encodeURIComponent(category.value)}`}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-10 text-center font-serif text-2xl tracking-wide hover:border-amber-600 hover:text-amber-600 transition duration-300 rounded-xl"
              >
                {category.label}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="px-6 py-24 bg-white dark:bg-neutral-900">
        <div className="max-w-3xl mx-auto text-center">

          <h2 className="text-4xl font-serif mb-6">
            Begin Your Celebration.
          </h2>

          <p className="text-neutral-600 dark:text-neutral-400 leading-loose text-lg">
            From Sangeet to Baraat to Anand Karaj, our vendors understand
            the scale, detail, and tradition of multi-day Punjabi celebrations.
            We curate professionals who blend heritage with modern refinement.
          </p>

        </div>
      </section>

    </main>
  );
}
