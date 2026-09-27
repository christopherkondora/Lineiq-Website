import type { Metadata } from "next";
import Footer from "../components/Footer";
import ContactScreen from "./ContactScreen";

export const metadata: Metadata = {
  title: "Contact — LineiQ",
  description:
    "Five questions, mostly answered by clicking. Tell us where you are and we will tell you straight whether we are the studio for it.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactScreen />
      <Footer />
    </main>
  );
}
