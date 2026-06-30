import type { Metadata } from "next";
import Footer from "../components/Footer";
import IntakeFlow from "./IntakeFlow";

export const metadata: Metadata = {
  title: "Contact — LineiQ",
  description:
    "A curated intake flow: four short questions, and we arrive at the first call already knowing your company.",
};

export default function KapcsolatPage() {
  return (
    <main>
      <IntakeFlow />
      <Footer />
    </main>
  );
}
