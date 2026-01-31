export const dynamic = "force-dynamic";

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

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is missing on the server.`);
  return v;
}

async function fetchVendors(category?: string): Promise<Vendor[]> {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anon = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  const endpoint = new URL(`${url}/rest/v1/vendors`);

  // PostgREST query params
  endpoint.searchParams.set(
    "select",
    "id,business_name,categories,city,state_province,country,starting_price,currency,is_verified,created_at"
  );
  endpoint.searchParams.set("is_approved", "eq.true");
  endpoint.searchParams.set("order", "is_verified.desc,created_at.desc");

  // Category filter (categories is a text[] in Postgres)
  // Uses PostgREST "contains" operator for arrays: cs.{value}
  if (category && category !== "All") {
    endpoint.searchParams.set("categories", `cs.{${category}}`);
  }

  const res = await fetch(endpoint.toString(), {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase fetch failed (${res.status}): ${text}`);
  }

  return (await res.json()) as Vendor[];
}

const CATEGORY_OPTIONS = [
  "All",
  "DJ/MC",
  "Decor",
  "Photo/Video",
  "Dhol",
  "Makeup/Hair",
  "Venue",
  "Catering",
  "Priest/Granthi",
];

export default async function VendorsPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const selectedCategory = (searchParams?.category ?? "All").trim() || "All";
  const vendors = await fetchVendors(selectedCategory);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Vendors</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Filter by category to narrow results.
          </p>
        </div>

        <a href="/" className="text-sm underline">
          Back home
        </a>
      </div>

      {/* Category Filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORY_OPTIONS.map((c) => {
          const isActive = c === selectedCategory;
          const href = c === "All" ? "/vendors" : `/vendors?category=${encodeURIComponent(c)}`;

          return (
            <a
              key={c}
              href={href}
              className={
                isActive
                  ? "rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white"
                  : "rounded-full border bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
              }
            >
              {c}
            </a>
          );
        })}
      </div>

      {/* Results */}
      {vendors.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-white p-6">
          <div className="text-sm font-medium">No vendors found</div>
          <div className="mt-1 text-sm text-zinc-600">
            Try a different category.
          </div>
        </div>
      ) : (
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
                {(v.categories ?? []).map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-zinc-100 px-2 py-1 text-xs"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <p className="mt-3 text-sm">
                {v.starting_price != null
                  ? `Starting at ${v.currency} ${v.starting_price}`
                  : "Price not listed"}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
