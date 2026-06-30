import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // A /mit-nyujtunk hub 2026-06-06-án törölve, a főoldali horgony váltotta.
      {
        source: "/mit-nyujtunk",
        destination: "/#szolgaltatasok",
        permanent: true,
      },
      // A "Web & telefonos alkalmazások" kategória kettévált; a régi slug a
      // szoftveres oldalra mutat.
      {
        source: "/mit-nyujtunk/web-es-mobil-alkalmazasok",
        destination: "/mit-nyujtunk/szoftveres-megoldasok",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
