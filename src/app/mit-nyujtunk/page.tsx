import type { Metadata } from "next";
import Placeholder from "../components/Placeholder";

export const metadata: Metadata = {
  title: "Mit nyújtunk? — LineiQ",
  description:
    "A LineiQ szolgáltatási modellje: setup fázis és retainer fázis. Egy csomag, egy folyamat, hat hónap minimum.",
};

export default function MitNyujtunkPage() {
  return (
    <main>
      <Placeholder
        label="◆ Szolgáltatás"
        title={
          <>
            Nem lista.
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>Folyamat.</em>
          </>
        }
        signature="how we work."
        lede="A LineiQ egyetlen csomagot kínál: setup fázis egyszer, utána retainer minimum hat hónapra. Itt mutatjuk meg, mit jelent ez a gyakorlatban, és miért működik."
        nextStep="A fázisok részletes leírása készül."
      />
    </main>
  );
}
