import type { AdminStats as AdminStatsType } from "@/lib/adminData";

const labels: Array<[keyof AdminStatsType, string]> = [
  ["totalInvitationCodes", "Total invitation codes"],
  ["sharedInvitationCodes", "Save-the-dates downloaded"],
  ["usedInvitationCodes", "Codes used for RSVP"],
  ["unsharedInvitationCodes", "Save-the-dates unshared"],
  ["totalInvitedGuests", "Total invited guests"],
  ["totalRsvpsSubmitted", "RSVPs submitted"],
  ["attendingTraditional", "Attending Traditional"],
  ["attendingFinale", "Attending Grand Finale"],
  ["notAttending", "Not attending"],
  ["pendingRsvp", "Pending RSVP"],
  ["totalExpectedGuestCount", "Expected guest count"],
];

export function AdminStats({ stats }: { stats: AdminStatsType }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {labels.map(([key, label]) => (
        <article
          key={key}
          className="rounded-[1.25rem] border border-gold/22 bg-white/74 p-5 shadow-xl shadow-gold/10"
        >
          <p className="text-xs font-semibold uppercase text-muted">{label}</p>
          <p className="mt-3 font-serif text-5xl font-semibold text-green">
            {stats[key]}
          </p>
        </article>
      ))}
    </div>
  );
}
