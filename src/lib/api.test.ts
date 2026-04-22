import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { api } from "./api";
import { setToken } from "./auth";
import { makeError, makeSuccess, makeToken } from "@/test/contracts/fixtures";
import { server } from "@/test/contracts/server";

const API_BASE = "http://localhost:4000/api/v1";

describe("api", () => {
  it("serializes params and injects the authorization header", async () => {
    let requestedUrl = "";
    let authorization = "";

    setToken(makeToken({ id: "job-seeker-1", role: "jobSeeker" }));

    server.use(
      http.get(`${API_BASE}/companies`, ({ request }) => {
        requestedUrl = request.url;
        authorization = request.headers.get("authorization") ?? "";

        return HttpResponse.json(
          makeSuccess("Companies", {
            data: [],
            total: 0,
            page: 2,
            limit: 5,
            totalPages: 1,
          }),
        );
      }),
    );

    await api.get("/companies", {
      params: {
        page: 2,
        limit: 5,
        q: "tech",
        featured: true,
        ignored: undefined,
      },
    });

    const url = new URL(requestedUrl);
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("limit")).toBe("5");
    expect(url.searchParams.get("q")).toBe("tech");
    expect(url.searchParams.get("featured")).toBe("true");
    expect(url.searchParams.has("ignored")).toBe(false);
    expect(authorization).toBe(
      `Bearer ${makeToken({ id: "job-seeker-1", role: "jobSeeker" })}`,
    );
  });

  it("sends json bodies with application/json content-type", async () => {
    let contentType = "";

    server.use(
      http.post(`${API_BASE}/auth/login`, async ({ request }) => {
        contentType = request.headers.get("content-type") ?? "";
        return HttpResponse.json(makeSuccess("Login successful", { ok: true }));
      }),
    );

    await api.post("/auth/login", { email: "jane@example.com", password: "pw" });

    expect(contentType).toContain("application/json");
  });

  it("does not force application/json for FormData payloads", async () => {
    let putContentType = "";

    setToken(makeToken({ id: "job-seeker-1", role: "jobSeeker" }));

    server.use(
      http.put(`${API_BASE}/auth/me`, async ({ request }) => {
        putContentType = request.headers.get("content-type") ?? "";
        return HttpResponse.json(
          makeSuccess("Profile updated", {
            id: "job-seeker-1",
            name: "Jane Jobseeker",
            email: "jane@example.com",
            role: "jobSeeker",
            phone: "0812345678",
            avatar: "/uploads/avatars/updated.png",
          }),
        );
      }),
    );

    const formData = new FormData();
    formData.append(
      "avatar",
      new File(["avatar"], "avatar.png", { type: "image/png" }),
    );

    await api.put("/auth/me", formData);

    expect(putContentType).not.toContain("application/json");
  });

  it("clears auth state and redirects on 401 responses in the browser", async () => {
    setToken(makeToken({ id: "job-seeker-1", role: "jobSeeker" }));

    server.use(
      http.get(`${API_BASE}/admin/accounts`, () =>
        HttpResponse.json(makeError("Unauthorized"), { status: 401 }),
      ),
    );

    await expect(api.get("/admin/accounts")).rejects.toMatchObject({
      message: "Unauthorized",
    });

    expect(window.localStorage.getItem("job-fair-token")).toBeNull();
    expect(window.location.href).toBe("/signin");
  });

  it("throws the parsed backend error payload on non-ok responses", async () => {
    await expect(
      api.post("/auth/login", {
        email: "jane@example.com",
        password: "wrong-password",
      }),
    ).rejects.toEqual({
      success: false,
      message: "Invalid credentials",
    });
  });

  it("supports patch and delete helper wrappers", async () => {
    let patchMethod = "";
    let deleteMethod = "";
    let postContentType = "";
    let patchContentType = "";
    let jsonPatchContentType = "";

    server.use(
      http.post(`${API_BASE}/events/event-1/register`, ({ request }) => {
        postContentType = request.headers.get("content-type") ?? "";
        return HttpResponse.json(makeSuccess("Registered", { ok: true }));
      }),
      http.patch(`${API_BASE}/admin/events/event-1/publish`, ({ request }) => {
        patchMethod = request.method;
        patchContentType = request.headers.get("content-type") ?? "";
        return HttpResponse.json(makeSuccess("Event published", { ok: true }));
      }),
      http.patch(`${API_BASE}/admin/events/event-2/publish`, ({ request }) => {
        jsonPatchContentType = request.headers.get("content-type") ?? "";
        return HttpResponse.json(makeSuccess("Event published", { ok: true }));
      }),
      http.delete(`${API_BASE}/admin/events/event-1`, ({ request }) => {
        deleteMethod = request.method;
        return HttpResponse.json(makeSuccess("Event deleted", null));
      }),
    );

    const registerForm = new FormData();
    registerForm.append("payload", "value");
    await api.post("/events/event-1/register", registerForm);

    const patchForm = new FormData();
    patchForm.append("payload", "value");
    await api.patch("/admin/events/event-1/publish", patchForm);
    await api.patch("/admin/events/event-2/publish", { publish: true });
    await api.delete("/admin/events/event-1");

    expect(patchMethod).toBe("PATCH");
    expect(deleteMethod).toBe("DELETE");
    expect(postContentType).not.toContain("application/json");
    expect(patchContentType).not.toContain("application/json");
    expect(jsonPatchContentType).toContain("application/json");
  });
});
