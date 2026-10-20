// The 404 inside the locale's document. The root layout sits under the
// [locale] segment, so Next's automatic 404 would render outside it, in a bare
// error shell. This re-exports Next's own default body, so the page looks
// exactly as it did before the segment: the same text, in the site's shell.
// A designed 404 is its own piece of work.
export { default } from "next/dist/client/components/builtin/not-found";
