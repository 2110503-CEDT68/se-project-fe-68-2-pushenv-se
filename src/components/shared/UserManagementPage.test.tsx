import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { UserManagementPage } from "./UserManagementPage";
import { makeToken } from "@/test/contracts/fixtures";
import { toastMock } from "@/test/mocks/toast";

function getModalByTitle(title: string) {
  const modalTitle = screen.getAllByText(title).at(-1) ?? null;
  const modal = modalTitle?.closest(".rounded-2xl") ?? null;
  expect(modal).not.toBeNull();
  return modal as HTMLElement;
}

describe("UserManagementPage", () => {
  it("loads and performs create, update, and delete flows", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      "job-fair-token",
      makeToken({ id: "admin-1", role: "systemAdmin" }),
    );

    render(<UserManagementPage />);
    expect(await screen.findByText("User Management")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Create User" }));
    const createModal = getModalByTitle("Create User");
    const createInputs = createModal.querySelectorAll("input");
    await user.type(createInputs[0] as HTMLInputElement, "Created User");
    await user.type(createInputs[1] as HTMLInputElement, "created@example.com");
    await user.type(createInputs[2] as HTMLInputElement, "password123");
    await user.click(within(createModal).getByRole("button", { name: "Create" }));
    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("User created");
    });

    const createdUserRow = screen.getByText("created@example.com").closest("tr");
    expect(createdUserRow).not.toBeNull();
    await user.click(within(createdUserRow as HTMLElement).getByLabelText("Edit"));
    const editModal = getModalByTitle("Edit User");
    const editInputs = editModal.querySelectorAll("input");
    await user.clear(editInputs[0] as HTMLInputElement);
    await user.type(editInputs[0] as HTMLInputElement, "Updated Created User");
    await user.click(within(editModal).getByRole("button", { name: "Save" }));
    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("User updated");
    });

    const updatedUserRow = screen.getByText("Updated Created User").closest("tr");
    expect(updatedUserRow).not.toBeNull();
    await user.click(within(updatedUserRow as HTMLElement).getByLabelText("Delete"));
    const deleteModal = getModalByTitle("Delete User");
    await user.click(within(deleteModal).getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("User deleted");
    });
  });
});
