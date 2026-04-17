import VendorClient from "./vendor-client"
import { createClient } from "@/lib/supabase/server"

export default async function VendorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()

  // Get vendor
  const { data: vendor } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  // Get reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("vendor_id", id)
    .order("created_at", { ascending: false })

  // Get photos
  const { data: photos } = await supabase
    .from("vendor_photos")
    .select("*")
    .eq("vendor_id", id)
    .order("sort_order", { ascending: true })

  return (
    <VendorClient
      vendor={vendor}
      reviews={reviews ?? []}
      photos={photos ?? []}
      vendorId={id}
    />
  )
}