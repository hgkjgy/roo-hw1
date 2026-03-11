export type DemoRole = "admin" | "manager" | "employee" | "guest";

export type DemoUser = {
  email: string;
  role: DemoRole;
};

const STORAGE_KEY = "demo-auth-user";

const DEMO_USERS: Record<string, DemoRole> = {
  "admin@test.com": "admin",
  "manager@test.com": "manager",
  "employee@test.com": "employee",
};

export function inferRoleFromEmail(email: string): DemoRole {
  const found = DEMO_USERS[email.toLowerCase()];
  return found ?? "guest";
}

export function getDemoUserByEmail(email: string): DemoUser | null {
  if (!email) return null;
  const role = inferRoleFromEmail(email);
  if (role === "guest") return null;
  return { email, role };
}

export function saveDemoUser(user: DemoUser) {
  if (typeof window === "undefined" || !user) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn("Failed to persist demo user", e);
  }
}

export function readDemoUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoUser;
    if (!parsed?.email) return null;
    const role = inferRoleFromEmail(parsed.email);
    if (role === "guest") return null;
    return { email: parsed.email, role };
  } catch (e) {
    console.warn("Failed to read demo user", e);
    return null;
  }
}

export function clearDemoUser() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("Failed to clear demo user", e);
  }
}

export function getDemoUsersList(): DemoUser[] {
  return Object.entries(DEMO_USERS).map(([email, role]) => ({ email, role }));
}
