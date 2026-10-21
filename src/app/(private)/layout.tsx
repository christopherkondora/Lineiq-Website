import RootDocument, { rootMetadata } from "../components/RootDocument";

// Root layout of the working routes (/styleguide). They sit
// outside the [locale] segment: one address each, English, never indexed.
export const metadata = rootMetadata;

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
