"use client";

import { AuthForm } from "@/components/auth/AuthForm";

export default function AuthPage() {
  // Get the tab from the URL query parameter
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const tabParam = searchParams.get("tab");
  const defaultTab = tabParam === "signup" ? "signup" : "signin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">TempoBook</h1>
          <p className="text-muted-foreground mt-2">
            Booking system for service businesses
          </p>
        </div>

        <AuthForm defaultTab={defaultTab as "signin" | "signup"} />
      </div>
    </div>
  );
}
