import { Card } from "@/components/ui/card";

export function ConfirmDialog({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-[var(--muted-foreground)]">{description}</p>
    </Card>
  );
}
