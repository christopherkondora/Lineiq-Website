import type { Metadata } from "next";
import Placeholder from "../components/Placeholder";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Work — LineiQ",
  description:
    "Selected case studies from the LineiQ portfolio. Brand, web, marketing.",
};

export default function MunkainkPage() {
  return (
    <main>
      <Placeholder
        label="◆ Portfolio"
        title={
          <>
            The work we
            <br />
            <em style={{ fontStyle: "italic", fontWeight: 400 }}>
              put our name on.
            </em>
          </>
        }
        signature="proof."
        lede="Detailed case studies on brand, web and marketing projects. Each piece is its own entry: scope, process, visuals, results. The page is coming soon."
        nextStep="Case study content is being added."
      />
      <Footer />
    </main>
  );
}
