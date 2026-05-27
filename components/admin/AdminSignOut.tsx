"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminSignOut() {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-gold/30 px-4 text-sm font-semibold text-green transition hover:bg-cream"
    >
      <LogOut size={16} /> Sign Out
    </button>
  );
}
