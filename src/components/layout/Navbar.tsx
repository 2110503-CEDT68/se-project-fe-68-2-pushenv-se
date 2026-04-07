import { StatusBadge } from "@/components/shared/StatusBadge";

export function Navbar({ role }: { role?: "user" | "company" | "admin" }) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a className="font-semibold tracking-[0.2em] text-[var(--primary)] uppercase" href="/">
          Job Fair
        </a>
        <nav className="flex items-center gap-4 text-sm">
          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
          {role ? <StatusBadge status={role} /> : null}
        </nav>
      </div>
    </header>
  );
}
