"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  "Makeup",
  "Hair",
  "DJ",
  "Photographer",
  "Videographer",
  "Decor",
  "Venue",
  "Catering",
];

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

export default function BecomeAVendorPage() {
  const supabase = createClient();

  const [form, setForm] = useState({
    business_name: "",
    owner_name: "",
    email: "",
    phone: "",
    category: "",
    state: "",
    starting_price: "",
    bio: "",
    website: "",
    instagram: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.from("vendor_applications").insert({
      business_name: form.business_name,
      owner_name: form.owner_name,
      email: form.email,
      phone: form.phone || null,
      category: form.category,
      state: form.state,
      starting_price: form.starting_price
        ? parseInt(form.starting_price, 10)
        : null,
      bio: form.bio || null,
      website: form.website || null,
      instagram: form.instagram || null,
      status: "pending",
    });

    if (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#f8f6f2] text-neutral-900 px-6 py-24 flex items-center justify-center">
        <div className="max-w-xl text-center space-y-6">
          <h1 className="text-3xl font-serif">Application Received</h1>
          <p className="text-neutral-600">
            Thank you for applying. Our team will review your submission and
            reach out if you’re a fit for our curated marketplace.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-neutral-900 px-6 py-24">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <p className="uppercase tracking-[0.4em] text-xs text-neutral-500">
            Vendor Applications
          </p>

          <h1 className="text-5xl font-serif">
            Join the Marketplace.
          </h1>

          <p className="text-neutral-600 text-lg leading-relaxed">
            We curate culturally fluent Punjabi wedding professionals.
            Apply to be featured and connect with couples planning
            multi-day celebrations across the United States.
          </p>
        </div>

        <div className="border border-neutral-200 bg-white p-10 space-y-6 rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                required
                placeholder="Business Name"
                className="border p-3 w-full"
                value={form.business_name}
                onChange={(e) => updateField("business_name", e.target.value)}
              />
              <input
                required
                placeholder="Owner Name"
                className="border p-3 w-full"
                value={form.owner_name}
                onChange={(e) => updateField("owner_name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                required
                type="email"
                placeholder="Email"
                className="border p-3 w-full"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
              <input
                placeholder="Phone"
                className="border p-3 w-full"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <select
                required
                className="border p-3 w-full"
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
              >
                <option value="">Select Category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                required
                className="border p-3 w-full"
                value={form.state}
                onChange={(e) => updateField("state", e.target.value)}
              >
                <option value="">Select State</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <input
              type="number"
              placeholder="Starting Price (USD)"
              className="border p-3 w-full"
              value={form.starting_price}
              onChange={(e) => updateField("starting_price", e.target.value)}
            />

            <textarea
              placeholder="Tell us about your services"
              className="border p-3 w-full h-32"
              value={form.bio}
              onChange={(e) => updateField("bio", e.target.value)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                placeholder="Website"
                className="border p-3 w-full"
                value={form.website}
                onChange={(e) => updateField("website", e.target.value)}
              />
              <input
                placeholder="Instagram"
                className="border p-3 w-full"
                value={form.instagram}
                onChange={(e) => updateField("instagram", e.target.value)}
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 tracking-wide hover:bg-gray-900 transition disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
