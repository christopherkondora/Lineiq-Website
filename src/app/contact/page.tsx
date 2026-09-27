import type { Metadata } from "next";
import ContactFlow from "./ContactFlow";

export const metadata: Metadata = {
  title: "Contact — LineiQ",
  description:
    "Five questions, mostly answered by clicking. Tell us where you are and we will tell you straight whether we are the studio for it.",
};

// No footer. The flow owns the viewport and nothing on this route scrolls, so
// anything under the fold would be a second page the wheel has to fight the
// camera to reach. The footer comes back with the confirmation, where leaving
// is the point. See [[contact/ContactFlow]].
export default function ContactPage() {
  return (
    <main>
      <ContactFlow />
    </main>
  );
}
