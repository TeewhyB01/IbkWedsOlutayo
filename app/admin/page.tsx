import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminStats } from "@/components/admin/AdminStats";
import { ButtonLink } from "@/components/ui/Button";
import { getAdminStats, getAllRsvps } from "@/lib/adminData";
import { getCurrentAdminUser } from "@/lib/adminSession";
import { formatRelativeTime } from "@/lib/utils";
import type { RSVPRecord } from "@/types";

export const metadata: Metadata = {
  title: "Admin",
};

const registeredGuestsPageSize = 10;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ guestsPage?: string; registeredPage?: string }>;
}) {
  const user = await getCurrentAdminUser();

  if (!user) {
    return <AdminLogin />;
  }

  const params = await searchParams;
  const requestedGuestPage = Number(
    params.registeredPage ?? params.guestsPage ?? "1",
  );
  const [stats, rsvps] = await Promise.all([
    getAdminStats(),
    getAllRsvps(),
  ]);

  const recentRsvps = rsvps.slice(0, 10);
  const guestTotalPages = Math.max(
    Math.ceil(rsvps.length / registeredGuestsPageSize),
    1,
  );
  const guestPage = Number.isFinite(requestedGuestPage)
    ? Math.min(Math.max(requestedGuestPage, 1), guestTotalPages)
    : 1;
  const guestStart = (guestPage - 1) * registeredGuestsPageSize;
  const paginatedRegisteredGuests = rsvps.slice(
    guestStart,
    guestStart + registeredGuestsPageSize,
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
            <div>
              <h2 className="font-serif text-4xl font-semibold text-green">
                Latest Registered Guests
              </h2>
              <p className="mt-2 text-sm text-muted">
                The 10 most recent RSVP registrations.
              </p>
            </div>
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
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-green">{rsvp.full_name}</p>
                      <p className="mt-1 text-muted">
                        Code {rsvp.guests?.invitation_code ?? "N/A"} /{" "}
                        {rsvp.guest_count} guest(s)
                      </p>
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-burgundy">
                      {formatRelativeTime(rsvp.submitted_at)}
                    </p>
                  </div>
                  <p className="mt-3 text-xs leading-6 text-muted">
                    Email: {rsvp.email ?? "Not provided"} / Phone:{" "}
                    {rsvp.phone ?? "Not provided"}
                  </p>
                  <p className="mt-1 text-xs leading-6 text-muted">
                    Category: {formatRsvpCategory(rsvp)}
                  </p>
                  <p className="mt-1 text-xs leading-6 text-muted">
                    Traditional Wedding: {rsvp.attending_traditional ? "Yes" : "No"} / Grand
                    Finale: {rsvp.attending_finale ? "Yes" : "No"}
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
                {rsvps.length} registered guest record{rsvps.length === 1 ? "" : "s"} with
                contact details, attendance, and notes.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/api/admin/export/registered-guests"
                className="rounded-full border border-champagne/60 bg-champagne px-4 py-2 text-xs font-semibold text-green transition hover:bg-ivory"
              >
                Download Excel
              </Link>
              <p className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-semibold text-champagne">
                Page {guestPage} of {guestTotalPages}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {paginatedRegisteredGuests.length > 0 ? (
              paginatedRegisteredGuests.map((rsvp, index) => {
                const notes = getRsvpNotes(rsvp);

                return (
                  <div
                    key={rsvp.id}
                    className="rounded-2xl border border-white/12 bg-white/10 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold">
                          {guestStart + index + 1}. {rsvp.full_name}
                        </p>
                        <p className="mt-1 text-xs text-ivory/65">
                          Invited as {rsvp.guests?.guest_name ?? "N/A"} / Code{" "}
                          {rsvp.guests?.invitation_code ?? "N/A"}
                        </p>
                      </div>
                      <p className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs font-semibold text-champagne">
                        {formatRelativeTime(rsvp.submitted_at)}
                      </p>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs leading-6 text-ivory/72 md:grid-cols-2">
                      <p>Email: {rsvp.email ?? "Not provided"}</p>
                      <p>Phone: {rsvp.phone ?? "Not provided"}</p>
                      <p>Category: {formatRsvpCategory(rsvp)}</p>
                      <p>Guests attending: {rsvp.guest_count}</p>
                      <p>
                        Events: {rsvp.attending_traditional ? "Traditional Wedding" : ""}
                        {rsvp.attending_traditional && rsvp.attending_finale ? " + " : ""}
                        {rsvp.attending_finale ? "Grand Finale" : ""}
                        {!rsvp.attending_traditional && !rsvp.attending_finale
                          ? "Not attending"
                          : ""}
                      </p>
                    </div>
                    <div className="mt-3 rounded-xl border border-white/10 bg-black/10 p-3 text-xs leading-6 text-ivory/72">
                      <p className="font-semibold uppercase tracking-[0.14em] text-champagne">
                        Notes
                      </p>
                      <p className="mt-1">{notes}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="rounded-2xl border border-white/12 bg-white/10 p-5 text-sm text-ivory/72">
                No registered guests yet.
              </p>
            )}
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

function getRsvpNotes(rsvp: RSVPRecord) {
  const notes = [
    rsvp.guest_category ? `Category: ${formatRsvpCategory(rsvp)}` : null,
    rsvp.meal_preference ? `Meal: ${rsvp.meal_preference}` : null,
    rsvp.allergies ? `Dietary: ${rsvp.allergies}` : null,
    rsvp.song_request ? `Song: ${rsvp.song_request}` : null,
    rsvp.message_to_couple ? `Message: ${rsvp.message_to_couple}` : null,
  ].filter(Boolean);

  return notes.length > 0 ? notes.join(" / ") : "No notes added.";
}

function formatRsvpCategory(rsvp: RSVPRecord) {
  if (!rsvp.guest_category) {
    return "Not provided";
  }

  if (rsvp.guest_category === "Others" && rsvp.guest_category_other) {
    return `Others - ${rsvp.guest_category_other}`;
  }

  return rsvp.guest_category;
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
      href={`/admin?registeredPage=${page}`}
      className="rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-semibold text-ivory transition hover:bg-white/16"
    >
      {children}
    </Link>
  );
}
