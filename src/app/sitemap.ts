import type { MetadataRoute } from "next";
import { sitemapEntries, visitorPaths } from "./i18n/seo";

// Every visitor page in every language, each with its hreflang set. Served
// during the blackout too: robots.txt disallows the whole host until
// SITE_INDEXABLE flips, and only then names this file. See [[i18n/seo]].
export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(visitorPaths());
}
