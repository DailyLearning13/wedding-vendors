"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

/* ---------------- STATES ---------------- */

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

const CATEGORIES = [
  "DJ","Live Music","Photographer","Videographer",
  "Makeup","Hair","Decor","Venue","Catering"
];

const categoryColors: Record<string, string> = {
  DJ: "bg-purple-200 text-purple-900",
  "Live Music": "bg-fuchsia-200 text-fuchsia-900",
  Photographer: "bg-blue-200 text-blue-900",
  Videographer: "bg-indigo-200 text-indigo-900",
  Makeup: "bg-pink-200 text-pink-900",
  Hair: "bg-rose-200 text-rose-900",
  Decor: "bg-orange-200 text-orange-900",
  Venue: "bg-emerald-200 text-emerald-900",
  Catering: "bg-yellow-200 text-yellow-900",
};

type Vendor = {
  id: string;
  business_name: string;
  category: string;
  city: string;
  state_province: string;
  starting_price: number;
  is_verified: boolean;
  is_featured: boolean;
  average_rating?: number;
  review_count?: number;
  created_at: string;
};

export default function VendorsListClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [stateFilter, setStateFilter] = useState(searchParams.get("state") || "");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("priority");

  const PAGE_SIZE = 12; // ✅ 12 per page
  const [page, setPage] = useState(1);

  /* ---------------- URL SYNC ---------------- */

  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (stateFilter) params.set("state", stateFilter);
    if (categoryFilter) params.set("category", categoryFilter);

    router.replace(`/vendors?${params.toString()}`);
  }, [search, stateFilter, categoryFilter]);

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      let query = supabase
        .from("vendors")
        .select(`
          *,
          reviews (rating)
        `)
        .eq("is_approved", true)
        .range(0, 1000); // ✅ Prevent Supabase limiting results

      if (stateFilter)
        query = query.eq("state_province", stateFilter);

      if (categoryFilter)
        query = query.eq("category", categoryFilter);

      if (search)
        query = query.ilike("business_name", `%${search}%`);

      if (minPrice)
        query = query.gte("starting_price", Number(minPrice));

      if (maxPrice)
        query = query.lte("starting_price", Number(maxPrice));

      if (sortBy === "newest")
        query = query.order("created_at", { ascending: false });

      if (sortBy === "price_low")
        query = query.order("starting_price", { ascending: true });

      if (sortBy === "price_high")
        query = query.order("starting_price", { ascending: false });

      if (sortBy === "priority")
        query = query
          .order("is_featured", { ascending: false })
          .order("is_verified", { ascending: false })
          .order("created_at", { ascending: false });

      const { data } = await query;

      const enriched =
        data?.map((v: any) => {
          const ratings = v.reviews?.map((r: any) => r.rating) || [];
          const avg =
            ratings.length > 0
              ? ratings.reduce((a: number, b: number) => a + b, 0) /
                ratings.length
              : null;

          return {
            ...v,
            average_rating: avg,
            review_count: ratings.length,
          };
        }) || [];

      setVendors(enriched);
      setLoading(false);
    };

    load();
  }, [search, stateFilter, categoryFilter, minPrice, maxPrice, sortBy]);

  const totalPages = Math.ceil(vendors.length / PAGE_SIZE);
  const paginated = vendors.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-[#f4f1ea]">
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-12">

        <div>
          <h1 className="text-5xl font-serif text-neutral-900">
            Discover Vendors
          </h1>
          <p className="text-neutral-600 mt-3">
            Find trusted Punjabi wedding professionals.
          </p>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="bg-white text-black p-6 rounded-3xl shadow-md space-y-4">

          <input
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-black"
          />

          <div className="flex flex-wrap gap-4">

            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="border rounded-xl px-4 py-2 text-black"
            >
              <option value="">All States</option>
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded-xl px-4 py-2 text-black"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min $"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border rounded-xl px-4 py-2 w-32 text-black"
            />

            <input
              type="number"
              placeholder="Max $"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border rounded-xl px-4 py-2 w-32 text-black"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-xl px-4 py-2 text-black"
            >
              <option value="priority">Featured & Verified</option>
              <option value="newest">Newest</option>
              <option value="price_low">Lowest Price</option>
              <option value="price_high">Highest Price</option>
            </select>
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <div>Loading vendors...</div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-10">
              {paginated.map((vendor) => {
                const color =
                  categoryColors[vendor.category] ||
                  "bg-gray-200 text-gray-900";

                return (
                  <Link
                    key={vendor.id}
                    href={`/vendors/${vendor.id}`}
                    className={`relative p-6 rounded-3xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${
                      vendor.is_featured
                        ? "bg-gradient-to-br from-amber-100 to-white border border-amber-300"
                        : "bg-white border border-neutral-200"
                    }`}
                  >
                    <div className="flex justify-between mb-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${color}`}
                      >
                        {vendor.category}
                      </span>

                      {vendor.is_verified && (
                        <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-neutral-900">
                      {vendor.business_name}
                    </h3>

                    <p className="text-neutral-600 mt-1">
                      {vendor.city}, {vendor.state_province}
                    </p>

                    {vendor.average_rating && (
                      <div className="mt-3 text-amber-600 font-medium">
                        ⭐ {vendor.average_rating.toFixed(1)} ({vendor.review_count})
                      </div>
                    )}

                    <p className="mt-4 font-semibold text-neutral-900">
                      ${vendor.starting_price?.toLocaleString()}
                    </p>
                  </Link>
                );
              })}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border rounded-xl bg-white text-black disabled:opacity-40"
                >
                  Prev
                </button>

                <span className="text-black font-medium">
                  Page {page} of {totalPages}
                </span>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border rounded-xl bg-white text-black disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}