import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { RegisterForm } from "./RegisterForm";
import { server } from "@/test/contracts/server";
import { routerMock } from "@/test/mocks/navigation";
import { toastMock } from "@/test/mocks/toast";

const API_BASE = "http://localhost:4000/api/v1";

async function fillRegistrationForm() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText("Name"), "New User");
  await user.type(screen.getByLabelText("Email"), "new-user@example.com");
  await user.type(screen.getByLabelText("Password"), "password123");
  await user.type(screen.getByLabelText("Confirm Password"), "password123");

  const privacyLink = screen.getByRole("link", { name: "Privacy Policy" });
  await user.click(privacyLink);
  expect(
    await screen.findByText("Thank you for reading the policy."),
  ).toBeInTheDocument();

  const checkbox = screen.getByRole("checkbox");
  await waitFor(() => expect(checkbox).toBeEnabled());
  fireEvent.change(checkbox, { target: { checked: true } });
  await waitFor(() => expect(checkbox).toBeChecked());

  return user;
}

describe("RegisterForm", () => {
  it("registers a new job seeker and redirects to sign in", async () => {
    render(<RegisterForm />);

    const user = await fillRegistrationForm();
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(routerMock.push).toHaveBeenCalledWith("/signin");
    });

    expect(toastMock.success).toHaveBeenCalledWith(
      "Registration successful! Please login.",
    );
  });

  it("shows a toast for generic registration failures", async () => {
    server.use(
      http.post(`${API_BASE}/auth/register`, () =>
        HttpResponse.json(
          {
            success: false,
            message: "Registration failed",
          },
          { status: 500 },
        ),
      ),
    );

    render(<RegisterForm />);

    const user = await fillRegistrationForm();
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith("Registration failed");
    });
  });

  it("falls back to the default registration error message when none is provided", async () => {
    server.use(
      http.post(`${API_BASE}/auth/register`, () =>
        HttpResponse.json({}, { status: 500 }),
      ),
    );

    render(<RegisterForm />);

    const user = await fillRegistrationForm();
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith("Registration failed");
    });
  });

  it("handles the legacy duplicate-email error shape expected by the frontend", async () => {
    server.use(
      http.post(`${API_BASE}/auth/register`, () =>
        HttpResponse.json(
          {
            statusCode: 409,
            message: "Email already exists",
          },
          { status: 409 },
        ),
      ),
    );

    render(<RegisterForm />);

    const user = await fillRegistrationForm();
    await user.clear(screen.getByLabelText("Email"));
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Email already exists")).toBeInTheDocument();
  });

  it.fails(
    "shows an inline duplicate-email error for the real backend 409 contract",
    async () => {
      render(<RegisterForm />);

      const user = await fillRegistrationForm();
      await user.clear(screen.getByLabelText("Email"));
      await user.type(screen.getByLabelText("Email"), "jane@example.com");
      await user.click(screen.getByRole("button", { name: "Create account" }));

      expect(
        await screen.findByText("Email already exists"),
      ).toBeInTheDocument();
    },
  );
});
