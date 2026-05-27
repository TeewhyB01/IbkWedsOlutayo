import Image from "next/image";
import type { Metadata } from "next";
import { Download, FileText, QrCode } from "lucide-react";

import { AdminLogin } from "@/components/admin/AdminLogin";
import { SaveTheDateTable } from "@/components/admin/SaveTheDateTable";
import { getAdminStats, getAllGuests } from "@/lib/adminData";
import { buildQrPayload, createInvitationQrCode } from "@/lib/invitations";
import { getCurrentAdminUser } from "@/lib/adminSession";

export const metadata: Metadata = {
  title: "Invitation Codes",
};

export default async function AdminInvitationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getCurrentAdminUser();

  if (!user) {
    return <AdminLogin />;
  }

  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const [stats, guests] = await Promise.all([getAdminStats(), getAllGuests()]);
  const sampleGuest = guests[0];
  const sampleQr = sampleGuest
    ? await createInvitationQrCode(buildQrPayload({ guest: sampleGuest }))
    : null;

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-gold">Save the Dates</p>
          <h1 className="mt-2 font-serif text-6xl font-semibold leading-none text-green">
            Code & Download Studio
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
            Generate one luxury save-the-date PDF for every invitation code.
            Downloading a PDF marks that invite as shared and locks the download.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Total Codes" value={stats.totalInvitationCodes} />
          <Stat label="Downloaded" value={stats.sharedInvitationCodes} />
          <Stat label="Unshared" value={stats.unsharedInvitationCodes} />
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[1.5rem] border border-gold/22 bg-green p-6 text-ivory shadow-xl shadow-green/10">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full border border-white/14 bg-white/10 text-champagne">
              <FileText size={18} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne">
                Save-the-Date Logic
              </p>
              <h2 className="font-serif text-3xl font-semibold">
                One download per invite
              </h2>
            </div>
          </div>
          <p className="mt-5 text-sm leading-7 text-ivory/72">
            Codes shared now means save-the-date PDFs downloaded. Codes used
            means guests who have successfully submitted their RSVP. Codes
            unshared means PDFs that have not yet been downloaded.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MiniStat label="Codes used" value={stats.usedInvitationCodes} />
            <MiniStat label="Traditional" value={stats.attendingTraditional} />
            <MiniStat label="Grand Finale" value={stats.attendingFinale} />
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-gold/22 bg-white/76 p-6 shadow-xl shadow-gold/10">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-burgundy text-ivory">
              <QrCode size={19} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-burgundy">
                Guest QR Sample
              </p>
              <h2 className="font-serif text-3xl font-semibold text-green">
                Code-specific invitation QR
              </h2>
            </div>
          </div>

          {sampleGuest && sampleQr ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-[170px_1fr] sm:items-center">
              <Image
                src={sampleQr}
                alt="Sample invitation QR code"
                width={170}
                height={170}
                className="rounded-2xl border border-gold/20"
                unoptimized
              />
              <div>
                <p className="text-sm font-semibold text-green">
                  Sample code: {sampleGuest.invitation_code}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  The save-the-date PDF carries this same unique code. Guests
                  enter it on the RSVP page to unlock their invitation.
                </p>
                <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/24 bg-ivory px-4 py-2 text-xs font-semibold text-burgundy">
                  <Download size={14} /> PDF generated at download time
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-6 rounded-2xl border border-gold/18 bg-ivory p-5 text-sm text-muted">
              No invitation code records available yet.
            </p>
          )}
        </section>
      </div>

      <SaveTheDateTable guests={guests} page={Number.isFinite(page) ? page : 1} />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-[1.25rem] border border-gold/22 bg-white/76 p-5 shadow-xl shadow-gold/10">
      <p className="text-xs font-semibold uppercase text-muted">{label}</p>
      <p className="mt-3 font-serif text-5xl font-semibold text-green">{value}</p>
    </article>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-2xl border border-white/12 bg-white/10 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-champagne">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl font-semibold text-ivory">{value}</p>
    </article>
  );
}
