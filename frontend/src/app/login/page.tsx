"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getDemoUserByEmail, saveDemoUser, readDemoUser } from "@/lib/demo-auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUrl = useMemo(() => "http://localhost:3001/api/v1/auth/login", []);

  // If already logged in (demo), redirect to dashboard (client-only)
  useEffect(() => {
    const existing = readDemoUser();
    if (existing) {
      router.replace("/dashboard");
    }
  }, [router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const demoUser = getDemoUserByEmail(email);
      if (!demoUser) {
        throw new Error("Demo account not found");
      }

      const resp = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!resp.ok) {
        let message = "Login failed";
        try {
          const maybeJson = await resp.json();
          const msg = (maybeJson?.message as string) ?? message;
          message = Array.isArray(maybeJson?.message) ? maybeJson.message.join(", ") : msg;
        } catch (jsonErr) {
          const text = await resp.text();
          const trimmed = text.trim();
          if (trimmed && !trimmed.startsWith("<")) {
            message = trimmed;
          }
        }
        throw new Error(message);
      }

      // Demo-only: persist mock auth user locally; tokens still not stored.
      saveDemoUser(demoUser);
      router.replace("/dashboard");
    } catch (err: any) {
      const friendly = err?.message?.startsWith("TypeError: Failed to fetch")
        ? "Cannot reach login API. Please check backend (http://localhost:3001) is running and CORS/network are allowed."
        : err?.message ?? "Login failed";
      setError(friendly);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded border px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded border px-3 py-2 text-sm"
              required
              minLength={8}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-500">
          Demo-only scaffold: no real authentication/session persistence. Tokens are not stored.
        </p>
      </div>
    </main>
  );
}

