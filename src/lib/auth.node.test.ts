// @vitest-environment node

import { describe, expect, it } from "vitest";
import { clearToken, getToken, setToken } from "./auth";

describe("auth helpers outside the browser", () => {
  it("returns null and treats setters as no-ops", () => {
    expect(getToken()).toBeNull();
    expect(() => setToken("ignored")).not.toThrow();
    expect(() => clearToken()).not.toThrow();
  });
});
