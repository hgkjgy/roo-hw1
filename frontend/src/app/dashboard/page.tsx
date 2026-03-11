export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { email?: string };
}) {
  const email = searchParams?.email || "demo@test.com";

  const role = (() => {
    if (email.toLowerCase() === "admin@test.com") return "admin";
    if (email.toLowerCase() === "manager@test.com") return "manager";
    if (email.toLowerCase() === "employee@test.com") return "employee";
    return "guest";
  })();

  const view = {
    admin: "Admin View",
    manager: "Manager View",
    employee: "Employee View",
    guest: "Guest View",
  }[role];

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="rounded border bg-white p-8 shadow-sm text-center space-y-3 max-w-lg">
        <h1 className="text-2xl font-semibold">Demo Dashboard</h1>
        <p className="text-sm text-gray-700">Current user: {email}</p>
        <p className="text-sm text-gray-700">Role: {role}</p>
        <p className="text-base font-semibold text-blue-700">{view}</p>
        <p className="text-xs text-gray-500">Demo mode only. No real authentication or data.</p>
      </div>
    </main>
  );
}

