import type { Metadata } from "next";
import Footer from "../components/Footer";
import IntakeFlow from "./IntakeFlow";

export const metadata: Metadata = {
  title: "Kapcsolat — LineiQ",
  description:
    "Kurált intake folyamat: öt rövid kérdés, és úgy érkezünk az első hívásra, hogy már ismerjük a cégedet.",
};

export default function KapcsolatPage() {
  return (
    <main>
      <IntakeFlow />
      <Footer />
    </main>
  );
}
