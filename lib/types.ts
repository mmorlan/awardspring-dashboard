export type ReqStatus = "todo" | "done" | "waiting";

export type Requirement = {
  id: string;
  label: string; // "Letter of recommendation — Prof. Vasquez"
  status: ReqStatus;
  ownedBy: "student" | "other";
  owner?: string; // "Prof. Vasquez", "Registrar's Office"
  requestedAt?: string; // ISO timestamp — when the student first asked
  lastReminderSent?: string | null; // ISO timestamp, drives the reminder UI
};

export type AppStatus =
  | "draft"
  | "in_progress"
  | "submitted"
  | "awarded"
  | "not_selected";

export type Application = {
  id: string;
  name: string; // "Chicago Community Trust Leadership Award"
  sponsor: string;
  amount: number;
  deadline: string; // ISO date
  status: AppStatus;
  requirements: Requirement[];
};
