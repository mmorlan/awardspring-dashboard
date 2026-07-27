"use client";

import { FILTERS, type FilterKey } from "@/lib/derive";

type Props = {
  active: FilterKey;
  counts: Record<FilterKey, number>;
  onChange: (key: FilterKey) => void;
};

export default function FilterChips({ active, counts, onChange }: Props) {
  return (
    <div
      role="group"
      aria-label="Filter applications"
      className="flex flex-wrap gap-2"
    >
      {FILTERS.map(({ key, label }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(key)}
            className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
              isActive
                ? "border-ink bg-ink text-white"
                : "border-rule bg-card text-ink-soft hover:border-ink/30 hover:text-ink"
            }`}
          >
            {label}
            <span
              className={`font-mono text-[12px] tabular-nums ${
                isActive ? "text-white/60" : "text-ink-faint"
              }`}
            >
              {counts[key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
