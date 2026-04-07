type SidebarItem = {
  href: string;
  label: string;
};

export function Sidebar({
  role,
  items,
}: {
  role: "company" | "admin";
  items: SidebarItem[];
}) {
  return (
    <aside className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
        {role} workspace
      </p>
      <div className="mt-6 grid gap-2">
        {items.map((item) => (
          <a
            key={item.href}
            className="rounded-2xl px-4 py-3 text-sm transition hover:bg-[var(--muted)]"
            href={item.href}
          >
            {item.label}
          </a>
        ))}
      </div>
    </aside>
  );
}
