import type { Metadata } from "next";
import Footer from "../components/Footer";
import ContactScreen from "./ContactScreen";

export const metadata: Metadata = {
  title: "Contact — LineiQ",
  description:
    "One screen, one question. Tell us what you are building and we will tell you straight whether we are the studio for it.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactScreen />
      <Footer />
    </main>
  );
}
