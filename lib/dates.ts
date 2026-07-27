/**
 * All date math is pinned to UTC midnight so the server render and the client
 * render agree. Deadlines in the fixture are expressed as offsets from "today"
 * and resolved at module load, which keeps the demo from rotting.
 */

function startOfUTCDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export const TODAY = startOfUTCDay(new Date());

const DAY_MS = 86_400_000;

/** ISO date (YYYY-MM-DD) `days` from today. Negative is in the past. */
export function dateInDays(days: number): string {
  return new Date(TODAY.getTime() + days * DAY_MS).toISOString().slice(0, 10);
}

/** ISO timestamp `days` ago, at 09:00 UTC. */
export function timestampDaysAgo(days: number): string {
  return `${dateInDays(-days)}T09:00:00.000Z`;
}

/** Whole days between today and an ISO date. Negative once the date is past. */
export function daysLeft(isoDate: string): number {
  const target = startOfUTCDay(new Date(isoDate));
  return Math.round((target.getTime() - TODAY.getTime()) / DAY_MS);
}

export function formatDeadline(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  });
}

/**
 * "in 3 days" / "due today" — days remaining is what a student acts on.
 * Once a deadline is past, the count stops being useful and the date is
 * the more honest label.
 */
export function deadlineLabel(isoDate: string): string {
  const d = daysLeft(isoDate);
  if (d === 0) return "due today";
  if (d === 1) return "due tomorrow";
  if (d > 1) return `in ${d} days`;
  return `closed ${formatDeadline(isoDate)}`;
}

/** "just now" / "2 days ago" — for reminder + request timestamps. */
export function agoLabel(isoTimestamp: string): string {
  const d = daysLeft(isoTimestamp);
  if (d >= 0) return "just now";
  if (d === -1) return "yesterday";
  return `${Math.abs(d)} days ago`;
}
