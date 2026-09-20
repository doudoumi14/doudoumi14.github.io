import type { MetadataRoute } from "next";

import { SITE_URL } from "@/data/site";

// See app/robots.ts: a static export needs route handlers pinned to static.
export const dynamic = "force-static";

// Single-page site: one entry. Its point is to give Search Console an explicit
// list of the URLs worth indexing, so the canonical host is the one crawled.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
