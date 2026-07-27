"use client";

import { agoLabel } from "@/lib/dates";
import type { WaitingItem } from "@/lib/derive";

type Props = {
  items: WaitingItem[];
  onRemind: (appId: string, reqId: string) => void;
};

export default function WaitingOnOthers({ items, onRemind }: Props) {
  return (
    <section aria-labelledby="waiting-heading">
      <h2
        id="waiting-heading"
        className="font-display text-ink-soft mb-3 text-[12px] font-semibold tracking-[0.14em] uppercase"
      >
        Waiting on others{" "}
        {items.length > 0 && (
          <span className="font-mono text-pending tabular-nums">
            ({items.length})
          </span>
        )}
      </h2>

      {items.length === 0 ? (
        <div className="border-rule bg-card rounded-xl border border-dashed p-8 text-center">
          <p className="text-ink text-[15px] font-medium">
            Nothing waiting on anyone else.
          </p>
          <p className="text-ink-soft mt-1 text-[14px]">
            Everything left is yours.
          </p>
        </div>
      ) : (
        <ul className="border-pending/25 bg-pending-soft/40 divide-pending/15 divide-y rounded-xl border">
          {items.map(({ app, requirement }) => {
            const sent = requirement.lastReminderSent;
            return (
              <li
                key={requirement.id}
                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="text-ink text-[15px]">
                    <span className="font-semibold">{requirement.owner}</span>
                    <span className="text-ink-soft"> — </span>
                    <span>{requirement.label.toLowerCase()}</span>
                  </p>
                  <p className="text-ink-faint mt-0.5 text-[13px]">
                    {app.name} ·{" "}
                    <span className="font-mono tabular-nums">
                      requested {agoLabel(requirement.requestedAt!)}
                    </span>
                  </p>
                </div>

                {sent ? (
                  <span className="text-pending flex shrink-0 items-center gap-1.5 text-[13px] font-medium">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M13 4.5L6.5 11.5L3 8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Reminder sent ·{" "}
                    <span className="font-mono tabular-nums">
                      {agoLabel(sent)}
                    </span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onRemind(app.id, requirement.id)}
                    className="border-pending text-pending hover:bg-pending shrink-0 cursor-pointer rounded-lg border bg-white px-4 py-2 text-[13px] font-medium transition-colors hover:text-white"
                  >
                    Send reminder
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
