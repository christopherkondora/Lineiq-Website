import { NextResponse, type NextRequest } from "next/server";
import { routeRequest } from "./app/i18n/routing";

// Next 16's renamed middleware. It only carries out what the routing core
// decides: the plain English address is served from the internal [locale]=en
// segment, /hu and /de pass through. The /en collapse is a next.config
// redirect (localeRedirectRules), not a proxy redirect: see routing.ts.
//
// Locally, start the production server without -H (`next start -p 3417`, not
// `-H 127.0.0.1`). With -H, Next hands the proxy a localhost URL but compares
// the rewrite against the -H hostname, treats the rewrite as external, and
// every plain address 308s to itself. Vercel is unaffected.
export function proxy(request: NextRequest) {
  const decision = routeRequest(request.nextUrl.pathname);
  if (decision.action === "next") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = decision.to;
  return NextResponse.rewrite(url);
}

export const config = {
  // Pages only: not the contact API, not Next's own assets, and not files
  // (anything with a dot: public/ images, the video, robots.txt, favicon).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
