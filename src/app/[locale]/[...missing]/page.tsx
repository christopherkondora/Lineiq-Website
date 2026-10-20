import { notFound } from "next/navigation";

// Any address under a locale that matches no page. Without this, an unknown
// path would fall through to Next's bare global 404, outside the root layout:
// no <html lang>, no fonts, no navbar. Here the 404 renders inside the
// locale's own document, as it did before the [locale] segment.
export default function Missing() {
  notFound();
}
