import { daysLeft } from "./dates";
import type { AppStatus, Application, Requirement } from "./types";

/**
 * Everything in this file is computed at render time from the applications
 * array. Nothing derived is ever stored — a requirement's `status` is the
 * single source of truth, and completion / blocked / hero all fall out of it.
 */

export const ACTIVE_STATUSES: AppStatus[] = ["draft", "in_progress"];

export function isActive(app: Application): boolean {
  return ACTIVE_STATUSES.includes(app.status);
}

/** done ÷ total requirements, 0–1 */
export function completion(app: Application): number {
  if (app.requirements.length === 0) return 1;
  const done = app.requirements.filter((r) => r.status === "done").length;
  return done / app.requirements.length;
}

export function completedCount(app: Application): number {
  return app.requirements.filter((r) => r.status === "done").length;
}

/** ≥1 `waiting` requirement owned by someone other than the student */
export function isBlocked(app: Application): boolean {
  return app.requirements.some(
    (r) => r.status === "waiting" && r.ownedBy === "other",
  );
}

/** First `todo` requirement the student can actually do themselves. */
export function nextAction(app: Application): Requirement | null {
  return (
    app.requirements.find(
      (r) => r.status === "todo" && r.ownedBy === "student",
    ) ?? null
  );
}

export function needsStudent(app: Application): boolean {
  return isActive(app) && nextAction(app) !== null;
}

/** Every requirement complete but not yet submitted. */
export function readyToSubmit(app: Application): boolean {
  return isActive(app) && completion(app) === 1;
}

/**
 * The single most urgent thing the student can act on right now: the
 * student-owned todo attached to the nearest live deadline. Recomputed on
 * every render, so checking something off promotes the next one in.
 */
export function heroTask(
  apps: Application[],
): { app: Application; requirement: Requirement } | null {
  const candidates = apps
    .filter(needsStudent)
    .sort((a, b) => daysLeft(a.deadline) - daysLeft(b.deadline));
  const app = candidates[0];
  if (!app) return null;
  const requirement = nextAction(app);
  return requirement ? { app, requirement } : null;
}

export type WaitingItem = { app: Application; requirement: Requirement };

/** Flattened across applications, longest-waiting first. */
export function waitingOnOthers(apps: Application[]): WaitingItem[] {
  return apps
    .filter(isActive)
    .flatMap((app) =>
      app.requirements
        .filter((r) => r.status === "waiting" && r.ownedBy === "other")
        .map((requirement) => ({ app, requirement })),
    )
    .sort((a, b) =>
      (a.requirement.requestedAt ?? "").localeCompare(
        b.requirement.requestedAt ?? "",
      ),
    );
}

export function awardedTotal(apps: Application[]): number {
  return apps
    .filter((a) => a.status === "awarded")
    .reduce((sum, a) => sum + a.amount, 0);
}

/** Money still winnable: everything not yet decided. */
export function inPlayTotal(apps: Application[]): number {
  return apps
    .filter((a) => isActive(a) || a.status === "submitted")
    .reduce((sum, a) => sum + a.amount, 0);
}

// ── Filters ────────────────────────────────────────────────────────────────

export type FilterKey =
  | "all"
  | "action"
  | "waiting"
  | "submitted"
  | "awarded";

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "action", label: "Action needed" },
  { key: "waiting", label: "Waiting" },
  { key: "submitted", label: "Submitted" },
  { key: "awarded", label: "Awarded" },
];

export function matchesFilter(app: Application, key: FilterKey): boolean {
  switch (key) {
    case "all":
      return true;
    case "action":
      return needsStudent(app);
    case "waiting":
      return isBlocked(app);
    case "submitted":
      return app.status === "submitted";
    case "awarded":
      return app.status === "awarded";
  }
}

const SORT_RANK: Record<AppStatus, number> = {
  in_progress: 0,
  draft: 0,
  submitted: 1,
  awarded: 2,
  not_selected: 3,
};

/** Live work first, ordered by deadline; decided applications sink. */
export function sortForList(apps: Application[]): Application[] {
  return [...apps].sort((a, b) => {
    const rank = SORT_RANK[a.status] - SORT_RANK[b.status];
    if (rank !== 0) return rank;
    return daysLeft(a.deadline) - daysLeft(b.deadline);
  });
}

export function filterCounts(
  apps: Application[],
): Record<FilterKey, number> {
  return FILTERS.reduce(
    (acc, f) => {
      acc[f.key] = apps.filter((a) => matchesFilter(a, f.key)).length;
      return acc;
    },
    {} as Record<FilterKey, number>,
  );
}

// ── Formatting ─────────────────────────────────────────────────────────────

export function money(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

/** $32,000 → "$32k" for the ledger strip. */
export function moneyShort(amount: number): string {
  if (amount >= 1000 && amount % 1000 === 0) return `$${amount / 1000}k`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
  return money(amount);
}

export const STATUS_LABEL: Record<AppStatus, string> = {
  draft: "Draft",
  in_progress: "In progress",
  submitted: "Submitted",
  awarded: "Awarded",
  not_selected: "Not selected",
};
