"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin/applications");
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10 space-y-4">
          <p className="uppercase tracking-[0.4em] text-xs text-neutral-500 dark:text-neutral-400">
            Admin Access
          </p>

          <h1 className="text-4xl font-serif leading-tight">
            Welcome Back.
          </h1>

          <p className="text-neutral-600 dark:text-neutral-300 text-sm">
            Sign in to manage vendor applications and approvals.
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-10 space-y-6 shadow-sm"
        >

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg uppercase tracking-wide text-sm hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

      </div>

    </main>
  );
}
