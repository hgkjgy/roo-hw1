import { ReactNode } from "react";
import { redirect } from "next/navigation";

// NOTE: This is a scaffold. Replace isAuthenticated stub with real auth check.
const isAuthenticated = () => false;

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
    redirect("/login");
  }
  return <>{children}</>;
}

