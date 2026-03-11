import { DemoRole } from "./demo-auth";

export type DemoTaskStatus = "todo" | "in_progress" | "done";

export type DemoTask = {
  id: string;
  title: string;
  assignee: string;
  status: DemoTaskStatus;
  priority: "low" | "medium" | "high";
};

const STORAGE_KEY = "demo-tasks";

const SEEDED_TASKS: DemoTask[] = [
  { id: "t1", title: "Prepare monthly report", assignee: "manager@test.com", status: "in_progress", priority: "high" },
  { id: "t2", title: "Update client deck", assignee: "employee@test.com", status: "todo", priority: "medium" },
  { id: "t3", title: "Data cleanup", assignee: "employee@test.com", status: "done", priority: "low" },
  { id: "t4", title: "Security checklist", assignee: "admin@test.com", status: "in_progress", priority: "high" },
];

export function getSeededTasks(): DemoTask[] {
  return [...SEEDED_TASKS];
}

function isValidTask(task: any): task is DemoTask {
  return (
    task &&
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.assignee === "string" &&
    (task.status === "todo" || task.status === "in_progress" || task.status === "done") &&
    (task.priority === "low" || task.priority === "medium" || task.priority === "high")
  );
}

function normalizeTasks(tasks: any): DemoTask[] | null {
  if (!Array.isArray(tasks)) return null;
  const cleaned = tasks.filter(isValidTask);
  return cleaned.length ? cleaned : null;
}

export function readDemoTasks(): DemoTask[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return normalizeTasks(parsed);
  } catch (e) {
    console.warn("Failed to read demo tasks", e);
    return null;
  }
}

export function saveDemoTasks(tasks: DemoTask[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn("Failed to save demo tasks", e);
  }
}

export function clearDemoTasks() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("Failed to clear demo tasks", e);
  }
}

export function getInitialDemoTasks(): DemoTask[] {
  const stored = readDemoTasks();
  if (stored) return stored;
  return getSeededTasks();
}
