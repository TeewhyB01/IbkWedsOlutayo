import { NextResponse, type NextRequest } from "next/server";

import { checkRateLimit } from "@/lib/rateLimit";
import {
  findGuestByInvitationCode,
  toPublicGuest,
  usedCodeMessage,
} from "@/lib/rsvpData";
import { formatDeadline, isRsvpClosed } from "@/lib/utils";
import { invitationCodeSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    request.headers.get("x-real-ip") ??
    "local";

  if (!checkRateLimit(`validate:${ip}`)) {
    return NextResponse.json(
      {
        valid: false,
        message: "Too many attempts. Please wait a minute and try again.",
      },
      { status: 429 },
    );
  }

  if (isRsvpClosed()) {
    return NextResponse.json(
      {
        valid: false,
        closed: true,
        message: `RSVPs are now closed. The RSVP deadline was ${formatDeadline()}. Please contact the couple directly for any changes.`,
      },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = invitationCodeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        valid: false,
        message:
          parsed.error.issues[0]?.message ??
          "Please enter the invitation code sent with your invitation.",
      },
      { status: 400 },
    );
  }

  const result = await findGuestByInvitationCode(parsed.data.code);

  if (!result.guest) {
    return NextResponse.json(
      {
        valid: false,
        message:
          result.error ??
          "We could not find this invitation code. Please check your invite and try again.",
      },
      { status: 404 },
    );
  }

  if (result.existingRsvp) {
    return NextResponse.json(
      {
        valid: false,
        message: usedCodeMessage,
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    valid: true,
    guest: toPublicGuest(result.guest),
  });
}
