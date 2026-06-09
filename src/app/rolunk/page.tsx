import type { Metadata } from "next";
import RolunkIntro from "../components/RolunkIntro";
import RolunkCulture from "../components/RolunkCulture";
import RolunkFounders from "../components/RolunkFounders";
import RolunkMentors from "../components/RolunkMentors";
import BookshelfSection from "../components/BookshelfSection";
import RolunkClose from "../components/RolunkClose";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Rólunk — LineiQ",
  description:
    "Kondora Kristóf és Sütő Áron társalapítók. A LineiQ kultúrája, elvei és az emberek, akikre felnézünk.",
};

export default function RolunkPage() {
  return (
    <main>
      <RolunkIntro />
      <RolunkCulture />
      <RolunkFounders />
      <RolunkMentors />
      <BookshelfSection />
      <RolunkClose />
      <Footer />
    </main>
  );
}
