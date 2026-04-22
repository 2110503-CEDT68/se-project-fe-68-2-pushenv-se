import { vi } from "vitest";

type NavigationState = {
  pathname: string;
  searchParams: URLSearchParams;
};

export const routerMock = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
};

const navigationState: NavigationState = {
  pathname: "/",
  searchParams: new URLSearchParams(),
};

export function setNavigationState({
  pathname = "/",
  searchParams = "",
}: {
  pathname?: string;
  searchParams?: string | URLSearchParams;
} = {}) {
  navigationState.pathname = pathname;
  navigationState.searchParams =
    typeof searchParams === "string"
      ? new URLSearchParams(searchParams)
      : new URLSearchParams(searchParams);
}

export function getPathname() {
  return navigationState.pathname;
}

export function getSearchParams() {
  return new URLSearchParams(navigationState.searchParams.toString());
}

export function resetNavigationMocks() {
  routerMock.push.mockReset();
  routerMock.replace.mockReset();
  routerMock.refresh.mockReset();
  routerMock.prefetch.mockReset();
  routerMock.back.mockReset();
  routerMock.forward.mockReset();
  setNavigationState();
}
