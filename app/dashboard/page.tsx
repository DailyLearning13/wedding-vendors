"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Vendor = {
  id: string;
  owner_id: string | null;
  business_name: string | null;
  bio: string | null;
  category: string | null;
  city: string | null;
  state_province: string | null;
  starting_price: number | null;
  is_verified: boolean | null;
  is_approved: boolean | null;
};

type VendorPhoto = {
  id: string;
  vendor_id: string;
  storage_path: string;
  sort_order: number;
  created_at: string;
};

type LoadState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "no_vendor" }
  | { status: "ready"; vendor: Vendor }
  | { status: "error"; message: string };

function formatPriceUSD(value: number | null) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const [state, setState] = useState<LoadState>({ status: "loading" });

  const [photos, setPhotos] = useState<VendorPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setState({ status: "loading" });

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (cancelled) return;

      if (userErr) {
        setState({
          status: "error",
          message: userErr.message || "Failed to read auth user.",
        });
        return;
      }

      const user = userData?.user;
      if (!user) {
        setState({ status: "unauthenticated" });
        return;
      }

      const { data: vendor, error: vendorErr } = await supabase
        .from("vendors")
        .select(
          "id,owner_id,business_name,bio,category,city,state_province,starting_price,is_verified,is_approved"
        )
        .eq("owner_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (vendorErr) {
        setState({
          status: "error",
          message: vendorErr.message || "Failed to load vendor.",
        });
        return;
      }

      if (!vendor) {
        setState({ status: "no_vendor" });
        return;
      }

      setState({ status: "ready", vendor });
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  useEffect(() => {
    if (state.status !== "ready") return;

    async function loadPhotos() {
      const { data, error } = await supabase
        .from("vendor_photos")
        .select("id,vendor_id,storage_path,sort_order,created_at")
        .eq("vendor_id", state.vendor.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!error && data) {
        setPhotos(data);
      }
    }

    loadPhotos();
  }, [state, supabase, refreshKey]);

  async function handleUpload(files: FileList | null) {
    if (!files || state.status !== "ready") return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const storagePath = `${state.vendor.id}/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from("vendor-images")
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadErr) throw uploadErr;

        const { error: insertErr } = await supabase
          .from("vendor_photos")
          .insert({
            vendor_id: state.vendor.id,
            storage_path: storagePath,
          });

        if (insertErr) throw insertErr;
      }

      setRefreshKey((k) => k + 1);
    } catch (e: any) {
      alert(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(photo: VendorPhoto) {
    if (state.status !== "ready") return;

    const ok = confirm("Delete this photo?");
    if (!ok) return;

    try {
      const { error: storageErr } = await supabase.storage
        .from("vendor-images")
        .remove([photo.storage_path]);
      if (storageErr) throw storageErr;

      const { error: dbErr } = await supabase
        .from("vendor_photos")
        .delete()
        .eq("id", photo.id);
      if (dbErr) throw dbErr;

      setRefreshKey((k) => k + 1);
    } catch (e: any) {
      alert(e.message || "Delete failed");
    }
  }

  function getPublicUrl(path: string) {
    const { data } = supabase.storage.from("vendor-images").getPublicUrl(path);
    return data.publicUrl;
  }

  return (
    <main className="min-h-screen bg-[#07070A] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs tracking-[0.25em] text-white/60">
              VENDOR DASHBOARD
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Manage your presence
            </h1>
          </div>

          <Link
            href="/vendors"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/90 hover:bg-white/10"
          >
            View Marketplace
          </Link>
        </header>

        <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              {state.status === "ready" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    {state.vendor.business_name}
                  </h2>
                  <p className="text-sm text-white/70">
                    {state.vendor.category} ·{" "}
                    {[state.vendor.city, state.vendor.state_province]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="text-sm text-white/70">
                    Starting at {formatPriceUSD(state.vendor.starting_price)}
                  </p>
                  <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/75">
                    {state.vendor.bio || "No bio yet."}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Gallery</h3>
                <label className="cursor-pointer rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
                  {uploading ? "Uploading…" : "Upload Photos"}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    disabled={uploading || state.status !== "ready"}
                    onChange={(e) => handleUpload(e.target.files)}
                  />
                </label>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                {photos.map((photo) => {
                  const url = getPublicUrl(photo.storage_path);
                  return (
                    <div
                      key={photo.id}
                      className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/30"
                    >
                      <img
                        src={url}
                        alt="Vendor"
                        className="h-48 w-full object-cover"
                      />
                      <button
                        onClick={() => handleDelete(photo)}
                        className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>

              {photos.length === 0 && (
                <p className="mt-6 text-sm text-white/60">
                  No photos yet. Upload your first images.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}