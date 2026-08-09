"use client";

import { useCallback, useEffect, useState } from "react";
import Preloader from "./Preloader";

// A betöltési gesztus bekötése a főoldalra. Csak itt van mountolva: a mély
// linkek (kapcsolat, munkák, egy szolgáltatás) szándékot hordoznak, ceremónia
// nem állhat eléjük — és így egyetlen mount-pont van, nem egy layout-szintű
// mechanizmus, ami más útvonalakon is beleszól az oldalba.
//
// A sorrend szándékos:
//   1. a szerver mindig kiszolgálja a fedő markupját (az első festés így már
//      helyes, nem kell megvárni a hidratálást),
//   2. a CSS alapból elrejti,
//   3. a főoldalra szűkített inline script még festés előtt eldönti, hogy
//      egyáltalán kell-e — és csak ekkor mutatja meg.
// Sosem fordítva: ha a script elszáll, az animáció vész el, nem az oldal.

export const INTRO_SESSION_KEY = "lineiq-intro";

/** Ha a React soha nem indul el, a fedő ne maradjon örökre az oldalon. Bőven
 *  a leghosszabb lehetséges gesztus (kapu-cap + timeline) fölött van. */
const FAILSAFE_MS = 8000;

// Két, EGYMÁSTÓL FÜGGETLEN döntés, mindkettő még az első festés előtt:
//
//   data-enter — engedélyezett-e a mozgás. Ha igen, a hero belépőjének
//     kiinduló állapotát a CSS adja, MÁR AZ ELSŐ FESTÉSTŐL. Enélkül a rejtést
//     csak a GSAP tette fel a timeline felépítésekor, ami hidratálás után fut:
//     mobilon ~1.3 másodpercig a hero a VÉGÁLLAPOTÁBAN állt, majd visszaugrott
//     és elindult a belépő. A betöltési gesztus ezt eltakarta — de az csak a
//     session ELSŐ oldalbetöltésén fut, minden továbbin látszott a villanás.
//
//   data-intro — kell-e a betöltési gesztus (session első látogatása).
//
// A kettő szétválasztása a lényeg: a belépő minden betöltéskor fut, a gesztus
// csak egyszer. Mindkettőnek saját biztosítéka van arra az esetre, ha a React
// el sem indulna.
export const introGateScript = `try{var d=document.documentElement;if(!matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute("data-enter","");setTimeout(function(){d.removeAttribute("data-enter")},${FAILSAFE_MS});if(!sessionStorage.getItem("${INTRO_SESSION_KEY}")){d.setAttribute("data-intro","");setTimeout(function(){d.removeAttribute("data-intro")},${FAILSAFE_MS})}}}catch(e){}`;

export default function HomeIntro() {
  // Egyszeri leolvasás renderben, nem effektben: az attribútum már a hidratálás
  // előtt ott van, és csak MI vesszük le. Így nem kell setState egy effektből,
  // és a döntés nem tud menet közben visszabillenni, amikor az attribútum
  // eltűnik. A markupra nincs hatása — a szerver és a kliens ugyanazt a DOM-ot
  // rajzolja, az `enabled` csak azt szabja meg, dolgozik-e a komponens.
  const [running] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.hasAttribute("data-intro")
  );
  const [done, setDone] = useState(false);

  // Bármi okból tűnik el a komponens — kliensoldali navigáció a gesztus
  // közben, hibahatár, unmount —, a scroll-zár vele együtt megy. A zárat a
  // CSS az attribútumra köti, tehát az attribútum levétele a feloldás.
  useEffect(
    () => () => document.documentElement.removeAttribute("data-intro"),
    []
  );

  // A fedő távozni kezd: a hero belépője már indulhat alatta.
  const handleExitStart = useCallback(() => {
    document.documentElement.removeAttribute("data-intro");
    window.dispatchEvent(new Event("lineiq:intro-done"));
  }, []);

  const handleDone = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    } catch {
      // privát mód — legfeljebb újra lejátszik
    }
    // reduced-motion esetén az onExitStart nem fut le, ezért a jelzés itt is
    // kimegy; az esemény kétszer is ártalmatlan (a Hero egyszer figyel rá).
    document.documentElement.removeAttribute("data-intro");
    window.dispatchEvent(new Event("lineiq:intro-done"));
    setDone(true);
  }, []);

  // Ismételt látogatáskor a markup bent marad, de a CSS rejti és a komponens
  // nem csinál semmit (enabled=false). Kivenni nem érdemes: a HTML-ben amúgy is
  // ott van, és így a szerver–kliens kimenet szó szerint azonos.
  if (done) return null;

  return (
    <Preloader
      live
      enabled={running}
      onExitStart={handleExitStart}
      onDone={handleDone}
    />
  );
}
