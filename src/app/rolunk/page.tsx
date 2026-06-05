import type { Metadata } from "next";
import Placeholder from "../components/Placeholder";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Rólunk — LineiQ",
  description:
    "Kondora Kristóf és Sütő Áron társalapítók. A LineiQ elvei és az emberek, akikre felnézünk.",
};

export default function RolunkPage() {
  return (
    <main>
      <Placeholder
        label="◆ Csapat"
        title={
          <>
            Két alapító,
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>
              egy hang.
            </em>
          </>
        }
        signature="us."
        lede="Kondora Kristóf és Sütő Áron társalapítók. Innen jönnek az elveink, és innen jönnek azok a gondolkodók, akikre felnézünk."
        nextStep="Bemutatkozók, elveink és az 'Akikre felnézünk' szekció készül."
      />
      <Footer />
    </main>
  );
}
