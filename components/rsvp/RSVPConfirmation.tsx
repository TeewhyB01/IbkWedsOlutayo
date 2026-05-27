"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/Button";

export type RSVPConfirmationData = {
  guestName: string;
  attendingTraditional: boolean;
  attendingFinale: boolean;
  guestCount: number;
  invitationCode?: string;
  emailStatus?: "sent" | "mocked" | "skipped" | "failed";
  emailTo?: string | null;
  emailMessage?: string;
  qrCodeDataUrl?: string;
  invitationCardUrl?: string;
};

export function RSVPConfirmation({
  confirmation,
  onAddAnother,
}: {
  confirmation: RSVPConfirmationData;
  onAddAnother: () => void;
}) {
  const events = [
    confirmation.attendingTraditional ? "Traditional Wedding" : null,
    confirmation.attendingFinale ? "The Grand Finale" : null,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-gold/24 bg-white/76 p-8 text-center shadow-2xl shadow-gold/12 backdrop-blur-sm">
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-green text-ivory">
        <CheckCircle2 size={30} />
      </div>
      <h2 className="mt-6 font-serif text-5xl font-semibold leading-none text-green">
        Thank you. Your RSVP has been received.
      </h2>
      <dl className="mx-auto mt-7 grid max-w-lg gap-4 text-left text-sm sm:grid-cols-2">
        <div className="rounded-2xl border border-gold/18 bg-ivory/80 p-4">
          <dt className="font-semibold text-green">Guest Name</dt>
          <dd className="mt-1 text-muted">{confirmation.guestName}</dd>
        </div>
        <div className="rounded-2xl border border-gold/18 bg-ivory/80 p-4">
          <dt className="font-semibold text-green">Guests</dt>
          <dd className="mt-1 text-muted">{confirmation.guestCount}</dd>
        </div>
        <div className="rounded-2xl border border-gold/18 bg-ivory/80 p-4 sm:col-span-2">
          <dt className="font-semibold text-green">Events Attending</dt>
          <dd className="mt-1 text-muted">
            {events.length > 0 ? events.join(", ") : "Not attending"}
          </dd>
        </div>
      </dl>
      {confirmation.qrCodeDataUrl ? (
        <div className="mx-auto mt-7 grid max-w-2xl gap-5 rounded-[1.35rem] border border-gold/20 bg-ivory/80 p-5 text-left sm:grid-cols-[180px_1fr] sm:items-center">
          <Image
            src={confirmation.qrCodeDataUrl}
            alt="Guest invitation QR code"
            width={180}
            height={180}
            className="mx-auto rounded-2xl border border-gold/20"
            unoptimized
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-burgundy">
              Invitation QR
            </p>
            <h3 className="mt-2 font-serif text-3xl font-semibold text-green">
              Code {confirmation.invitationCode}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted">
              {confirmation.emailStatus === "sent" && confirmation.emailTo
                ? `Your QR code and invitation card have been sent to ${confirmation.emailTo}.`
                : confirmation.emailStatus === "mocked"
                  ? "Email sending is in sample mode. The QR code and invitation email have been generated and are ready to connect to an email provider."
                  : confirmation.emailMessage ??
                    "This QR code is specific to your invitation and RSVP."}
            </p>
            {confirmation.invitationCardUrl ? (
              <a
                href={confirmation.invitationCardUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex text-sm font-semibold text-burgundy underline-offset-4 hover:underline"
              >
                View sample invitation card
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
      <Button type="button" variant="secondary" className="mt-7" onClick={onAddAnother}>
        Add another RSVP
      </Button>
    </div>
  );
}
