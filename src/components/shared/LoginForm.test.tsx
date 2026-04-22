import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { LoginForm } from "./LoginForm";
import { routerMock } from "@/test/mocks/navigation";
import { toastMock } from "@/test/mocks/toast";
import { server } from "@/test/contracts/server";

describe("LoginForm", () => {
  it.each([
    {
      email: "admin@example.com",
      password: "password123",
      role: "systemAdmin",
    },
    {
      email: "hr@techcorp.com",
      password: "password123",
      role: "companyUser",
    },
    {
      email: "jane@example.com",
      password: "password123",
      role: "jobSeeker",
    },
  ])("signs in and redirects $role users", async ({ email, password }) => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), email);
    await user.type(screen.getByLabelText("Password"), password);
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith("/events");
    });

    expect(window.localStorage.getItem("job-fair-token")).toBeTruthy();
    expect(toastMock.success).toHaveBeenCalledWith("Welcome back!");
  });

  it("shows the mapped credentials error for invalid login", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith(
        "Invalid email or password",
      );
    });
    expect(routerMock.push).not.toHaveBeenCalled();
  });

  it("shows the fallback error message when the backend response has no message", async () => {
    const user = userEvent.setup();

    server.use(
      http.post("http://localhost:4000/api/v1/auth/login", () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );

    render(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith("Login failed");
    });
  });
});
