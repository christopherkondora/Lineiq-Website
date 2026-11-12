import styles from "./AboutInterlude.module.css";

// The page's one photograph, and the opener of the Beliefs section: a full
// screen, edge to edge, with "What we believe" set close under it. The three
// black text screens above (AboutHero, AboutOrigin, AboutCompounds) are all
// speech, and "compounds" is the thesis; this is the room the beliefs are held
// in. An empty loft at first light, two chairs facing each other across a
// table: the two founders without pretending to show them (their portraits
// wait for a real shoot, About → founders).
//
// A second photograph under the heading, a plumb line, was tried on
// 2026-11-11 and cut: nothing in the copy pointed to it.
//
// Decorative, so the alt is empty. Prompt log: public/about/origin-wide.log.
export default function AboutInterlude() {
  return (
    <figure className={styles.interlude} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.img}
        src="/about/origin-wide.webp"
        alt=""
        width={2400}
        height={1350}
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}
