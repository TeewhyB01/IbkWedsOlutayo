import { NextResponse } from "next/server";

import {
  createRsvp,
  findGuestById,
  findRsvpByGuestId,
  toPublicGuest,
  usedCodeMessage,
  validateInvitationScope,
} from "@/lib/rsvpData";
import { sendInvitationEmail } from "@/lib/invitations";
import { formatDeadline, isRsvpClosed } from "@/lib/utils";
import { submitRsvpSchema } from "@/lib/validations";

export async function POST(request: Request) {
  if (isRsvpClosed()) {
    return NextResponse.json(
      {
        success: false,
        message: `RSVPs are now closed. The RSVP deadline was ${formatDeadline()}. Please contact the couple directly for any changes.`,
      },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = submitRsvpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message:
          parsed.error.issues[0]?.message ??
          "Please check the RSVP form and try again.",
      },
      { status: 400 },
    );
  }

  const guest = await findGuestById(parsed.data.guestId);

  if (!guest) {
    return NextResponse.json(
      {
        success: false,
        message: "We could not confirm this invitation. Please check your code again.",
      },
      { status: 404 },
    );
  }

  if (parsed.data.guestCount > guest.allowed_guest_count) {
    return NextResponse.json(
      {
        success: false,
        message: `This invitation allows a maximum of ${guest.allowed_guest_count} guest(s).`,
      },
      { status: 400 },
    );
  }

  const scopeError = validateInvitationScope(
    guest.invitation_type,
    parsed.data.attendingTraditional,
    parsed.data.attendingFinale,
  );

  if (scopeError) {
    return NextResponse.json(
      {
        success: false,
        message: scopeError,
      },
      { status: 400 },
    );
  }

  try {
    const existingRsvp = await findRsvpByGuestId(guest.id);

    if (existingRsvp) {
      return NextResponse.json(
        {
          success: false,
          message: usedCodeMessage,
        },
        { status: 409 },
      );
    }

    const rsvp = await createRsvp(guest, parsed.data);
    const invitationEmail = await sendInvitationEmail({ guest, rsvp });

    return NextResponse.json({
      success: true,
      guest: toPublicGuest(guest, rsvp),
      confirmation: {
        guestName: parsed.data.fullName,
        attendingTraditional: parsed.data.attendingTraditional,
        attendingFinale: parsed.data.attendingFinale,
        guestCount: parsed.data.guestCount,
        invitationCode: guest.invitation_code,
        emailStatus: invitationEmail.status,
        emailTo: invitationEmail.to,
        emailMessage: invitationEmail.message,
        qrCodeDataUrl: invitationEmail.qrCodeDataUrl,
        invitationCardUrl: invitationEmail.invitationCardUrl,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "RSVP_ALREADY_EXISTS") {
      return NextResponse.json(
        {
          success: false,
          message: usedCodeMessage,
        },
        { status: 409 },
      );
    }

    console.error("RSVP submission failed", error);

    return NextResponse.json(
      {
        success: false,
        message: "We could not save your RSVP. Please try again.",
      },
      { status: 500 },
    );
  }
}
