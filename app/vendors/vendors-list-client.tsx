"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const STATES = ["NJ", "NY", "CA", "TX", "IL"];

const CATEGORIES = [
  "Makeup",
  "Hair",
  "Decor",
  "DJ / Music",
  "Tent",
  "Photographer",
  "Videographer",
  "Venue",
  "Catering",
];

/** Stored vendor categories that map to the “DJ / Live Music” filter */
const DJ_LIVE_MUSIC_TAGS = ["DJ / Music", "DJ", "Live Music"] as const;

function categoryOptionLabel(c: string) {
  if (c === "DJ / Music") return "DJ / Live Music";
  return c;
}

function vendorMatchesCategoryFilter(
  vendorCategory: string | null,
  selected: string
) {
  if (!selected) return true;
  if (!vendorCategory) return false;
  if (selected === "DJ / Music") {
    return (DJ_LIVE_MUSIC_TAGS as readonly string[]).includes(vendorCategory);
  }
  return vendorCategory === selected;
}

// 🎨 CATEGORY COLORS
function getCategoryStyle(category: string | null) {
  switch (category) {
    case "DJ":
    case "DJ / Music":
    case "Live Music":
      return "bg-purple-100 text-purple-700";
    case "Tent":
      return "bg-teal-100 text-teal-800";
    case "Photographer":
      return "bg-blue-100 text-blue-700";
    case "Videographer":
      return "bg-indigo-100 text-indigo-700";
    case "Makeup":
      return "bg-rose-100 text-rose-700";
    case "Hair":
      return "bg-yellow-100 text-yellow-700";
    case "Decor":
      return "bg-green-100 text-green-700";
    case "Venue":
      return "bg-gray-200 text-gray-800";
    case "Catering":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

type Vendor = {
  id: string;
  business_name: string | null;
  category: string | null;
  city: string | null;
  state_province: string | null;
  starting_price: number | null;
  is_verified: boolean;
  is_featured: boolean;
};

export default function VendorsListClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filtered, setFiltered] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(() => {
    const raw = searchParams.get("category");
    return raw && CATEGORIES.includes(raw) ? raw : "";
  });
  const [state, setState] = useState("");

  const applyCategoryToUrl = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("category", value);
      else params.delete("category");
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const raw = searchParams.get("category");
    if (raw && CATEGORIES.includes(raw)) {
      setCategory(raw);
    } else if (!raw) {
      setCategory("");
    }
  }, [searchParams]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("vendors")
        .select("*")
        .eq("is_approved", true);

      setVendors(data || []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    let result = [...vendors];

    if (search) {
      result = result.filter((v) =>
        v.business_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      result = result.filter((v) =>
        vendorMatchesCategoryFilter(v.category, category)
      );
    }
    if (state) result = result.filter((v) => v.state_province === state);

    result.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0;
    });

    setFiltered(result);
  }, [search, category, state, vendors]);

  const filterInput =
    "rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs text-neutral-900 shadow-sm transition placeholder:text-neutral-400 focus:border-amber-600/60 focus:outline-none focus:ring-1 focus:ring-amber-500/20";

  return (
    <div className="min-h-screen bg-[#f5f3ef] text-neutral-900">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-8 md:pb-20 md:pt-10">
        <header className="mb-8 border-b border-neutral-200/80 pb-8 md:mb-10">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
            Marketplace
          </p>
          <h1 className="mt-2 font-serif text-4xl tracking-tight text-neutral-900 md:text-5xl">
            Discover vendors
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base">
            Curated Punjabi wedding professionals — filter by category and
            location.
          </p>
        </header>

        <div className="mb-8 flex flex-col gap-2 rounded-xl border border-neutral-200/90 bg-white p-3 shadow-sm ring-1 ring-black/[0.03] md:flex-row md:flex-wrap md:items-center md:gap-2 md:p-3">
          <select
            value={category}
            onChange={(e) => {
              const value = e.target.value;
              setCategory(value);
              applyCategoryToUrl(value);
            }}
            className={`${filterInput} min-w-0 flex-1 md:max-w-[11rem]`}
            aria-label="Category"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {categoryOptionLabel(c)}
              </option>
            ))}
          </select>

          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={`${filterInput} w-full min-w-[6.5rem] md:w-auto`}
            aria-label="State"
          >
            <option value="">All states</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${filterInput} w-full min-w-0 md:ml-auto md:max-w-xs md:flex-1`}
            type="search"
            aria-label="Search vendors"
          />
        </div>

        {loading ? (
          <p className="text-sm text-neutral-500">Loading vendors…</p>
        ) : filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-300 bg-white/60 px-6 py-12 text-center text-sm text-neutral-600">
            No vendors match your filters. Try another category or location.
          </p>
        ) : (
          <div className="grid grid-cols-2 justify-items-center gap-x-2 gap-y-5 pt-2 sm:grid-cols-3 sm:gap-x-3 sm:gap-y-6 md:grid-cols-4 md:gap-4 lg:grid-cols-5 lg:gap-x-4 lg:gap-y-6">
            {filtered.map((vendor) => (
              <Link
                key={vendor.id}
                href={`/vendors/${vendor.id}`}
                className="group block aspect-square w-full max-w-[7.75rem] outline-none sm:max-w-[8.25rem] md:max-w-[8.75rem]"
              >
                <div className="relative flex h-full w-full cursor-pointer flex-col overflow-visible rounded-lg border border-neutral-200/90 bg-white p-2 pt-5 shadow-sm ring-1 ring-black/[0.02] transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md sm:rounded-xl sm:p-2.5 sm:pt-5">
                  {vendor.is_featured ? (
                    <span className="absolute left-1.5 top-0 z-10 max-w-[48%] -translate-y-1/2 truncate rounded-full bg-amber-500 px-1.5 py-px text-[8px] font-semibold uppercase tracking-wide text-white shadow ring-2 ring-[#f5f3ef] sm:left-2 sm:px-2 sm:text-[9px]">
                      Featured
                    </span>
                  ) : null}
                  <span
                    className={`absolute right-1.5 top-0 z-10 max-w-[52%] -translate-y-1/2 truncate rounded-full px-1.5 py-px text-[8px] font-medium shadow ring-2 ring-[#f5f3ef] sm:right-2 sm:px-2 sm:text-[9px] ${getCategoryStyle(vendor.category)}`}
                  >
                    {vendor.category || "Vendor"}
                  </span>

                  <div className="flex min-h-0 flex-1 flex-col justify-between gap-1">
                    <div className="min-h-0">
                      <h3 className="line-clamp-2 text-left text-[11px] font-semibold leading-snug text-neutral-900 sm:text-xs">
                        {vendor.business_name || "Vendor Name"}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-left text-[9px] leading-tight text-neutral-600 sm:text-[10px]">
                        {[vendor.city, vendor.state_province]
                          .filter(Boolean)
                          .join(", ") || "Location TBD"}
                      </p>
                    </div>
                    <p className="shrink-0 text-left text-[9px] leading-tight text-neutral-500 sm:text-[10px]">
                      {vendor.starting_price != null && vendor.starting_price > 0
                        ? `From $${vendor.starting_price.toLocaleString()}`
                        : "Pricing on request"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
