import type { Metadata } from "next";
import Placeholder from "../components/Placeholder";

export const metadata: Metadata = {
  title: "Munkáink — LineiQ",
  description:
    "Kiválasztott case study-k a LineiQ portfólióból. Brand, web, marketing.",
};

export default function MunkainkPage() {
  return (
    <main>
      <Placeholder
        label="◆ Portfólió"
        title={
          <>
            A munka, amire
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>
              ráírjuk a nevünk.
            </em>
          </>
        }
        signature="proof."
        lede="Részletes case study-k brand, web és marketing projektekről. Minden munka önálló entry: scope, folyamat, vizuális anyag, eredmény. Az oldal hamarosan."
        nextStep="Case study-k tartalmi feltöltése folyamatban."
      />
    </main>
  );
}
