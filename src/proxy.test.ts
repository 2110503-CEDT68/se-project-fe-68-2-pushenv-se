// @vitest-environment node

import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";
import { makeToken } from "@/test/contracts/fixtures";

function makeRequest(pathname: string, token?: string) {
  const headers = token
    ? { cookie: `job-fair-token=${token}` }
    : undefined;

  return new NextRequest(`http://localhost${pathname}`, { headers });
}

describe("proxy", () => {
  it("passes through anonymous auth-page and public requests", () => {
    const authPage = proxy(makeRequest("/signin"));
    const publicPage = proxy(makeRequest("/companies"));

    expect(authPage.headers.get("location")).toBeNull();
    expect(publicPage.headers.get("location")).toBeNull();
  });

  it("redirects signed-in users away from auth pages", () => {
    const adminResponse = proxy(
      makeRequest(
        "/signin",
        makeToken({ id: "admin-1", role: "systemAdmin" }),
      ),
    );
    const companyResponse = proxy(
      makeRequest(
        "/signup",
        makeToken({ id: "company-user-1", role: "companyUser" }),
      ),
    );

    expect(adminResponse.headers.get("location")).toBe(
      "http://localhost/admin/users",
    );
    expect(companyResponse.headers.get("location")).toBe(
      "http://localhost/events",
    );
  });

  it("redirects anonymous access to protected pages", () => {
    const response = proxy(makeRequest("/profile"));

    expect(response.headers.get("location")).toBe(
      "http://localhost/signin?redirect=%2Fprofile",
    );
  });

  it("redirects non-admin users away from admin pages", () => {
    const response = proxy(
      makeRequest(
        "/admin/users",
        makeToken({ id: "company-user-1", role: "companyUser" }),
      ),
    );

    expect(response.headers.get("location")).toBe("http://localhost/events");
  });

  it("allows admins through admin routes", () => {
    const response = proxy(
      makeRequest("/admin/events", makeToken({ id: "admin-1", role: "systemAdmin" })),
    );

    expect(response.headers.get("location")).toBeNull();
  });

  it("treats malformed tokens as signed out", () => {
    const response = proxy(makeRequest("/admin/events", "bad-token"));

    expect(response.headers.get("location")).toBe(
      "http://localhost/signin?redirect=%2Fadmin%2Fevents",
    );
  });

  it("treats undecodable token payloads as signed out", () => {
    const response = proxy(makeRequest("/profile", "header.@@@.signature"));

    expect(response.headers.get("location")).toBe(
      "http://localhost/signin?redirect=%2Fprofile",
    );
  });
});
