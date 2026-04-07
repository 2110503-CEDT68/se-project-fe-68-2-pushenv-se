import { Card } from "@/components/ui/card";

export function SpecPage({
  title,
  route,
  summary,
  bullets,
}: {
  title: string;
  route: string;
  summary: string;
  bullets: string[];
}) {
  return (
    <div className="grid gap-6">
      <Card>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
          {route}
        </p>
        <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm text-[var(--muted-foreground)]">{summary}</p>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Implementation notes</h2>
        <ul className="mt-4 grid gap-3 text-sm text-[var(--muted-foreground)]">
          {bullets.map((bullet) => (
            <li key={bullet} className="rounded-2xl bg-[var(--muted)] px-4 py-3">
              {bullet}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
