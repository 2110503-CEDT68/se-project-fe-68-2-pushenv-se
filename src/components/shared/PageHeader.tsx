import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-[var(--muted-foreground)]">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
