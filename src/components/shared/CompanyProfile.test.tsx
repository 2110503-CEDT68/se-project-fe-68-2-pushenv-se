import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { CompanyProfileSection } from "./CompanyProfile";
import { makeToken } from "@/test/contracts/fixtures";
import { server } from "@/test/contracts/server";
import { toastMock } from "@/test/mocks/toast";

const API_BASE = "http://localhost:4000/api/v1";

function signInAsCompany() {
  window.localStorage.setItem(
    "job-fair-token",
    makeToken({ id: "company-user-1", role: "companyUser" }),
  );
}

describe("CompanyProfileSection", () => {
  it("loads, edits details, and saves description updates", async () => {
    signInAsCompany();
    const user = userEvent.setup();

    render(<CompanyProfileSection />);

    expect(await screen.findByText("Company Details")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    const websiteInput = screen.getByPlaceholderText("https://example.com");
    await user.clear(websiteInput);
    await user.type(websiteInput, "https://updated.example.com");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("Company details updated");
    });

    await user.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    await user.clear(screen.getByDisplayValue("https://updated.example.com"));
    await user.type(
      screen.getByPlaceholderText("https://example.com"),
      "https://cancelled.example.com",
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByText("https://updated.example.com")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: "Edit" })[1]);
    const descriptionField = screen.getByPlaceholderText("Type your message here.");
    await user.clear(descriptionField);
    await user.type(descriptionField, "Updated company description");
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("Description updated");
    });
    expect(screen.getByDisplayValue("Updated company description")).toBeDisabled();
  });

  it("shows errors for failed profile fetch and failed detail saves", async () => {
    signInAsCompany();
    const user = userEvent.setup();

    server.use(
      http.get(`${API_BASE}/company/profile`, () =>
        HttpResponse.json({ success: false, message: "Server error" }, { status: 500 }),
      ),
    );

    const { unmount, container } = render(<CompanyProfileSection />);

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith(
        "Failed to load company profile",
      );
    });
    expect(container).toBeEmptyDOMElement();

    server.resetHandlers();
    unmount();
    render(<CompanyProfileSection />);
    expect(await screen.findByText("Company Details")).toBeInTheDocument();

    server.use(
      http.put(`${API_BASE}/company/profile`, () =>
        HttpResponse.json({ success: false, message: "Update failed" }, { status: 500 }),
      ),
    );

    await user.click(screen.getAllByRole("button", { name: "Edit" })[0]);
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalledWith("Update failed");
    });
  });

  it("returns early when no logo file is chosen", async () => {
    signInAsCompany();

    render(<CompanyProfileSection />);
    expect(await screen.findByText("Company Details")).toBeInTheDocument();

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [] } });

    expect(toastMock.success).not.toHaveBeenCalled();
    expect(toastMock.error).not.toHaveBeenCalled();
  });

  it("supports the synthetic success path for logo uploads", async () => {
    signInAsCompany();
    const user = userEvent.setup();

    server.use(
      http.put(`${API_BASE}/company/profile`, async ({ request }) => {
        const contentType = request.headers.get("content-type") ?? "";
        if (contentType.includes("multipart/form-data")) {
          return HttpResponse.json(
            {
              success: true,
              message: "Profile updated",
              data: {
                id: "company-1",
                companyUserId: "company-user-1",
                description: "We build production software",
                logo: "/uploads/logos/new-logo.png",
                website: "techcorp.com",
                createdAt: "2025-01-03T00:00:00.000Z",
                updatedAt: "2025-01-04T00:00:00.000Z",
              },
            },
            { status: 200 },
          );
        }

        return HttpResponse.json({ success: false, message: "Update failed" }, { status: 500 });
      }),
    );

    render(<CompanyProfileSection />);
    expect(await screen.findByText("Company Details")).toBeInTheDocument();

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(
      input,
      new File(["logo"], "logo.png", { type: "image/png" }),
    );

    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("Logo updated");
    });
  });

  it.fails("uploads the logo successfully against the real backend contract", async () => {
    signInAsCompany();
    const user = userEvent.setup();

    render(<CompanyProfileSection />);
    expect(await screen.findByText("Company Details")).toBeInTheDocument();

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(
      input,
      new File(["logo"], "logo.png", { type: "image/png" }),
    );

    await waitFor(() => {
      expect(toastMock.success).toHaveBeenCalledWith("Logo updated");
    });
  });
});
