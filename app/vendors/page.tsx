"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Vendor = {
  id: string;
  business_name: string;
  categories: string[];
  city: string;
  state_province: string;
  country: string;
  starting_price: number | null;
  currency: string;
  is_verified: boolean;
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select(
          "id,business_name,categories,city,state_province,country,starting_price,currency,is_verified"
        )
        .eq("is_approved", true)
        .order("is_verified", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setVendors(data ?? []);
      }

      setLoading(false);
    };

    load();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vendors</h1>
        <Link href="/" className="text-sm underline">
          Back home
        </Link>
      </div>

      {loading && <p className="mt-6 text-sm">Loading vendors…</p>}

      {error && (
        <p className="mt-6 text-sm text-red-600">Error: {error}</p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {vendors.map((v) => (
          <div key={v.id} className="rounded-xl border bg-white p-4">
            <div className="flex items-start justify-between">
              <h2 className="text-sm font-medium">{v.business_name}</h2>
              {v.is_verified && (
                <span className="rounded-full bg-black px-2 py-1 text-xs text-white">
                  Verified
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-zinc-600">
              {v.city}, {v.state_province} · {v.country}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {v.categories.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-zinc-100 px-2 py-1 text-xs"
                >
                  {c}
                </span>
              ))}
            </div>

            <p className="mt-3 text-sm">
              {v.starting_price
                ? `Starting at ${v.currency} ${v.starting_price}`
                : "Price not listed"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
