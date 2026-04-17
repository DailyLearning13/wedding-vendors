import { Suspense } from "react";
import VendorsListClient from "./vendors-list-client";

export default function VendorsPage() {
  return (
    <main className="min-h-screen bg-[#07070A] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold mb-6">Vendors</h1>

        <Suspense fallback={<div>Loading vendors...</div>}>
          <VendorsListClient />
        </Suspense>
      </div>
    </main>
  );
}