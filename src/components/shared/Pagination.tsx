"use client";

export function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <button className="rounded-full border border-[var(--border)] px-3 py-1">Previous</button>
        <button className="rounded-full border border-[var(--border)] px-3 py-1">Next</button>
      </div>
    </div>
  );
}
