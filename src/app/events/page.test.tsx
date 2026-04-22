import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import EventExplorerPage from "./page";
import { server } from "@/test/contracts/server";

const API_BASE = "http://localhost:4000/api/v1";

describe("EventExplorerPage", () => {
  it("renders searched event results from the backend contract", async () => {
    const element = await EventExplorerPage({
      searchParams: Promise.resolve({ search: "SE2", page: "1" }),
    });

    render(element);

    expect(await screen.findByText("SE2 Job Fair")).toBeInTheDocument();
    expect(screen.getByText("Events match your preferences")).toBeInTheDocument();
  });

  it("falls back to the empty state when the API request fails", async () => {
    server.use(
      http.get(`${API_BASE}/events`, () =>
        HttpResponse.json({ success: false, message: "Server error" }, { status: 500 }),
      ),
    );

    const element = await EventExplorerPage({
      searchParams: Promise.resolve({}),
    });

    render(element);

    expect(
      await screen.findByText("No events available at the moment."),
    ).toBeInTheDocument();
  });

  it("shows the search-specific empty state when no events match", async () => {
    const element = await EventExplorerPage({
      searchParams: Promise.resolve({ search: "missing", page: "1" }),
    });

    render(element);

    expect(
      await screen.findByText('No events found matching "missing".'),
    ).toBeInTheDocument();
  });
});
