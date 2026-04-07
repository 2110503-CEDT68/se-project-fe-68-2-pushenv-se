import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AuthCard({
  title,
  description,
  fields,
  footerLink,
}: {
  title: string;
  description: string;
  fields: string[];
  footerLink: { href: string; label: string };
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <Card className="w-full space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--primary)]">
            Public access
          </p>
          <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{description}</p>
        </div>
        <div className="grid gap-3">
          {fields.map((field) => (
            <label key={field} className="grid gap-2 text-sm font-medium">
              {field}
              <Input placeholder={field} />
            </label>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3">
          <button className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)]">
            Continue
          </button>
          <a className="text-sm text-[var(--primary)]" href={footerLink.href}>
            {footerLink.label}
          </a>
        </div>
      </Card>
    </main>
  );
}
