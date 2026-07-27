import { dateInDays, timestampDaysAgo } from "./dates";
import type { Application } from "./types";

const done = (id: string, label: string) =>
  ({ id, label, status: "done", ownedBy: "student" }) as const;

const todo = (id: string, label: string) =>
  ({ id, label, status: "todo", ownedBy: "student" }) as const;

const waitingOn = (
  id: string,
  label: string,
  owner: string,
  requestedDaysAgo: number,
) =>
  ({
    id,
    label,
    status: "waiting",
    ownedBy: "other",
    owner,
    requestedAt: timestampDaysAgo(requestedDaysAgo),
    lastReminderSent: null,
  }) as const;

export const applications: Application[] = [
  {
    id: "cct",
    name: "Chicago Community Trust Leadership Award",
    sponsor: "The Chicago Community Trust",
    amount: 5000,
    deadline: dateInDays(3),
    status: "in_progress",
    requirements: [
      todo("cct-1", "Personal statement — 500 words"),
      waitingOn(
        "cct-2",
        "Letter of recommendation",
        "Prof. Vasquez",
        9,
      ),
      done("cct-3", "Official transcript"),
      done("cct-4", "FAFSA Student Aid Index"),
      done("cct-5", "Community service log"),
    ],
  },
  {
    id: "stem",
    name: "Illinois STEM Persistence Scholarship",
    sponsor: "Illinois Board of Higher Education",
    amount: 3500,
    deadline: dateInDays(5),
    status: "draft",
    requirements: [
      todo("stem-1", "Short answer — why engineering (300 words)"),
      todo("stem-2", "Upload fall semester grade report"),
      waitingOn("stem-3", "Faculty recommendation", "Dr. Nnamdi", 14),
      done("stem-4", "Enrollment verification"),
    ],
  },
  {
    id: "rotary",
    name: "Rotary Club of Oak Park Merit Award",
    sponsor: "Rotary Club of Oak Park",
    amount: 2000,
    deadline: dateInDays(12),
    status: "in_progress",
    requirements: [
      todo("rotary-1", "Short answer — community impact (250 words)"),
      done("rotary-2", "Official transcript"),
      done("rotary-3", "Activities résumé"),
      done("rotary-4", "Two references listed"),
      done("rotary-5", "Enrollment verification"),
    ],
  },
  {
    id: "firstgen",
    name: "First-Gen Futures Grant",
    sponsor: "First-Gen Futures Foundation",
    amount: 7500,
    deadline: dateInDays(21),
    status: "in_progress",
    requirements: [
      todo("firstgen-1", "Essay — first in my family (750 words)"),
      todo("firstgen-2", "Household income worksheet"),
      waitingOn(
        "firstgen-3",
        "Official transcript",
        "Registrar's Office",
        2,
      ),
      done("firstgen-4", "FAFSA Student Aid Index"),
      done("firstgen-5", "Proof of first-generation status"),
    ],
  },
  {
    id: "ewe",
    name: "Evanston Women in Engineering Award",
    sponsor: "Evanston Engineering Alliance",
    amount: 10000,
    deadline: dateInDays(34),
    status: "draft",
    requirements: [
      todo("ewe-1", "Project portfolio — 3 pieces"),
      todo("ewe-2", "Essay — a problem worth solving (600 words)"),
      todo("ewe-3", "Official transcript"),
      todo("ewe-4", "Activities résumé"),
    ],
  },
  {
    id: "mllf",
    name: "Midwest Latino Leadership Fund",
    sponsor: "Midwest Latino Leadership Fund",
    amount: 4000,
    deadline: dateInDays(-4),
    status: "submitted",
    requirements: [
      done("mllf-1", "Personal statement — 500 words"),
      done("mllf-2", "Letter of recommendation — Prof. Vasquez"),
      done("mllf-3", "Official transcript"),
      done("mllf-4", "FAFSA Student Aid Index"),
    ],
  },
  {
    id: "hartwell",
    name: "Hartwell Family Foundation Scholarship",
    sponsor: "Hartwell Family Foundation",
    amount: 4500,
    deadline: dateInDays(-26),
    status: "awarded",
    requirements: [
      done("hartwell-1", "Personal statement — 400 words"),
      done("hartwell-2", "Letter of recommendation — Ms. Okafor"),
      done("hartwell-3", "Official transcript"),
    ],
  },
  {
    id: "natmerit",
    name: "National Merit Regional Scholarship",
    sponsor: "National Merit Scholarship Corporation",
    amount: 8000,
    deadline: dateInDays(-40),
    status: "not_selected",
    requirements: [
      done("natmerit-1", "Personal statement — 500 words"),
      done("natmerit-2", "Counselor recommendation"),
      done("natmerit-3", "Official transcript"),
      done("natmerit-4", "PSAT score report"),
    ],
  },
];
