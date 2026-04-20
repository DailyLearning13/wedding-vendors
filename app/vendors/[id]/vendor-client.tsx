"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function getCategoryStyle(category: string | null) {
  switch (category) {
    case "DJ":
    case "DJ / Music":
    case "Live Music":
      return "bg-purple-100 text-purple-800 ring-1 ring-purple-200/80";
    case "Tent":
      return "bg-teal-100 text-teal-900 ring-1 ring-teal-200/80";
    case "Photographer":
      return "bg-blue-100 text-blue-800 ring-1 ring-blue-200/80";
    case "Videographer":
      return "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200/80";
    case "Makeup":
      return "bg-rose-100 text-rose-800 ring-1 ring-rose-200/80";
    case "Hair":
      return "bg-yellow-100 text-yellow-900 ring-1 ring-yellow-200/80";
    case "Decor":
      return "bg-green-100 text-green-800 ring-1 ring-green-200/80";
    case "Venue":
      return "bg-gray-200 text-gray-900 ring-1 ring-gray-300/80";
    case "Catering":
      return "bg-orange-100 text-orange-800 ring-1 ring-orange-200/80";
    default:
      return "bg-neutral-100 text-neutral-800 ring-1 ring-neutral-200/80";
  }
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= rating ? "text-amber-500" : "text-neutral-200"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

type Vendor = {
  id: string;
  business_name: string;
  bio: string | null;
  city: string;
  state_province: string;
  starting_price?: number | null;
  category?: string | null;
  is_featured?: boolean | null;
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

const inputClass =
  "w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm transition focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/25";

const labelClass =
  "block text-xs font-medium uppercase tracking-[0.12em] text-neutral-500";

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
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-[#f8f6f2] px-6 text-neutral-900">
        <p className="text-lg font-medium">Vendor not found.</p>
        <Link
          href="/vendors"
          className="border-b border-amber-800/40 pb-1 text-sm uppercase tracking-[0.2em] text-amber-800 transition hover:border-amber-800"
        >
          Back to vendors
        </Link>
      </div>
    );
  }

  const sortedPhotos = [...photos].sort(
    (a, b) => Number(b.is_cover) - Number(a.is_cover)
  );
  const heroPhoto = sortedPhotos[0];
  const galleryRest = sortedPhotos.slice(1);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  const submitReview = async (e: FormEvent) => {
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

  const submitInquiry = async (e: FormEvent) => {
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
      <div className="relative min-h-[min(52vh,420px)] border-b border-neutral-200/80 bg-neutral-900">
        {heroPhoto ? (
          <img
            src={getPhotoUrl(heroPhoto.storage_path)}
            alt={`${vendor.business_name} — cover photo`}
            className="h-[min(52vh,420px)] w-full object-cover"
          />
        ) : (
          <div className="h-[min(40vh,320px)] w-full bg-gradient-to-br from-neutral-800 via-neutral-900 to-black" />
        )}

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25"
          aria-hidden
        />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-6xl px-6 pb-10 pt-24 md:pb-12">
            <Link
              href="/vendors"
              className="mb-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/80 transition hover:text-white"
            >
              <span aria-hidden>←</span> Vendors
            </Link>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              {vendor.is_featured && (
                <span className="inline-flex items-center rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm">
                  ★ Featured
                </span>
              )}
              {vendor.category && (
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getCategoryStyle(vendor.category)}`}
                >
                  {vendor.category}
                </span>
              )}
            </div>

            <h1 className="font-serif text-4xl tracking-tight text-white md:text-5xl md:leading-[1.1]">
              {vendor.business_name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/85">
              <span>
                {vendor.city}, {vendor.state_province}
              </span>
              {vendor.starting_price != null && vendor.starting_price > 0 && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-white backdrop-blur-sm">
                  From ${vendor.starting_price.toLocaleString()}
                </span>
              )}
              {averageRating && (
                <span className="inline-flex items-center gap-2">
                  <StarRow rating={Math.round(Number(averageRating))} />
                  <span className="text-white/90">
                    {averageRating}{" "}
                    <span className="text-white/65">
                      ({reviews.length}{" "}
                      {reviews.length === 1 ? "review" : "reviews"})
                    </span>
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {galleryRest.length > 0 && (
          <div className="mb-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {galleryRest.map((photo) => (
              <div
                key={photo.id}
                className="group overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm ring-1 ring-black/5"
              >
                <img
                  src={getPhotoUrl(photo.storage_path)}
                  className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  alt=""
                />
              </div>
            ))}
          </div>
        )}

        {photos.length === 0 && (
          <div className="mb-12 rounded-2xl border border-dashed border-neutral-300 bg-white/60 px-6 py-12 text-center text-neutral-500">
            <p className="text-sm">Photos coming soon.</p>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-10 lg:col-span-8">
            <section className="rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-sm ring-1 ring-black/[0.03]">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
                About
              </p>
              <h2 className="mt-2 font-serif text-2xl text-neutral-900">
                Meet {vendor.business_name}
              </h2>
              <p className="mt-4 leading-relaxed text-neutral-700">
                {vendor.bio ||
                  "We’re preparing a full profile for this vendor. Check back soon or send a message to learn more."}
              </p>
            </section>

            <section className="rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-sm ring-1 ring-black/[0.03]">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
                    Reviews
                  </p>
                  <h2 className="mt-2 font-serif text-2xl text-neutral-900">
                    What couples say
                  </h2>
                </div>
                {averageRating && (
                  <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm">
                    <span className="text-lg font-semibold text-neutral-900">
                      {averageRating}
                    </span>
                    <StarRow rating={Math.round(Number(averageRating))} />
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <p className="mt-6 text-neutral-500">
                  No reviews yet — be the first to share your experience.
                </p>
              ) : (
                <ul className="mt-8 space-y-4">
                  {reviews.map((review) => (
                    <li
                      key={review.id}
                      className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-5"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="font-semibold text-neutral-900">
                          {review.name}
                        </p>
                        <time
                          className="text-xs text-neutral-500"
                          dateTime={review.created_at}
                        >
                          {new Date(review.created_at).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </time>
                      </div>
                      <div className="mt-2">
                        <StarRow rating={review.rating} />
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-neutral-700">
                        {review.review}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-sm ring-1 ring-black/[0.03]">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
                Share feedback
              </p>
              <h2 className="mt-2 font-serif text-2xl text-neutral-900">
                Leave a review
              </h2>

              <form onSubmit={submitReview} className="mt-8 space-y-5">
                <div>
                  <label className={labelClass} htmlFor="review-name">
                    Your name
                  </label>
                  <input
                    id="review-name"
                    required
                    placeholder="Name"
                    className={`${inputClass} mt-2`}
                    value={reviewForm.name}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="review-rating">
                    Rating
                  </label>
                  <select
                    id="review-rating"
                    className={`${inputClass} mt-2`}
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        rating: Number(e.target.value),
                      })
                    }
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} stars
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="review-body">
                    Review
                  </label>
                  <textarea
                    id="review-body"
                    required
                    placeholder="Tell others about your experience..."
                    className={`${inputClass} mt-2 min-h-[120px] resize-y`}
                    rows={4}
                    value={reviewForm.review}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        review: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-neutral-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800"
                >
                  Submit review
                </button>
              </form>
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-2xl border border-neutral-200/90 bg-white p-8 shadow-sm ring-1 ring-black/[0.03]">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
                Get in touch
              </p>
              <h2 className="mt-2 font-serif text-xl text-neutral-900">
                Ask about availability
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                Share your date and vision — we’ll route your note to this
                vendor.
              </p>

              <form onSubmit={submitInquiry} className="mt-8 space-y-5">
                <div>
                  <label className={labelClass} htmlFor="inquiry-name">
                    Name
                  </label>
                  <input
                    id="inquiry-name"
                    required
                    placeholder="Your name"
                    className={`${inputClass} mt-2`}
                    value={inquiryForm.name}
                    onChange={(e) =>
                      setInquiryForm({
                        ...inquiryForm,
                        name: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="inquiry-email">
                    Email
                  </label>
                  <input
                    id="inquiry-email"
                    required
                    type="email"
                    placeholder="you@example.com"
                    className={`${inputClass} mt-2`}
                    value={inquiryForm.email}
                    onChange={(e) =>
                      setInquiryForm({
                        ...inquiryForm,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="inquiry-message">
                    Message
                  </label>
                  <textarea
                    id="inquiry-message"
                    required
                    placeholder="Wedding date, venue, questions..."
                    className={`${inputClass} mt-2 min-h-[120px] resize-y`}
                    rows={4}
                    value={inquiryForm.message}
                    onChange={(e) =>
                      setInquiryForm({
                        ...inquiryForm,
                        message: e.target.value,
                      })
                    }
                  />
                </div>

                <input
                  type="text"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  onChange={(e) =>
                    setInquiryForm({
                      ...inquiryForm,
                      company: e.target.value,
                    })
                  }
                />

                <button
                  type="submit"
                  className="w-full rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
                >
                  Send inquiry
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
