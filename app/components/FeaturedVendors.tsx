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
    <section className="px-6 py-24 bg-white">
      <div className="max-w-6xl mx-auto space-y-12">

        <div className="text-center space-y-4">
          <p className="uppercase tracking-[0.4em] text-xs text-neutral-500">
            Premium Partners
          </p>
          <h2 className="text-4xl font-serif">
            Featured Vendors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendors/${vendor.id}`}
              className="border border-neutral-200 rounded-2xl p-6 hover:shadow-md transition bg-neutral-50"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs bg-amber-500 text-white px-3 py-1 rounded-full">
                  ★ Featured
                </span>
                <span className="text-xs text-neutral-500">
                  {vendor.category}
                </span>
              </div>

              <h3 className="text-lg font-semibold mb-2">
                {vendor.business_name}
              </h3>

              <p className="text-sm text-neutral-600">
                {vendor.city}, {vendor.state_province}
              </p>

              <p className="text-sm font-medium mt-3">
                Starting at ${vendor.starting_price?.toLocaleString()}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
