import QRCode from "qrcode";

import { couple } from "@/content/siteContent";
import type { GuestRecord, RSVPRecord } from "@/types";

export type InvitationEmailResult = {
  status: "sent" | "mocked" | "skipped" | "failed";
  to: string | null;
  qrCodeDataUrl: string;
  qrPayload: string;
  invitationCardUrl: string;
  message: string;
};

type SendProviderResult = {
  status: "sent" | "failed";
  message: string;
};

export function buildQrPayload({
  guest,
  rsvp,
}: {
  guest: GuestRecord;
  rsvp?: RSVPRecord | null;
}) {
  return JSON.stringify({
    code: guest.invitation_code,
    guestId: guest.id,
    name: rsvp?.full_name ?? guest.guest_name,
    guestCount: rsvp?.guest_count ?? guest.allowed_guest_count,
    traditional: rsvp?.attending_traditional ?? null,
    finale: rsvp?.attending_finale ?? null,
    wedding: couple.hashtag,
  });
}

export async function createInvitationQrCode(payload: string) {
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    margin: 1,
    scale: 8,
    color: {
      dark: "#0b3d31",
      light: "#fbf6ec",
    },
  });
}

export function buildInvitationEmailHtml({
  guest,
  rsvp,
  qrCodeDataUrl,
  invitationCardUrl,
}: {
  guest: GuestRecord;
  rsvp?: RSVPRecord | null;
  qrCodeDataUrl: string;
  invitationCardUrl: string;
}) {
  const guestName = rsvp?.full_name ?? guest.guest_name;

  return `
    <div style="font-family: Manrope, Arial, sans-serif; color:#0b3d31; background:#fbf6ec; padding:32px;">
      <div style="max-width:640px; margin:0 auto; background:#fffaf0; border:1px solid #dcc58d; border-radius:28px; overflow:hidden;">
        <div style="background:linear-gradient(135deg,#7a1f35,#0b513f); color:#fbf6ec; padding:32px;">
          <p style="letter-spacing:.18em; text-transform:uppercase; font-size:12px; color:#e3c98f;">${couple.hashtag}</p>
          <h1 style="font-family: Georgia, serif; font-size:42px; line-height:.95; margin:12px 0 0;">Your wedding invitation</h1>
          <p style="margin:18px 0 0; color:rgba(251,246,236,.78);">Hello ${guestName}, thank you for confirming your RSVP.</p>
        </div>
        <div style="padding:30px;">
          <p style="font-size:14px; line-height:1.8;">Please present this QR code at guest check-in. It is linked to invitation code <strong>${guest.invitation_code}</strong>.</p>
          <div style="text-align:center; margin:28px 0;">
            <img src="${qrCodeDataUrl}" alt="Guest invitation QR code" width="220" height="220" style="border-radius:18px; border:1px solid #dcc58d;" />
          </div>
          <p style="font-size:14px; line-height:1.8;">Invitation card sample: <a href="${invitationCardUrl}" style="color:#7a1f35;">View invitation card</a></p>
          <p style="margin-top:28px; color:#6f6a5c; font-size:13px;">With love,<br/>Ibukunoluwa & Olutayo</p>
        </div>
      </div>
    </div>
  `;
}

export async function sendInvitationEmail({
  guest,
  rsvp,
}: {
  guest: GuestRecord;
  rsvp?: RSVPRecord | null;
}): Promise<InvitationEmailResult> {
  const qrPayload = buildQrPayload({ guest, rsvp });
  const qrCodeDataUrl = await createInvitationQrCode(qrPayload);
  const to = rsvp?.email ?? guest.email;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const invitationCardUrl = `${siteUrl}/images/wedding/invitation-card-sample.svg`;

  if (!to) {
    return {
      status: "skipped",
      to: null,
      qrCodeDataUrl,
      qrPayload,
      invitationCardUrl,
      message: "No email address is available for this guest.",
    };
  }

  const html = buildInvitationEmailHtml({
    guest,
    rsvp,
    qrCodeDataUrl,
    invitationCardUrl,
  });
  const subject = `${couple.hashtag} Wedding Invitation`;

  const resendResult = await sendWithResend({
    to,
    subject,
    html,
  });

  if (resendResult) {
    return {
      status: resendResult.status,
      to,
      qrCodeDataUrl,
      qrPayload,
      invitationCardUrl,
      message: resendResult.message,
    };
  }

  if (!process.env.INVITATION_EMAIL_WEBHOOK_URL) {
    return {
      status: "mocked",
      to,
      qrCodeDataUrl,
      qrPayload,
      invitationCardUrl,
      message:
        "Email payload prepared. Add RESEND_API_KEY and INVITATION_EMAIL_FROM, or INVITATION_EMAIL_WEBHOOK_URL, to send through your email provider.",
    };
  }

  const response = await fetch(process.env.INVITATION_EMAIL_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to,
      subject,
      html,
      qrPayload,
      invitationCode: guest.invitation_code,
    }),
  });

  if (!response.ok) {
    return {
      status: "failed",
      to,
      qrCodeDataUrl,
      qrPayload,
      invitationCardUrl,
      message: "The email provider did not accept the invitation email.",
    };
  }

  return {
    status: "sent",
    to,
    qrCodeDataUrl,
    qrPayload,
    invitationCardUrl,
    message: "Invitation email sent.",
  };
}

async function sendWithResend({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendProviderResult | null> {
  if (!process.env.RESEND_API_KEY || !process.env.INVITATION_EMAIL_FROM) {
    return null;
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: process.env.INVITATION_EMAIL_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    return {
      status: "failed",
      message: error.message ?? "Resend did not accept the invitation email.",
    };
  }

  return {
    status: "sent",
    message: `Invitation email sent via Resend${data?.id ? ` (${data.id})` : ""}.`,
  };
}
