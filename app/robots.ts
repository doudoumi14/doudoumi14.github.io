import type { MetadataRoute } from "next";

import { SITE_URL } from "@/data/site";

// `output: "export"` refuses to build a route handler that has not opted into
// being fully static, and this one has nothing request-time in it.
export const dynamic = "force-static";

// Cloudflare injects its own robots.txt when the origin serves none; shipping
// one in the build replaces it and, more importantly, points crawlers at the
// sitemap on the canonical host.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
