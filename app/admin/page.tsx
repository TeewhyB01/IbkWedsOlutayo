import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminStats } from "@/components/admin/AdminStats";
import { ButtonLink } from "@/components/ui/Button";
import { getAdminStats, getAllGuests, getAllRsvps } from "@/lib/adminData";
import { getCurrentAdminUser } from "@/lib/adminSession";
import { formatRelativeTime } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin",
};

const guestSnapshotPageSize = 10;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ guestsPage?: string }>;
}) {
  const user = await getCurrentAdminUser();

  if (!user) {
    return <AdminLogin />;
  }

  const params = await searchParams;
  const requestedGuestPage = Number(params.guestsPage ?? "1");
  const [stats, guests, rsvps] = await Promise.all([
    getAdminStats(),
    getAllGuests(),
    getAllRsvps(),
  ]);

  const recentRsvps = rsvps.slice(0, 5);
  const guestTotalPages = Math.max(
    Math.ceil(guests.length / guestSnapshotPageSize),
    1,
  );
  const guestPage = Number.isFinite(requestedGuestPage)
    ? Math.min(Math.max(requestedGuestPage, 1), guestTotalPages)
    : 1;
  const guestStart = (guestPage - 1) * guestSnapshotPageSize;
  const paginatedGuests = guests.slice(
    guestStart,
    guestStart + guestSnapshotPageSize,
  );

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-gold">Overview</p>
          <h1 className="mt-2 font-serif text-6xl font-semibold leading-none text-green">
            Wedding Admin
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
            Manage invitation codes, view RSVP responses, and keep guest counts
            tidy as the wedding weekend approaches.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/admin/guests" variant="secondary">
            Manage Guests
          </ButtonLink>
          <ButtonLink href="/admin/invitations" variant="secondary">
            Invitation Codes
          </ButtonLink>
          <ButtonLink href="/admin/rsvps" variant="primary">
            View RSVPs
          </ButtonLink>
        </div>
      </div>

      <div className="mt-10">
        <AdminStats stats={stats} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <section className="rounded-[1.5rem] border border-gold/22 bg-white/74 p-6 shadow-xl shadow-gold/10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-4xl font-semibold text-green">Recent RSVPs</h2>
            <Link href="/admin/rsvps" className="text-sm font-semibold text-burgundy">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentRsvps.length > 0 ? (
              recentRsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="rounded-2xl border border-gold/14 bg-ivory/70 p-4 text-sm"
                >
                  <p className="font-semibold text-green">{rsvp.full_name}</p>
                  <p className="mt-1 text-muted">
                    {rsvp.guest_count} guest(s) / Traditional:{" "}
                    {rsvp.attending_traditional ? "Yes" : "No"} / Finale:{" "}
                    {rsvp.attending_finale ? "Yes" : "No"}
                  </p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-burgundy">
                    {formatRelativeTime(rsvp.submitted_at)}
                  </p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-gold/14 bg-ivory/70 p-5 text-sm text-muted">
                No RSVP responses yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-gold/22 bg-green p-6 text-ivory shadow-xl shadow-green/10">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-4xl font-semibold">Guest List Snapshot</h2>
              <p className="mt-4 text-sm leading-7 text-ivory/72">
                {guests.length} invitation records are currently available to the dashboard.
              </p>
            </div>
            <p className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-semibold text-champagne">
              Page {guestPage} of {guestTotalPages}
            </p>
          </div>
          <div className="mt-6 space-y-3">
            {paginatedGuests.map((guest, index) => (
              <div key={guest.id} className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="font-semibold">
                  {guestStart + index + 1}. {guest.guest_name}
                </p>
                <p className="mt-1 text-xs text-ivory/65">
                  {guest.invitation_code} / {guest.allowed_guest_count} seat(s) /{" "}
                  {guest.invitation_type} /{" "}
                  {guest.save_the_date_downloaded_at ? "shared" : "unshared"}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <SnapshotLink disabled={guestPage <= 1} page={guestPage - 1}>
              Previous
            </SnapshotLink>
            <SnapshotLink disabled={guestPage >= guestTotalPages} page={guestPage + 1}>
              Next
            </SnapshotLink>
          </div>
        </section>
      </div>
    </main>
  );
}

function SnapshotLink({
  page,
  disabled,
  children,
}: {
  page: number;
  disabled: boolean;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <span className="rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-ivory/45">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={`/admin?guestsPage=${page}`}
      className="rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-semibold text-ivory transition hover:bg-white/16"
    >
      {children}
    </Link>
  );
}
