import { vi } from "vitest";

export const toastMock = {
  success: vi.fn(),
  error: vi.fn(),
};

export function resetToastMocks() {
  toastMock.success.mockReset();
  toastMock.error.mockReset();
}
