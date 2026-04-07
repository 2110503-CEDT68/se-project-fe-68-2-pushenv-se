"use client";

import { Upload } from "lucide-react";

export function FileUpload({ accept }: { accept: string }) {
  return (
    <label className="grid gap-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] px-5 py-6 text-sm">
      <span className="inline-flex items-center gap-2 font-semibold">
        <Upload className="h-4 w-4" />
        Upload file
      </span>
      <input accept={accept} className="text-sm" type="file" />
    </label>
  );
}
