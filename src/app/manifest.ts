import type { MetadataRoute } from "next";

// What an Android launcher or Chrome's "install" reads: the name and the icons.
// No description here: it would be one more string to translate, and a manifest
// has one address for all three languages. Icons are built by
// scripts/make-icons.mjs; the maskable one keeps the mark inside the circle a
// launcher crops to.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LineiQ",
    short_name: "LineiQ",
    start_url: "/",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
