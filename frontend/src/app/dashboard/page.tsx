"use client";

import { useMemo, useState } from "react";

type Role = "admin" | "manager" | "employee" | "guest";

type TaskStatus = "todo" | "in_progress" | "done";

type Task = {
  id: string;
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
};

const DEMO_USERS: Record<string, Role> = {
  "admin@test.com": "admin",
  "manager@test.com": "manager",
  "employee@test.com": "employee",
};

const seedTasks: Task[] = [
  { id: "t1", title: "Prepare monthly report", assignee: "manager@test.com", status: "in_progress", priority: "high" },
  { id: "t2", title: "Update client deck", assignee: "employee@test.com", status: "todo", priority: "medium" },
  { id: "t3", title: "Data cleanup", assignee: "employee@test.com", status: "done", priority: "low" },
  { id: "t4", title: "Security checklist", assignee: "admin@test.com", status: "in_progress", priority: "high" },
];

function deriveRole(email: string): Role {
  const found = DEMO_USERS[email.toLowerCase()];
  return found ?? "guest";
}

function roleLabel(role: Role) {
  return {
    admin: "Admin View",
    manager: "Manager View",
    employee: "Employee View",
    guest: "Guest View",
  }[role];
}

function SummaryChips({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      <span className="rounded-full bg-slate-100 px-3 py-1">Total: {total}</span>
      <span className="rounded-full bg-green-100 text-green-800 px-3 py-1">Done: {done}</span>
      <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-1">In Progress: {inProgress}</span>
      <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1">Todo: {todo}</span>
    </div>
  );
}

function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
          <div>
            <p className="font-medium">{task.title}</p>
            <p className="text-xs text-gray-500">Assignee: {task.assignee}</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded bg-slate-100 px-2 py-1">{task.priority}</span>
            <span
              className={
                "rounded px-2 py-1 " +
                (task.status === "done"
                  ? "bg-green-100 text-green-800"
                  : task.status === "in_progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-amber-100 text-amber-800")
              }
            >
              {task.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { email?: string };
}) {
  const email = (searchParams?.email || "demo@test.com").trim();
  const role = useMemo<Role>(() => deriveRole(email), [email]);

  const [tasks] = useState<Task[]>(seedTasks);

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl space-y-4">
        <header className="flex flex-col gap-2 rounded border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Demo Dashboard</h1>
            <p className="text-xs text-gray-500">Demo-only local state. No backend tasks.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-100 px-3 py-1">Email: {email}</span>
            <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-1">Role: {role}</span>
            <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1">Demo mode</span>
          </div>
        </header>

        <section className="rounded border bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current view</p>
              <p className="text-lg font-semibold">{roleLabel(role)}</p>
            </div>
          </div>
          <SummaryChips tasks={tasks} />
        </section>

        <section className="rounded border bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Seeded tasks (read-only for now)</p>
            <p className="text-xs text-gray-500">Commit 1 scaffold</p>
          </div>
          <TaskList tasks={tasks} />
        </section>
      </div>
    </main>
  );
}

