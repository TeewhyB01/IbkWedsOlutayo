"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok || !data?.success) {
      setMessage(data?.message ?? "We could not sign you in.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-green px-5 py-12 text-ivory sm:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl place-items-center">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-[1.75rem] border border-white/14 bg-white/10 p-7 shadow-2xl shadow-black/20 backdrop-blur-md"
        >
          <div className="mb-6 grid size-14 place-items-center rounded-full bg-champagne text-green">
            <LockKeyhole size={24} />
          </div>
          <h1 className="font-serif text-5xl font-semibold">Admin Login</h1>
          <p className="mt-4 text-sm leading-7 text-ivory/72">
            Enter the admin password to manage save-the-dates, invitation codes,
            guests, and RSVP responses.
          </p>
          <label className="mt-7 block text-sm font-semibold">
            Password
            <input
              className="mt-2 min-h-12 w-full rounded-2xl border border-white/16 bg-white/12 px-4 text-sm text-ivory outline-none transition placeholder:text-ivory/40 focus:border-champagne focus:ring-4 focus:ring-champagne/14"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {message ? <p className="mt-4 text-sm font-semibold text-champagne">{message}</p> : null}
          <Button type="submit" variant="light" className="mt-6 w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
