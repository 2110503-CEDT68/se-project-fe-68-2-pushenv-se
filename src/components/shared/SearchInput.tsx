"use client";

import { useDeferredValue, useState } from "react";
import { Search } from "lucide-react";

export function SearchInput({ placeholder = "Search" }: { placeholder?: string }) {
  const [value, setValue] = useState("");
  const deferredValue = useDeferredValue(value);

  return (
    <label className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm">
      <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
      <input
        className="w-full bg-transparent outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <span className="text-xs text-[var(--muted-foreground)]">{deferredValue.length}</span>
    </label>
  );
}
