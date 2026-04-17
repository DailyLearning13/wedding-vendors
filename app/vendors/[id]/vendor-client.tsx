"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Vendor = {
  id: string;
  business_name: string;
  bio: string | null;
  city: string;
  state_province: string;
  starting_price?: number | null;
};

type Review = {
  id: string;
  name: string;
  rating: number;
  review: string;
  created_at: string;
};

type Photo = {
  id: string;
  storage_path: string;
  is_cover: boolean;
};

export default function VendorClient({
  vendor,
  reviews: initialReviews,
  photos,
  vendorId,
}: {
  vendor: Vendor | null;
  reviews: Review[];
  photos: Photo[];
  vendorId: string;
}) {
  const supabase = createClient();

  const [reviews, setReviews] = useState(initialReviews);

  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    review: "",
  });

  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  });

  const [formLoadedAt] = useState(Date.now());

  const getPhotoUrl = (path: string) => {
    const { data } = supabase.storage
      .from("vendor-images")
      .getPublicUrl(path);

    return data.publicUrl;
  };

  if (!vendor) {
    return <div className="p-16 text-center">Vendor not found.</div>;
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : null;

  const submitReview = async (e: any) => {
    e.preventDefault();

    const { data } = await supabase
      .from("reviews")
      .insert({
        vendor_id: vendorId,
        ...reviewForm,
      })
      .select()
      .single();

    if (data) {
      setReviews([data, ...reviews]);
    }

    setReviewForm({
      name: "",
      rating: 5,
      review: "",
    });
  };

  const submitInquiry = async (e: any) => {
    e.preventDefault();

    if (inquiryForm.company) return;
    if (Date.now() - formLoadedAt < 3000) return;

    await supabase.from("inquiries").insert({
      vendor_id: vendorId,
      name: inquiryForm.name,
      email: inquiryForm.email,
      message: inquiryForm.message,
    });

    alert("Inquiry sent!");

    setInquiryForm({
      name: "",
      email: "",
      message: "",
      company: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] text-neutral-900">
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-16">

        {/* HEADER */}
        <div className="space-y-4">
          <h1 className="text-5xl font-serif">{vendor.business_name}</h1>

          <p className="text-neutral-600 text-lg">
            {vendor.city}, {vendor.state_province}
          </p>

          {vendor.starting_price && (
            <p className="text-xl font-medium">
              Starting at ${vendor.starting_price.toLocaleString()}
            </p>
          )}

          {averageRating && (
            <p className="text-lg">
              ⭐ {averageRating} ({reviews.length} reviews)
            </p>
          )}
        </div>

        {/* PHOTO GALLERY */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <img
                key={photo.id}
                src={getPhotoUrl(photo.storage_path)}
                className="w-full h-64 object-cover rounded-2xl"
                alt="Vendor photo"
              />
            ))}
          </div>
        )}

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-12">

          {/* LEFT COLUMN */}
          <div className="md:col-span-2 space-y-12">

            {/* ABOUT */}
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <h2 className="text-2xl font-semibold mb-4">About</h2>

              <p className="text-neutral-700">
                {vendor.bio || "Vendor description coming soon."}
              </p>
            </div>

            {/* REVIEWS */}
            <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6">
              <h2 className="text-2xl font-semibold">Reviews</h2>

              {reviews.length === 0 && (
                <p className="text-neutral-500">No reviews yet.</p>
              )}

              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <p className="font-semibold">
                    {review.name} — ⭐ {review.rating}
                  </p>

                  <p className="text-neutral-700 mt-1">
                    {review.review}
                  </p>
                </div>
              ))}
            </div>

            {/* ADD REVIEW */}
            <div className="bg-white p-8 rounded-3xl shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">
                Leave a Review
              </h2>

              <form onSubmit={submitReview} className="space-y-4">

                <input
                  required
                  placeholder="Your Name"
                  className="w-full border rounded-xl px-4 py-2"
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      name: e.target.value,
                    })
                  }
                />

                <select
                  className="w-full border rounded-xl px-4 py-2"
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      rating: Number(e.target.value),
                    })
                  }
                >
                  {[5,4,3,2,1].map((r) => (
                    <option key={r} value={r}>
                      {r} Stars
                    </option>
                  ))}
                </select>

                <textarea
                  required
                  placeholder="Write your review..."
                  className="w-full border rounded-xl px-4 py-2"
                  rows={4}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      review: e.target.value,
                    })
                  }
                />

                <button className="bg-black text-white px-6 py-2 rounded-xl">
                  Submit Review
                </button>

              </form>

            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="bg-white p-8 rounded-3xl shadow-sm h-fit">

            <h2 className="text-2xl font-semibold mb-6">
              Ask About Availability
            </h2>

            <form onSubmit={submitInquiry} className="space-y-4">

              <input
                required
                placeholder="Your Name"
                className="w-full border rounded-xl px-4 py-2"
                onChange={(e) =>
                  setInquiryForm({
                    ...inquiryForm,
                    name: e.target.value,
                  })
                }
              />

              <input
                required
                type="email"
                placeholder="Email"
                className="w-full border rounded-xl px-4 py-2"
                onChange={(e) =>
                  setInquiryForm({
                    ...inquiryForm,
                    email: e.target.value,
                  })
                }
              />

              <textarea
                required
                placeholder="Your message..."
                className="w-full border rounded-xl px-4 py-2"
                rows={4}
                onChange={(e) =>
                  setInquiryForm({
                    ...inquiryForm,
                    message: e.target.value,
                  })
                }
              />

              {/* Honeypot anti-spam */}
              <input
                type="text"
                style={{ display: "none" }}
                onChange={(e) =>
                  setInquiryForm({
                    ...inquiryForm,
                    company: e.target.value,
                  })
                }
              />

              <button className="w-full bg-black text-white px-6 py-2 rounded-xl">
                Send Inquiry
              </button>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}