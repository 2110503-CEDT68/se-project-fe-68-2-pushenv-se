import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CompanyManagementPage } from "./CompanyManagementPage";
import { makeToken } from "@/test/contracts/fixtures";
import { toastMock } from "@/test/mocks/toast";

function getModalByTitle(title: string) {
  const modalTitle = screen.getAllByText(title).at(-1) ?? null;
  const modal = modalTitle?.closest(".rounded-2xl") ?? null;
  expect(modal).not.toBeNull();
  return modal as HTMLElement;
}

describe("CompanyManagementPage", () => {
  it("loads and performs create, update, and delete flows", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      "job-fair-token",
      makeToken({ id: "admin-1", role: "systemAdmin" }),
    );

    render(<CompanyManagementPage />);
    expect(await screen.findByText("Company Management")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Create Company" }));
    const createModal = getModalByTitle("Create Company");
    const createInputs = createModal.querySelectorAll("input");
    await user.type(createInputs[0] as HTMLInputElement, "Created Company");
    await user.type(createInputs[1] as HTMLInputElement, "company-created@example.com");
    await user.type(createInputs[2] as HTMLInputElement, "password123");
    await user.click(within(createModal).getByRole("button", { name: "Create" }));
    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("Company created");
    });

    await user.click(screen.getAllByLabelText("Edit")[0]);
    const editModal = getModalByTitle("Edit Company");
    const dialogScope = within(editModal);
    const websiteInput = dialogScope.getByPlaceholderText("https://example.com");
    const descriptionInput = dialogScope.getByPlaceholderText("Company description");
    await user.clear(websiteInput);
    await user.type(websiteInput, "https://updated.example.com");
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Updated description");
    await user.click(dialogScope.getByRole("button", { name: "Save" }));
    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("Company updated");
    });

    await user.click(screen.getAllByLabelText("Delete")[0]);
    const deleteModal = getModalByTitle("Delete Company");
    await user.click(within(deleteModal).getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("Company deleted");
    });
  });
});
