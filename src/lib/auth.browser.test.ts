import { describe, expect, it, vi } from "vitest";
import { clearToken, getToken, setToken } from "./auth";

describe("auth helpers in the browser", () => {
  it("reads the stored token", () => {
    window.localStorage.setItem("job-fair-token", "stored-token");

    expect(getToken()).toBe("stored-token");
  });

  it("writes and clears the token, cookie, and auth-change event", () => {
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");

    setToken("token-123");
    expect(window.localStorage.getItem("job-fair-token")).toBe("token-123");
    expect(document.cookie).toContain("job-fair-token=token-123");
    expect(dispatchSpy).toHaveBeenCalledWith(expect.any(Event));

    clearToken();
    expect(window.localStorage.getItem("job-fair-token")).toBeNull();
    expect(document.cookie).not.toContain("job-fair-token=token-123");
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
  });
});
