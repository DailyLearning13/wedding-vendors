"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Vendor = {
  id: string;
  business_name: string;
  category: string;
  is_verified: boolean;
  is_featured: boolean;
};

export default function AdminApplicationsPage() {
  const supabase = createClient();

  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setAuthorized(false);
      return;
    }

    if (user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      setAuthorized(true);
      fetchData();
    } else {
      setAuthorized(false);
    }
  }

  async function fetchData() {
    setLoading(true);

    const { data } = await supabase
      .from("vendors")
      .select("id,business_name,category,is_verified,is_featured")
      .eq("is_approved", true);

    setVendors(data || []);
    setLoading(false);
  }

  async function toggleVerification(vendor: Vendor) {
    await supabase
      .from("vendors")
      .update({ is_verified: !vendor.is_verified })
      .eq("id", vendor.id);

    fetchData();
  }

  async function toggleFeatured(vendor: Vendor) {
    if (vendor.is_featured) {
      await supabase
        .from("vendors")
        .update({ is_featured: false })
        .eq("id", vendor.id);

      fetchData();
      return;
    }

    const { data } = await supabase
      .from("vendors")
      .select("id")
      .eq("category", vendor.category)
      .eq("is_featured", true);

    if (data && data.length >= 3) {
      alert("Maximum 3 featured vendors allowed per category.");
      return;
    }

    await supabase
      .from("vendors")
      .update({ is_featured: true })
      .eq("id", vendor.id);

    fetchData();
  }

  if (authorized === false) {
    return <main className="min-h-screen flex items-center justify-center">Unauthorized</main>;
  }

  if (authorized === null || loading) {
    return <main className="min-h-screen flex items-center justify-center">Loading...</main>;
  }

  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-8">

        <h2 className="text-3xl font-serif">Approved Vendors</h2>

        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{vendor.business_name}</p>
              <p className="text-sm text-neutral-500">{vendor.category}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => toggleVerification(vendor)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  vendor.is_verified
                    ? "bg-green-600 text-white"
                    : "border"
                }`}
              >
                {vendor.is_verified ? "✓ Verified" : "Verify"}
              </button>

              <button
                onClick={() => toggleFeatured(vendor)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  vendor.is_featured
                    ? "bg-amber-500 text-white"
                    : "border"
                }`}
              >
                {vendor.is_featured ? "★ Featured" : "Feature"}
              </button>
            </div>
          </div>
        ))}

      </div>
    </main>
  );
}
