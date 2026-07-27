# Scholarship dashboard — AwardSpring take-home

A one-page dashboard for a student who is **mid-process** on scholarship
applications. Built by Matt Morlan.

**Live:** https://awardspring-dashboard.vercel.app
**Repo:** https://github.com/mmorlan/awardspring-dashboard
**Stack:** Next.js (App Router) · TypeScript · Tailwind · no backend

```bash
npm install && npm run dev
```

---

## Rationale

**1. Workflow: scholarship applications.**
AwardSpring's own domain, on purpose. Showing judgment inside the space this
team knows best is more useful to them than a safe detour into class
registration — and it's the only way to find out whether my read on the
student's problem matches theirs.

**2. What I surfaced first: dollars, then the single nearest deadline.**
The ledger strip answers "where do I stand" in money, not in application
counts — $4,500 awarded, $32,000 still in play. Students think in dollars and
dates. Below it, "Needs you today" answers "what's next" with exactly one
thing: the requirement the student can act on attached to the soonest closing
deadline. One item, not a queue, because a mid-process student staring at
eight open applications does not need another list.

**3. The call I'd defend: a dedicated "Waiting on others" section with a
working reminder.**
Most scholarship UIs optimize for *discovery* — search, match, browse. But a
student mid-process isn't shopping. The way a nearly-complete application
actually dies is a recommender who never uploaded the letter or a registrar
sitting on a transcript. It's the one failure the student can't fix by working
harder, and almost no tracker separates it from their own to-do list. So it
gets its own block, in its own color, above the fold, with a real send action
and a visible "requested 14 days ago" so the student can see which ask has
gone stale.

**4. Deliberately left out: scholarship discovery and search, entirely.**
Browsing and executing are different mental modes; mixing them makes both
worse. Also out: essay editor, notifications, auth, messaging, any backend.
Mobile is responsive down to ~900px but this is a desktop-first call, not a
mobile design.

**5. Next with more time: essay reuse detection.**
"This 500-word leadership essay satisfies 3 of your open applications." It's
the highest-leverage unbuilt feature in this space — it turns the dashboard
from a tracker into a multiplier, and the data model here already supports it.

---

## Working interactions

| Interaction | What changes |
|---|---|
| **Mark complete** (hero card, and inline in any expanded card) | Requirement flips to done, the completion ring animates, and the hero re-evaluates — finish the Chicago statement and the Illinois STEM award promotes into "Needs you today" |
| **Send reminder** | Optimistic flip to `Reminder sent · just now`; the button is replaced, so a second send is structurally impossible |
| **Filter chips** | Filters the list with a live per-chip count that recomputes as you check things off |
| **Expand card** | Inline requirement checklist, no route change; full keyboard support via `aria-expanded` |

State propagates. Filter to "Action needed", clear the requirements, and cards
leave the list, the counts fall, the hero empties, and both empty states
appear. Nothing on this surface is a dead button.

## How it's built

All state is in-memory React (`useReducer` over an array of applications),
seeded from [lib/fixtures.ts](lib/fixtures.ts). Reload resets it.

The one architectural rule: **derived values are never stored.** A
requirement's `status` is the single source of truth; completion, blocked,
next action, the hero, the filter counts, and the money totals are all computed
at render in [lib/derive.ts](lib/derive.ts). That's why the hero promotes and
the counts stay honest without any synchronization code — there's nothing to
keep in sync.

```
app/page.tsx           reducer + composition
components/            LedgerStrip · HeroTask · WaitingOnOthers · FilterChips · ApplicationCard
lib/derive.ts          every derived value, computed at render
lib/fixtures.ts        8 seeded applications across all five statuses
lib/dates.ts           deadlines as offsets from today, pinned to UTC so the demo doesn't rot
```

## Design notes

Palette is ink / paper / a ledger green for money and a muted amber reserved
*exclusively* for "someone else is holding this up." Deadline pressure and
blocked-on-others share that color because to the student they're the same
feeling. Every dollar figure and day count is set in IBM Plex Mono — dollars in
mono read as a ledger, which is the mental model of someone tracking money in
play, and it makes the summary strip scannable in a way proportional figures
aren't.

Unannounced quality floor: visible focus rings, `prefers-reduced-motion`
respected, semantic buttons for everything clickable, no layout break at 900px,
no console errors.

## Built with Claude Code

Written end-to-end with Claude Code, driven from a spec I wrote first — data
model, layout, interaction list, and the order to cut things in if I ran long.
That's the workflow I'd bring to the role: the leverage is in specifying the
product tightly enough that the agent's output is reviewable, then verifying
the running app rather than the diff. The four interactions above were driven
and screenshotted in a headless browser before this README was written; the
state-transition edge cases — hero promotion, empty states, filter counts after
a mutation — were checked that way, not by reading the code.

_Time: ~2 hours._
