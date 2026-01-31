export default function Home() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="font-semibold tracking-tight">
            Wedding Vendors
          </div>
          <nav className="flex items-center gap-4 text-sm text-zinc-600">
            <a href="#categories" className="hover:text-zinc-900">
              Categories
            </a>
            <a href="#how" className="hover:text-zinc-900">
              How it works
            </a>
            <a href="/vendors" className="hover:text-zinc-900">
              Vendors
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-3xl border bg-zinc-50 p-10 shadow-sm">
          <h1 className="text-4xl font-semibold tracking-tight">
            Find trusted Punjabi wedding vendors — fast.
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-zinc-600">
            Search DJs, decor, venues, photo/video, makeup, dhol, and more.
            Built for the East Coast — expanding across the US & Canada.
          </p>

          {/* Search UI (placeholder) */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="text-sm text-zinc-600">Search</label>
              <input
                className="mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-900/10"
                placeholder="Try: DJ, Decor, Photographer…"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-600">Location</label>
              <select className="mt-2 w-full rounded-xl border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-zinc-900/10">
                <option>New Jersey</option>
                <option>New York</option>
                <option>Pennsylvania</option>
                <option>Virginia</option>
                <option>Massachusetts</option>
                <option>Ontario</option>
              </select>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/vendors"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Browse vendors
            </a>

            <a
              href="/vendor"
              className="inline-flex items-center justify-center rounded-xl border bg-white px-5 py-3 text-sm font-medium hover:bg-zinc-50"
            >
              I’m a vendor
            </a>
          </div>

          {/* Value props */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border bg-white p-5">
              <div className="text-sm font-medium">Verified listings</div>
              <div className="mt-1 text-sm text-zinc-600">
                Cleaner results, fewer scams, better leads.
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <div className="text-sm font-medium">Fast shortlists</div>
              <div className="mt-1 text-sm text-zinc-600">
                Save, compare, and message vendors easily.
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-5">
              <div className="text-sm font-medium">
                Built for Punjabi weddings
              </div>
              <div className="mt-1 text-sm text-zinc-600">
                Categories and needs that actually match your events.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-5xl px-6 pb-10">
        <h2 className="text-xl font-semibold tracking-tight">
          Popular categories
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            "DJ / MC",
            "Decor",
            "Venue",
            "Photo / Video",
            "Makeup / Hair",
            "Dhol / Live Music",
          ].map((c) => (
            <div
              key={c}
              className="rounded-2xl border bg-white p-5 text-sm font-medium hover:bg-zinc-50"
            >
              {c}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-xl font-semibold tracking-tight">
          How it works
        </h2>

        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          <li className="rounded-2xl border bg-white p-5">
            <div className="text-sm font-medium">1) Search</div>
            <div className="mt-1 text-sm text-zinc-600">
              Filter by category, city, and budget.
            </div>
          </li>

          <li className="rounded-2xl border bg-white p-5">
            <div className="text-sm font-medium">2) Shortlist</div>
            <div className="mt-1 text-sm text-zinc-600">
              Save vendors and compare packages.
            </div>
          </li>

          <li className="rounded-2xl border bg-white p-5">
            <div className="text-sm font-medium">3) Book</div>
            <div className="mt-1 text-sm text-zinc-600">
              Message directly and lock the date.
            </div>
          </li>
        </ol>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-zinc-600">
          © {new Date().getFullYear()} Wedding Vendors · Built with Next.js
        </div>
      </footer>
    </main>
  );
}
