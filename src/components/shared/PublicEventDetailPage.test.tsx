import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { PublicEventDetailPage } from "./PublicEventDetailPage";
import { makeToken } from "@/test/contracts/fixtures";
import { contractState, server } from "@/test/contracts/server";
import { toastMock } from "@/test/mocks/toast";

const API_BASE = "http://localhost:4000/api/v1";

describe("PublicEventDetailPage", () => {
  it("shows the sign-in call to action for anonymous users", async () => {
    render(<PublicEventDetailPage eventId="event-1" />);

    expect(await screen.findByText("SE2 Job Fair")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
  });

  it("registers a signed-in job seeker", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      "job-fair-token",
      makeToken({ id: "job-seeker-1", role: "jobSeeker" }),
    );

    render(<PublicEventDetailPage eventId="event-1" />);

    const registerButton = await screen.findByRole("button", { name: "Register" });
    await user.click(registerButton);

    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("Registered for event");
    });
    expect(await screen.findByRole("button", { name: "Registered" })).toBeDisabled();
  });

  it("still renders the event when the companies request fails", async () => {
    server.use(
      http.get(`${API_BASE}/events/event-1/companies`, () =>
        HttpResponse.json({ success: false, message: "Server error" }, { status: 500 }),
      ),
    );

    render(<PublicEventDetailPage eventId="event-1" />);

    expect(await screen.findByText("SE2 Job Fair")).toBeInTheDocument();
    expect(screen.getByText("Company list")).toBeInTheDocument();
  });

  it("shows the already-registered state from the backend", async () => {
    contractState.registrations.push({
      id: "registration-existing",
      eventId: "event-1",
      jobSeekerId: "job-seeker-1",
      registeredAt: new Date().toISOString(),
    });
    window.localStorage.setItem(
      "job-fair-token",
      makeToken({ id: "job-seeker-1", role: "jobSeeker" }),
    );

    render(<PublicEventDetailPage eventId="event-1" />);

    expect(await screen.findByRole("button", { name: "Registered" })).toBeDisabled();
  });
});
