import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

function request(path: string, cookie?: string) {
  return new NextRequest(`https://www.lineiqgroup.com${path}`, {
    headers: cookie ? { cookie } : {},
  });
}

const rewrittenTo = (response: Response) =>
  response.headers.get("x-middleware-rewrite");

describe("the proxy with a remembered language", () => {
  it("307s a plain address to the chosen language, keeping the query", () => {
    const response = proxy(request("/about?x=1", "lineiq-locale=hu"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://www.lineiqgroup.com/hu/about?x=1"
    );
  });

  it("marks the redirect so no cache keeps it", () => {
    const response = proxy(request("/", "lineiq-locale=de"));
    expect(response.headers.get("cache-control")).toBe("private, no-store");
  });

  it("serves English when the cookie says English, is missing, or is not ours", () => {
    for (const cookie of ["lineiq-locale=en", undefined, "lineiq-locale=fr"]) {
      const response = proxy(request("/about", cookie));
      expect(response.status).toBe(200);
      expect(rewrittenTo(response)).toBe(
        "https://www.lineiqgroup.com/en/about"
      );
    }
  });

  it("ignores the browser's language", () => {
    const response = proxy(
      new NextRequest("https://www.lineiqgroup.com/", {
        headers: { "accept-language": "hu-HU,hu;q=0.9" },
      })
    );
    expect(rewrittenTo(response)).toBe("https://www.lineiqgroup.com/en");
  });
});
