"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

const DEMO_USER_LIST = [
  { email: "admin@test.com", role: "admin" as Role },
  { email: "manager@test.com", role: "manager" as Role },
  { email: "employee@test.com", role: "employee" as Role },
];

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

function statusLabel(status: TaskStatus) {
  return {
    todo: "To do",
    in_progress: "In progress",
    done: "Done",
  }[status];
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

function StatusPill({ status }: { status: TaskStatus }) {
  const cls =
    status === "done"
      ? "bg-green-100 text-green-800"
      : status === "in_progress"
        ? "bg-blue-100 text-blue-800"
        : "bg-amber-100 text-amber-800";
  return <span className={`rounded px-2 py-1 text-xs ${cls}`}>{statusLabel(status)}</span>;
}

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-center justify-between rounded border px-3 py-2 text-sm">
      <div>
        <p className="font-medium">{task.title}</p>
        <p className="text-xs text-gray-500">Assignee: {task.assignee}</p>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="rounded bg-slate-100 px-2 py-1">{task.priority}</span>
        <StatusPill status={task.status} />
      </div>
    </div>
  );
}

function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </div>
  );
}

function EmployeeTasks({ tasks, onChange }: { tasks: Task[]; onChange: (tasks: Task[]) => void }) {
  const myTasks = tasks.filter((t) => t.assignee.toLowerCase() === "employee@test.com");

  const updateStatus = (id: string, status: TaskStatus) => {
    onChange(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const total = myTasks.length;
  const completed = myTasks.filter((t) => t.status === "done").length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">My Tasks</p>
          <p className="text-xs text-gray-500">Employee view — local state only</p>
        </div>
        <div className="text-xs text-gray-700">Total: {total} · Completed: {completed}</div>
      </div>

      <div className="space-y-2">
        {myTasks.map((task) => (
          <div key={task.id} className="rounded border p-3 text-sm space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-gray-500">Priority: {task.priority}</p>
              </div>
              <StatusPill status={task.status} />
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                className={`rounded border px-2 py-1 ${task.status === "todo" ? "border-blue-500 text-blue-600" : "border-slate-200 text-slate-700"}`}
                onClick={() => updateStatus(task.id, "todo")}
              >
                Mark To do
              </button>
              <button
                className={`rounded border px-2 py-1 ${task.status === "in_progress" ? "border-blue-500 text-blue-600" : "border-slate-200 text-slate-700"}`}
                onClick={() => updateStatus(task.id, "in_progress")}
              >
                Mark In progress
              </button>
              <button
                className={`rounded border px-2 py-1 ${task.status === "done" ? "border-blue-500 text-blue-600" : "border-slate-200 text-slate-700"}`}
                onClick={() => updateStatus(task.id, "done")}
              >
                Mark Done
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManagerAdminTasks({
  tasks,
  onChange,
  role,
}: {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
  role: Role;
}) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("employee@test.com");
  const [status, setStatus] = useState<TaskStatus>("todo");

  const updateStatus = (id: string, newStatus: TaskStatus) => {
    onChange(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const addTask = () => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: `t-${Date.now()}`,
      title: title.trim(),
      assignee,
      status,
      priority: "medium",
    };
    onChange([newTask, ...tasks]);
    setTitle("");
    setStatus("todo");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{role === "admin" ? "System Overview" : "Team Tasks Overview"}</p>
          <p className="text-xs text-gray-500">Local-only task management for demo</p>
        </div>
        <div className="text-xs text-gray-700">Shared stats · Total {tasks.length}</div>
      </div>

      <SummaryChips tasks={tasks} />

      <div className="rounded border bg-slate-50 p-3 space-y-2">
        <p className="text-xs font-semibold text-gray-700">Create demo task</p>
        <div className="grid gap-2 sm:grid-cols-3">
          <input
            className="rounded border px-3 py-2 text-sm"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className="rounded border px-3 py-2 text-sm"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            {DEMO_USER_LIST.map((u) => (
              <option key={u.email} value={u.email}>
                {u.email} ({u.role})
              </option>
            ))}
          </select>
          <select
            className="rounded border px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            onClick={addTask}
            disabled={!title.trim()}
          >
            Add demo task
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="rounded border p-3 text-sm space-y-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-gray-500">Assignee: {task.assignee}</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded bg-slate-100 px-2 py-1">{task.priority}</span>
                <StatusPill status={task.status} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <label className="flex items-center gap-1">
                <span className="text-[11px] text-gray-500">Status</span>
                <select
                  className="rounded border px-2 py-1 text-xs"
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value as TaskStatus)}
                >
                  <option value="todo">To do</option>
                  <option value="in_progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { email?: string };
}) {
  const router = useRouter();
  const email = (searchParams?.email || "demo@test.com").trim();
  const role = useMemo<Role>(() => deriveRole(email), [email]);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-4xl space-y-4">
        <header className="flex flex-col gap-2 rounded border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Demo Dashboard</h1>
            <p className="text-xs text-gray-500">Demo-only local state. No backend tasks.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs items-center">
            <span className="rounded-full bg-slate-100 px-3 py-1">Email: {email}</span>
            <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-1">Role: {role}</span>
            <span className="rounded-full bg-amber-100 text-amber-800 px-3 py-1">Demo mode</span>
            <button
              className="rounded border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => router.replace("/login")}
            >
              Logout
            </button>
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
            <p className="text-sm font-semibold">Seeded tasks</p>
            <p className="text-xs text-gray-500">Commit 2: employee actions</p>
          </div>
          <TaskList tasks={tasks} />
        </section>

        {role === "employee" && (
          <section className="rounded border bg-white p-4 shadow-sm space-y-3">
            <EmployeeTasks tasks={tasks} onChange={setTasks} />
          </section>
        )}

        {(role === "manager" || role === "admin") && (
          <section className="rounded border bg-white p-4 shadow-sm space-y-3">
            <ManagerAdminTasks tasks={tasks} onChange={setTasks} role={role} />
          </section>
        )}

        {role === "admin" && (
          <section className="rounded border bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Demo users & roles</p>
              <p className="text-xs text-gray-500">Admin view</p>
            </div>
            <div className="space-y-2 text-sm">
              {DEMO_USER_LIST.map((u) => (
                <div key={u.email} className="flex items-center justify-between rounded border px-3 py-2">
                  <span>{u.email}</span>
                  <span className="rounded bg-slate-100 px-2 py-1 text-xs">{u.role}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

