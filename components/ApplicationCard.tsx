"use client";

import CompletionRing from "@/components/CompletionRing";
import { agoLabel, deadlineLabel, daysLeft } from "@/lib/dates";
import {
  STATUS_LABEL,
  completedCount,
  completion,
  isActive,
  isBlocked,
  money,
  readyToSubmit,
} from "@/lib/derive";
import type { Application } from "@/lib/types";

type Props = {
  app: Application;
  expanded: boolean;
  onToggle: (appId: string) => void;
  onComplete: (appId: string, reqId: string) => void;
};

const STATUS_TONE: Record<Application["status"], string> = {
  draft: "border-rule text-ink-soft bg-paper",
  in_progress: "border-rule text-ink-soft bg-paper",
  submitted: "border-ink/15 text-ink bg-paper",
  awarded: "border-ledger/25 text-ledger bg-ledger-soft",
  not_selected: "border-rule text-ink-faint bg-paper",
};

export default function ApplicationCard({
  app,
  expanded,
  onToggle,
  onComplete,
}: Props) {
  const panelId = `req-${app.id}`;
  const total = app.requirements.length;
  const live = isActive(app);
  const days = daysLeft(app.deadline);
  const urgent = live && days <= 5;

  return (
    <li
      className={`border-rule bg-card rounded-xl border ${
        app.status === "not_selected" ? "opacity-60" : ""
      }`}
    >
      <h3>
        <button
          type="button"
          onClick={() => onToggle(app.id)}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="hover:bg-paper/60 flex w-full cursor-pointer items-center gap-4 rounded-xl px-5 py-4 text-left transition-colors"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className="text-ink-faint shrink-0 transition-transform duration-200"
            style={{ transform: expanded ? "rotate(90deg)" : "none" }}
          >
            <path
              d="M4 2L8 6L4 10"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="min-w-0 flex-1">
            <span className="text-ink block truncate text-[15px] font-medium">
              {app.name}
            </span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
              <span
                className={`rounded border px-1.5 py-px text-[11px] font-medium ${STATUS_TONE[app.status]}`}
              >
                {STATUS_LABEL[app.status]}
              </span>
              {isBlocked(app) && (
                <span className="text-pending">· waiting on others</span>
              )}
              {readyToSubmit(app) && (
                <span className="text-ledger font-medium">
                  · all requirements complete
                </span>
              )}
            </span>
          </span>

          <span className="font-mono text-ink w-20 shrink-0 text-right text-[15px] font-medium tabular-nums">
            {money(app.amount)}
          </span>

          <CompletionRing
            value={completion(app)}
            done={completedCount(app)}
            total={total}
            size={38}
            tone={
              app.status === "not_selected"
                ? "muted"
                : app.status === "awarded"
                  ? "ledger"
                  : "ink"
            }
          />

          <span
            className={`font-mono w-[7.5rem] shrink-0 text-right text-[13px] whitespace-nowrap tabular-nums ${
              urgent ? "text-pending font-medium" : "text-ink-faint"
            }`}
          >
            {deadlineLabel(app.deadline)}
          </span>
        </button>
      </h3>

      {expanded && (
        <div id={panelId} className="border-rule border-t px-5 py-4">
          <ul className="space-y-1">
            {app.requirements.map((req) => {
              if (req.status === "done") {
                return (
                  <li
                    key={req.id}
                    className="flex items-center gap-3 py-1.5 text-[14px]"
                  >
                    <span
                      aria-hidden="true"
                      className="bg-ledger flex size-[18px] shrink-0 items-center justify-center rounded-[5px]"
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M13 4.5L6.5 11.5L3 8"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-ink-faint line-through">
                      {req.label}
                    </span>
                  </li>
                );
              }

              if (req.status === "waiting") {
                return (
                  <li
                    key={req.id}
                    className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1.5 text-[14px]"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="border-pending/50 flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-dashed"
                      />
                      <span className="text-ink">
                        {req.label}
                        <span className="text-ink-soft"> — {req.owner}</span>
                      </span>
                    </span>
                    <span className="font-mono text-pending text-[12px] tabular-nums">
                      {req.lastReminderSent
                        ? `reminded ${agoLabel(req.lastReminderSent)}`
                        : `requested ${agoLabel(req.requestedAt!)}`}
                    </span>
                  </li>
                );
              }

              return (
                <li key={req.id}>
                  <button
                    type="button"
                    onClick={() => onComplete(app.id, req.id)}
                    className="group hover:bg-paper flex w-full cursor-pointer items-center gap-3 rounded-md py-1.5 pr-2 text-left text-[14px] transition-colors"
                  >
                    <span
                      aria-hidden="true"
                      className="border-ink/30 group-hover:border-ledger group-hover:bg-ledger/10 flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors"
                    />
                    <span className="text-ink">{req.label}</span>
                    <span className="text-ink-faint ml-auto text-[12px] opacity-0 transition-opacity group-hover:opacity-100">
                      Mark complete
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
}
