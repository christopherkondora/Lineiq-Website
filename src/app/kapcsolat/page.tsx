import type { Metadata } from "next";
import Placeholder from "../components/Placeholder";

export const metadata: Metadata = {
  title: "Kapcsolat — LineiQ",
  description:
    "Kapcsolatfelvétel a LineiQ-val. Lépéses intake folyamat — nem generikus űrlap.",
};

export default function KapcsolatPage() {
  return (
    <main>
      <Placeholder
        label="◆ Kapcsolat"
        title={
          <>
            Beszéljünk
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>
              komolyan.
            </em>
          </>
        }
        signature="say hi."
        lede="Lépéses intake folyamat, nem generikus űrlap. Cégnév kötelező, a többi kérdés a projekted alakja szerint. A folyamat végén megerősítő oldal és válaszidő."
        nextStep="Az intake form mezőinek véglegesítése Áronnal folyamatban."
      />
    </main>
  );
}
