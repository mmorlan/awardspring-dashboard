"use client";

import { useMemo, useReducer, useState } from "react";

import ApplicationCard from "@/components/ApplicationCard";
import FilterChips from "@/components/FilterChips";
import HeroTask from "@/components/HeroTask";
import LedgerStrip from "@/components/LedgerStrip";
import WaitingOnOthers from "@/components/WaitingOnOthers";
import {
  type FilterKey,
  awardedTotal,
  filterCounts,
  heroTask,
  inPlayTotal,
  isActive,
  matchesFilter,
  sortForList,
  waitingOnOthers,
} from "@/lib/derive";
import { applications as seed } from "@/lib/fixtures";
import type { Application } from "@/lib/types";

type Action =
  | { type: "complete_requirement"; appId: string; reqId: string }
  | { type: "send_reminder"; appId: string; reqId: string; at: string };

function reducer(state: Application[], action: Action): Application[] {
  return state.map((app) => {
    if (app.id !== action.appId) return app;

    switch (action.type) {
      case "complete_requirement":
        return {
          ...app,
          // Only the student's own open todos are theirs to check off.
          requirements: app.requirements.map((req) =>
            req.id === action.reqId &&
            req.ownedBy === "student" &&
            req.status === "todo"
              ? { ...req, status: "done" as const }
              : req,
          ),
        };

      case "send_reminder":
        return {
          ...app,
          // Guarded so a second click can never re-send.
          requirements: app.requirements.map((req) =>
            req.id === action.reqId && !req.lastReminderSent
              ? { ...req, lastReminderSent: action.at }
              : req,
          ),
        };
    }
  });
}

const EMPTY_STATE: Record<FilterKey, { title: string; body: string }> = {
  all: {
    title: "No applications yet.",
    body: "Once you start one, it shows up here.",
  },
  action: {
    title: "Nothing needs you right now.",
    body: "You’ve cleared every requirement that was yours to do. What’s left is in someone else’s hands.",
  },
  waiting: {
    title: "Nothing waiting on anyone else.",
    body: "Everything left is yours.",
  },
  submitted: {
    title: "Nothing submitted yet.",
    body: "Applications land here once you send them off.",
  },
  awarded: {
    title: "No awards yet.",
    body: "Money you win will be tracked here.",
  },
};

export default function Dashboard() {
  const [apps, dispatch] = useReducer(reducer, seed);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Everything below is derived on every render — no duplicated state.
  const hero = useMemo(() => heroTask(apps), [apps]);
  const waiting = useMemo(() => waitingOnOthers(apps), [apps]);
  const counts = useMemo(() => filterCounts(apps), [apps]);
  const visible = useMemo(
    () => sortForList(apps.filter((a) => matchesFilter(a, filter))),
    [apps, filter],
  );
  const openCount = apps.filter(
    (a) => isActive(a) || a.status === "submitted",
  ).length;

  const completeRequirement = (appId: string, reqId: string) =>
    dispatch({ type: "complete_requirement", appId, reqId });

  const sendReminder = (appId: string, reqId: string) =>
    dispatch({
      type: "send_reminder",
      appId,
      reqId,
      at: new Date().toISOString(),
    });

  const toggleExpanded = (appId: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(appId)) next.delete(appId);
      else next.add(appId);
      return next;
    });

  const empty = EMPTY_STATE[filter];

  return (
    <div className="min-h-full">
      <LedgerStrip
        studentName="Matt"
        awarded={awardedTotal(apps)}
        inPlay={inPlayTotal(apps)}
        openCount={openCount}
      />

      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-10">
        <HeroTask task={hero} onComplete={completeRequirement} />

        <WaitingOnOthers items={waiting} onRemind={sendReminder} />

        <section aria-labelledby="all-heading">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h2
              id="all-heading"
              className="font-display text-ink-soft text-[12px] font-semibold tracking-[0.14em] uppercase"
            >
              All applications
            </h2>
            <FilterChips active={filter} counts={counts} onChange={setFilter} />
          </div>

          {visible.length === 0 ? (
            <div className="border-rule bg-card rounded-xl border border-dashed p-10 text-center">
              <p className="text-ink text-[15px] font-medium">{empty.title}</p>
              <p className="text-ink-soft mx-auto mt-1 max-w-md text-[14px]">
                {empty.body}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {visible.map((app) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  expanded={expanded.has(app.id)}
                  onToggle={toggleExpanded}
                  onComplete={completeRequirement}
                />
              ))}
            </ul>
          )}
        </section>

        <footer className="text-ink-faint border-rule border-t pt-6 text-[12px]">
          Prototype for AwardSpring. All state is in-memory — reload to reset.
        </footer>
      </main>
    </div>
  );
}
