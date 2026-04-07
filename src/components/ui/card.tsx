import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm", className)}>
      {children}
    </section>
  );
}
