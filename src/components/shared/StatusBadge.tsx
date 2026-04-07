const colors: Record<string, string> = {
  open: "bg-emerald-100 text-emerald-800",
  closed: "bg-stone-200 text-stone-700",
  published: "bg-sky-100 text-sky-800",
  unpublished: "bg-amber-100 text-amber-800",
  user: "bg-indigo-100 text-indigo-800",
  company: "bg-teal-100 text-teal-800",
  admin: "bg-rose-100 text-rose-800",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${colors[status] ?? "bg-stone-200 text-stone-700"}`}>
      {status}
    </span>
  );
}
