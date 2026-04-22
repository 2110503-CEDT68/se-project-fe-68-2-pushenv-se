import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { createElement } from "react";
import { server, resetContractState } from "./contracts/server";
import {
  getPathname,
  getSearchParams,
  resetNavigationMocks,
  routerMock,
} from "./mocks/navigation";
import { resetToastMocks, toastMock } from "./mocks/toast";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    createElement("a", { href, ...props }, children),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => routerMock,
  useSearchParams: () => getSearchParams(),
  usePathname: () => getPathname(),
}));

vi.mock("sonner", () => ({
  toast: toastMock,
  Toaster: () => null,
}));

beforeAll(() => {
  process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000";
  server.listen({ onUnhandledRequest: "error" });
});

beforeEach(() => {
  resetContractState();
  resetNavigationMocks();
  resetToastMocks();
  vi.restoreAllMocks();

  if (typeof window !== "undefined") {
    window.localStorage.clear();
    document.cookie = "";

    const locationState = { href: "http://localhost/" };
    Object.defineProperty(window, "location", {
      configurable: true,
      value: locationState,
    });
  }
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
