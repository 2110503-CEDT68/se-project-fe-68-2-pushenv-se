import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { Navbar } from "./Navbar";
import { makeToken } from "@/test/contracts/fixtures";
import { server } from "@/test/contracts/server";
import { routerMock } from "@/test/mocks/navigation";

const API_BASE = "http://localhost:4000/api/v1";

describe("Navbar", () => {
  it("renders signed-out navigation", () => {
    render(<Navbar />);

    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign up" })).toBeInTheDocument();
  });

  it("opens the admin menu and logs out even when the backend call fails", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      "job-fair-token",
      makeToken({ id: "admin-1", role: "systemAdmin" }),
    );

    server.use(
      http.post(`${API_BASE}/auth/logout`, () =>
        HttpResponse.json({ success: false, message: "Server error" }, { status: 500 }),
      ),
    );

    render(<Navbar />);

    const menuButton = await screen.findByRole("button", { name: /Job Fair/i });
    await user.click(menuButton);
    expect(screen.getByRole("link", { name: "User Management" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => {
      expect(screen.queryByRole("link", { name: "User Management" })).toBeNull();
    });

    await user.click(screen.getByRole("button", { name: "Logout" }));

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith("/signin");
    });
    expect(window.localStorage.getItem("job-fair-token")).toBeNull();
  });
});
