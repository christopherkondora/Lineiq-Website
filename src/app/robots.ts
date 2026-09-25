import type { MetadataRoute } from "next";
import { PRIVATE_ROUTES, SITE_INDEXABLE, SITE_URL } from "./data/site";

// Pair to the `robots` field in layout.tsx: robots.txt stops the crawl, the
// meta tag stops the indexing. Two mechanisms because they fail differently —
// a disallowed URL can still be indexed URL-only if something links to it,
// and a bot that ignores robots.txt still reads the meta tag.
export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: PRIVATE_ROUTES },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
