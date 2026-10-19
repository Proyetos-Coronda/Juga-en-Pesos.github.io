import type { MetadataRoute } from "next";
import { getGames } from "@/lib/games";
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site, changeFrequency: "hourly", priority: 1 }, ...getGames().map((g) => ({ url: `${site}/juego/${g.id}`, changeFrequency: "daily" as const }))];
}
