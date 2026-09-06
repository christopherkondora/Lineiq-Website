import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Csak a dev szerverre vonatkozik. A Next 16 alapból BLOKKOLJA a /_next/*
  // dev-erőforrásokat, ha a kérés nem localhostról érkezik — telefonos teszthez
  // (LAN-IP vagy ngrok-tunnel) viszont pont nem localhost a host. A JS chunkok
  // ilyenkor 200-zal le is jönnek, de a HMR websocket 403-at kap, a React nem
  // hidratál, és az egész animációs réteg (GSAP, ScrollTrigger, Lenis, preloader)
  // néma marad: az oldal statikus lapnak látszik. Ezek a minták engedik át a
  // telefonos teszt-originokat. Produkcióban nincs hatása.
  allowedDevOrigins: [
    // A böngésző-vezérelt tesztek (Playwright) alapból 127.0.0.1-re mennek, és
    // a Next CSAK a "localhost" nevet engedi implicit — a numerikus alak
    // ugyanúgy blokkolódik, mint egy LAN-IP, vagyis a headless futás egy nem
    // hidratált oldalt mér.
    "127.0.0.1",
    "10.68.*.*",
    "192.168.*.*",
    "172.16.*.*",
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.ngrok.app",
    "*.ngrok.io",
    "*.trycloudflare.com",
  ],
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
