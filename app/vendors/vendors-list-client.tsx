"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const STATES = ["NJ", "NY", "CA", "TX", "IL"];

const CATEGORIES = [
  "DJ","Live Music","Photographer","Videographer",
  "Makeup","Hair","Decor","Venue","Catering"
];

// 🎨 CATEGORY COLORS
function getCategoryStyle(category: string | null) {
  switch (category) {
    case "DJ":
      return "bg-purple-100 text-purple-700";
    case "Live Music":
      return "bg-pink-100 text-pink-700";
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
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filtered, setFiltered] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  /* LOAD DATA */
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

  /* FILTER + SORT */
  useEffect(() => {
    let result = [...vendors];

    if (search) {
      result = result.filter((v) =>
        v.business_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) result = result.filter((v) => v.category === category);
    if (state) result = result.filter((v) => v.state_province === state);

    if (minPrice) {
      result = result.filter(
        (v) => v.starting_price && v.starting_price >= Number(minPrice)
      );
    }

    if (maxPrice) {
      result = result.filter(
        (v) => v.starting_price && v.starting_price <= Number(maxPrice)
      );
    }

    // FEATURED FIRST
    result.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0;
    });

    setFiltered(result);
  }, [search, category, state, minPrice, maxPrice, vendors]);

  return (
    <div className="min-h-screen bg-[#f8f6f2] text-black">
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-5xl font-serif">
            Discover Vendors
          </h1>
          <p className="text-gray-600 mt-3">
            Browse top Punjabi wedding professionals
          </p>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-10 flex flex-wrap gap-3 items-center">

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-full text-sm"
          >
            <option value="">Category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          {/* STATE */}
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="px-4 py-2 border rounded-full text-sm"
          >
            <option value="">State</option>
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </select>

          {/* PRICE */}
          <input
            placeholder="Min $"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-3 py-2 border rounded-full text-sm w-24"
          />

          <input
            placeholder="Max $"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-3 py-2 border rounded-full text-sm w-24"
          />

          {/* SEARCH LAST */}
          <input
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-full text-sm w-48 ml-auto"
          />

        </div>

        {/* GRID */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map((vendor) => (
              <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
                <div className="h-[220px] flex flex-col justify-between bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer p-5">

                  {/* TOP ROW */}
                  <div className="flex justify-between items-center">

                    {/* FEATURED (GOLD) */}
                    {vendor.is_featured ? (
                      <span className="bg-yellow-400 text-black text-xs px-4 py-1 rounded-full font-semibold">
                        ★ Featured
                      </span>
                    ) : (
                      <div />
                    )}

                    {/* CATEGORY (COLOR) */}
                    <span className={`text-xs px-4 py-1 rounded-full ${getCategoryStyle(vendor.category)}`}>
                      {vendor.category || "Vendor"}
                    </span>

                  </div>

                  {/* NAME */}
                  <h3 className="font-semibold text-sm text-gray-900 mt-2 line-clamp-2">
                    {vendor.business_name || "Vendor Name"}
                  </h3>

                  {/* LOCATION */}
                  <p className="text-gray-600 text-xs">
                    {vendor.city || "City"}, {vendor.state_province || "State"}
                  </p>

                  {/* PRICE */}
                  <p className="text-gray-400 text-xs">
                    {vendor.starting_price
                      ? `Starting at $${vendor.starting_price}`
                      : "Pricing available"}
                  </p>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}