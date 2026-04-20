"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type Vendor = {
  id: string;
  business_name: string;
  category: string;
  city: string;
  state_province: string;
  starting_price: number;
};

export default function FeaturedVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      const { data } = await supabase
        .from("vendors")
        .select("*")
        .eq("is_approved", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6);

      setVendors(data || []);
      setLoading(false);
    };

    loadFeatured();
  }, []);

  if (loading) return null;
  if (vendors.length === 0) return null;

  return (
    <section className="border-y border-white/10 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 px-6 pb-10 pt-8 text-neutral-100 md:pb-12 md:pt-10">
      <div className="mx-auto max-w-6xl space-y-8 md:space-y-10">
        <div className="space-y-2 text-center md:space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-400/95">
            Premium partners
          </p>
          <h2 className="font-serif text-3xl text-white md:text-4xl md:leading-tight">
            Featured vendors
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-neutral-400 md:text-base">
            Handpicked teams we trust for multi-day celebrations — clear
            pricing, responsive planning, and cultural fluency.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {vendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendors/${vendor.id}`}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] ring-1 ring-white/5 transition hover:border-amber-500/40 hover:bg-white/[0.07] md:p-6"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className="rounded-full bg-amber-500/95 px-3 py-1 text-xs font-semibold text-neutral-950">
                  ★ Featured
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-200">
                  {vendor.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-white group-hover:text-amber-200/95">
                {vendor.business_name}
              </h3>

              <p className="mt-2 text-sm text-neutral-400">
                {vendor.city}, {vendor.state_province}
              </p>

              <p className="mt-3 text-sm font-medium text-amber-200/90">
                Starting at ${vendor.starting_price?.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
