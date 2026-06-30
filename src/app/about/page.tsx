import type { Metadata } from "next";
import RolunkCulture from "../components/RolunkCulture";
import RolunkFounders from "../components/RolunkFounders";
import RolunkMentors from "../components/RolunkMentors";
import BookshelfSection from "../components/BookshelfSection";
import RolunkClose from "../components/RolunkClose";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "About — LineiQ",
  description:
    "Co-founders Kondora Kristóf and Sütő Áron. LineiQ's culture, principles, and the people we look up to.",
};

export default function RolunkPage() {
  return (
    <main>
      <RolunkCulture />
      <RolunkFounders />
      <RolunkMentors />
      <BookshelfSection />
      <RolunkClose />
      <Footer />
    </main>
  );
}
