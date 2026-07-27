"use client";

import CompletionRing from "@/components/CompletionRing";
import { deadlineLabel, daysLeft, formatDeadline } from "@/lib/dates";
import { completedCount, completion, money } from "@/lib/derive";
import type { Application, Requirement } from "@/lib/types";

type Props = {
  task: { app: Application; requirement: Requirement } | null;
  onComplete: (appId: string, reqId: string) => void;
};

export default function HeroTask({ task, onComplete }: Props) {
  if (!task) {
    return (
      <section aria-labelledby="hero-heading">
        <h2
          id="hero-heading"
          className="font-display text-ink-soft mb-3 text-[12px] font-semibold tracking-[0.14em] uppercase"
        >
          Needs you today
        </h2>
        <div className="border-rule bg-card rounded-xl border border-dashed p-8 text-center">
          <p className="text-ink text-[15px] font-medium">
            Nothing is waiting on you.
          </p>
          <p className="text-ink-soft mt-1 text-[14px]">
            Every open application is complete on your end. What&rsquo;s left is
            in someone else&rsquo;s hands.
          </p>
        </div>
      </section>
    );
  }

  const { app, requirement } = task;
  const days = daysLeft(app.deadline);
  const urgent = days <= 5;
  const total = app.requirements.length;

  return (
    <section aria-labelledby="hero-heading">
      <h2
        id="hero-heading"
        className="font-display text-ink-soft mb-3 text-[12px] font-semibold tracking-[0.14em] uppercase"
      >
        Needs you today
      </h2>

      <div className="border-ink/10 bg-card rounded-xl border shadow-[0_1px_2px_rgba(22,32,46,0.05),0_8px_24px_-12px_rgba(22,32,46,0.18)]">
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-2 px-6 pt-5">
          <div className="min-w-0">
            <p className="text-ink text-[17px] font-semibold">{app.name}</p>
            <p className="text-ink-faint mt-0.5 text-[13px]">{app.sponsor}</p>
          </div>
          <p className="font-mono text-ledger text-[20px] font-semibold tabular-nums">
            {money(app.amount)}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 pb-5">
          <div className="flex items-center gap-4">
            <CompletionRing
              value={completion(app)}
              done={completedCount(app)}
              total={total}
            />
            <div>
              <p className="text-ink text-[15px] font-medium">
                {requirement.label}
              </p>
              <p className="mt-0.5 flex items-center gap-2 text-[13px]">
                <span
                  className={`font-mono font-medium tabular-nums ${
                    urgent ? "text-pending" : "text-ink-soft"
                  }`}
                >
                  {deadlineLabel(app.deadline)}
                </span>
                <span className="text-ink-faint">
                  · closes {formatDeadline(app.deadline)} ·{" "}
                  {completedCount(app)} of {total} requirements complete
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onComplete(app.id, requirement.id)}
            className="bg-ink hover:bg-ink/90 cursor-pointer rounded-lg px-5 py-2.5 text-[14px] font-medium text-white transition-colors"
          >
            Mark complete
          </button>
        </div>
      </div>
    </section>
  );
}
