import { Suspense } from "react";
import VendorsListClient from "./vendors-list-client";

export default function VendorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f5f3ef] text-sm text-neutral-500">
          Loading vendors…
        </div>
      }
    >
      <VendorsListClient />
    </Suspense>
  );
}
