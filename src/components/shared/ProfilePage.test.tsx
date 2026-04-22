import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProfilePage } from "./ProfilePage";
import { makeToken } from "@/test/contracts/fixtures";
import { toastMock } from "@/test/mocks/toast";

describe("ProfilePage", () => {
  it("loads, updates personal info, and deletes the account", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      "job-fair-token",
      makeToken({ id: "job-seeker-1", role: "jobSeeker" }),
    );

    render(<ProfilePage />);

    expect(await screen.findByText("Personal Information")).toBeInTheDocument();
    expect(screen.getAllByText("Jane Jobseeker")).toHaveLength(2);

    await user.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    const phoneInput = screen.getByPlaceholderText("Phone number");
    await user.clear(phoneInput);
    await user.type(phoneInput, "0800000000");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("Profile updated");
    });

    await user.click(screen.getAllByRole("button", { name: "Edit" })[1]);
    await user.type(screen.getByPlaceholderText("Enter your new password"), "new-pass");
    await user.type(screen.getByPlaceholderText("Re-enter your new password"), "other-pass");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(toastMock.error).toHaveBeenCalledWith("Passwords do not match");

    await user.click(screen.getByRole("button", { name: "Delete Account" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(window.location.href).toBe("/");
    });
  });
});
