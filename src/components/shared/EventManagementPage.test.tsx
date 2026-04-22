import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EventManagementPage } from "./EventManagementPage";
import { makeToken } from "@/test/contracts/fixtures";
import { toastMock } from "@/test/mocks/toast";

describe("EventManagementPage", () => {
  function renderAsAdmin() {
    window.localStorage.setItem(
      "job-fair-token",
      makeToken({ id: "admin-1", role: "systemAdmin" }),
    );

    render(<EventManagementPage />);
  }

  function getModalByTitle(title: string) {
    const modalTitle = screen.getAllByText(title).at(-1) ?? null;
    const modal = modalTitle?.closest(".rounded-2xl") ?? null;
    expect(modal).not.toBeNull();
    return modal as HTMLElement;
  }

  it("loads events and toggles publish state", async () => {
    const user = userEvent.setup();
    renderAsAdmin();
    expect(await screen.findByText("Event Management")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Unpublish" }));
    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("Event unpublished");
    });
  });

  it("creates a new event", async () => {
    const user = userEvent.setup();
    renderAsAdmin();

    expect(await screen.findByText("Event Management")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Create Event" }));
    const createModal = getModalByTitle("Create Event");
    const dialogScope = within(createModal);
    await user.type(dialogScope.getByLabelText("Name"), "Created Event");
    await user.type(dialogScope.getByLabelText("Location"), "Phuket");
    await user.type(dialogScope.getByLabelText("Description"), "Created event description");
    await user.type(dialogScope.getByLabelText("Start Date"), "2025-08-01");
    await user.type(dialogScope.getByLabelText("End Date"), "2025-08-02");
    await user.click(dialogScope.getByRole("button", { name: "Create" }));
    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("Event created");
    });
  });

  it("edits an event and manages participating companies", async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    renderAsAdmin();

    expect(await screen.findByText("Event Management")).toBeInTheDocument();
    await user.click(screen.getAllByLabelText("Edit")[0]);
    const editModal = getModalByTitle("Edit Event");
    const infoScope = within(editModal);
    const nameInput = infoScope.getByDisplayValue("SE2 Job Fair");
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Event");
    await user.click(infoScope.getByRole("button", { name: "Save" }));
    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("Event updated");
    });

    await user.click(screen.getAllByLabelText("Edit")[0]);
    const companiesModal = getModalByTitle("Edit Event");
    const companiesScope = within(companiesModal);
    await user.click(companiesScope.getByRole("button", { name: "Participating Companies" }));

    await waitFor(() => {
      expect(companiesScope.getByText(/Participating Companies \(1\)/)).toBeInTheDocument();
    });

    await user.type(
      companiesScope.getByPlaceholderText("Search company by name..."),
      "Tech",
    );
    const companyOption = await companiesScope.findByRole("button", { name: /Tech Corp/i });
    await user.click(companyOption);
    await user.click(companiesScope.getByRole("button", { name: "Add" }));
    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith("Company is already linked to this event");
    });

    await user.click(companiesScope.getByTitle("Remove hr@techcorp.com"));
    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("Company removed");
    });
    expect(confirmSpy).toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it("deletes an event", async () => {
    const user = userEvent.setup();
    renderAsAdmin();

    expect(await screen.findByText("Event Management")).toBeInTheDocument();
    await user.click(screen.getAllByLabelText("Delete")[0]);
    const deleteModal = getModalByTitle("Delete Event");
    await user.click(within(deleteModal).getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("Event deleted");
    });
  });
});
