import { ReactNode } from "react";
import { redirect } from "next/navigation";

// Demo-only: very naive check based on query string token existence.
// In real implementation, replace with proper auth/session handling.
const isAuthenticated = () => {
  // This is intentionally trivial for demo; no persistence.
  return true;
};

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
    redirect("/login");
  }
  return <>{children}</>;
}

