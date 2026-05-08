import { NemovitostDetailClient } from "@/components/NemovitostDetailClient";

export default async function NemovitostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <NemovitostDetailClient slug={slug} />;
}
