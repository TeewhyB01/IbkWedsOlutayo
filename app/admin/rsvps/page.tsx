import Link from "next/link";
import type { Metadata } from "next";

import { AdminLogin } from "@/components/admin/AdminLogin";
import { RSVPTable } from "@/components/admin/RSVPTable";
import { ButtonLink } from "@/components/ui/Button";
import { getAllRsvps } from "@/lib/adminData";
import { getCurrentAdminUser } from "@/lib/adminSession";

export const metadata: Metadata = {
  title: "Admin RSVPs",
};

const filters = [
  { label: "All", href: "/admin/rsvps" },
  { label: "Traditional", href: "/admin/rsvps?event=traditional" },
  { label: "Grand Finale", href: "/admin/rsvps?event=finale" },
  { label: "Not Attending", href: "/admin/rsvps?event=not-attending" },
];

export default async function AdminRsvpsPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const user = await getCurrentAdminUser();

  if (!user) {
    return <AdminLogin />;
  }

  const params = await searchParams;
  const filter = params.event;
  const rsvps = await getAllRsvps();
  const filtered = rsvps.filter((rsvp) => {
    if (filter === "traditional") return rsvp.attending_traditional;
    if (filter === "finale") return rsvp.attending_finale;
    if (filter === "not-attending") {
      return !rsvp.attending_traditional && !rsvp.attending_finale;
    }

    return true;
  });

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-gold">RSVP Responses</p>
          <h1 className="mt-2 font-serif text-6xl font-semibold leading-none text-green">
            Guest Responses
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
            Review attendance, meal preferences, dietary notes, song requests,
            and messages from guests.
          </p>
        </div>
        <ButtonLink href={`/api/admin/export${filter ? `?event=${filter}` : ""}`} variant="primary">
          Export CSV
        </ButtonLink>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-gold/24 bg-white/64 px-4 py-2 text-sm font-semibold text-green transition hover:bg-cream"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <RSVPTable rsvps={filtered} />
    </main>
  );
}
