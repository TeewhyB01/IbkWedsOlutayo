import Link from "next/link";
import type { ReactNode } from "react";

import { AdminSignOut } from "@/components/admin/AdminSignOut";
import { DataPersistenceNotice } from "@/components/admin/DataPersistenceNotice";
import { couple } from "@/content/siteContent";
import { getCurrentAdminUser } from "@/lib/adminSession";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/guests", label: "Guests" },
  { href: "/admin/invitations", label: "Invitations" },
  { href: "/admin/rsvps", label: "RSVPs" },
];

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentAdminUser();

  return (
    <div className="min-h-screen bg-ivory">
      {user ? (
        <header className="sticky top-0 z-40 border-b border-gold/20 bg-ivory/90 backdrop-blur-xl">
          <div className="mx-auto flex min-h-20 max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-emerald to-burgundy font-serif text-lg font-semibold text-ivory">
                {couple.monogram}
              </span>
              <span>
                <span className="block font-serif text-2xl font-semibold text-green">
                  Admin Dashboard
                </span>
                <span className="block text-xs text-muted">{user.email}</span>
              </span>
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              {adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-gold/24 px-4 py-2 text-sm font-semibold text-green transition hover:bg-cream"
                >
                  {link.label}
                </Link>
              ))}
              <AdminSignOut />
            </div>
          </div>
        </header>
      ) : null}
      {user ? <DataPersistenceNotice /> : null}
      {children}
    </div>
  );
}
