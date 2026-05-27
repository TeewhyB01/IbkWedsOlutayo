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

type EmailAttachment = {
  filename: string;
  content: string;
  contentType?: string;
  contentId?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildQrPayload({
  guest,
  rsvp,
}: {
  guest: GuestRecord;
  rsvp?: RSVPRecord | null;
}) {
  const guestName = rsvp?.full_name ?? guest.guest_name;
  const checkInRef = `${guest.invitation_code}-${guest.id.slice(-6).toUpperCase()}`;

  return JSON.stringify({
    type: "becoming-the-bensons-check-in",
    version: 1,
    invitationCode: guest.invitation_code,
    checkInRef,
    guestId: guest.id,
    name: guestName,
    guestCount: rsvp?.guest_count ?? guest.allowed_guest_count,
    traditional: rsvp?.attending_traditional ?? null,
    finale: rsvp?.attending_finale ?? null,
    wedding: couple.hashtag,
    issuedAt: new Date().toISOString(),
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
  qrImageSrc,
  invitationCardUrl,
}: {
  guest: GuestRecord;
  rsvp?: RSVPRecord | null;
  qrCodeDataUrl: string;
  qrImageSrc?: string;
  invitationCardUrl: string;
}) {
  const guestName = escapeHtml(rsvp?.full_name ?? guest.guest_name);
  const invitationCode = escapeHtml(guest.invitation_code);
  const guestCount = rsvp?.guest_count ?? guest.allowed_guest_count;
  const attendingEvents = [
    rsvp?.attending_traditional ? "Traditional Wedding" : null,
    rsvp?.attending_finale ? "The Grand Finale" : null,
  ].filter(Boolean);
  const eventText = attendingEvents.length
    ? attendingEvents.join(" & ")
    : "Attendance details saved";
  const checkInRef = `${guest.invitation_code}-${guest.id.slice(-6).toUpperCase()}`;
  const qrSrc = qrImageSrc ?? qrCodeDataUrl;

  return `
    <div style="margin:0; padding:0; background:#f8f1e6;">
      <div style="display:none; overflow:hidden; line-height:1px; opacity:0; max-height:0; max-width:0;">Your ${couple.hashtag} RSVP is confirmed. Your personal QR code is inside.</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8f1e6; font-family:Arial, Helvetica, sans-serif; color:#143f34;">
        <tr>
          <td align="center" style="padding:34px 16px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px; background:#fffaf0; border:1px solid #dec88c;">
              <tr>
                <td style="background:#0b3d31; padding:34px 34px 28px; border-bottom:5px solid #7a1f35;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="font-family:Georgia, 'Times New Roman', serif; font-size:46px; line-height:46px; color:#f8f1e6; width:64px;">B</td>
                      <td align="right" style="font-size:11px; line-height:18px; letter-spacing:2px; text-transform:uppercase; color:#e1c783; font-weight:bold;">${couple.hashtag}</td>
                    </tr>
                  </table>
                  <h1 style="font-family:Georgia, 'Times New Roman', serif; color:#fffaf0; font-size:44px; line-height:46px; font-weight:normal; margin:34px 0 10px;">Your invitation is confirmed</h1>
                  <p style="margin:0; color:#e8dcc6; font-size:15px; line-height:25px;">Hello ${guestName}, thank you for confirming your RSVP for Ibukunoluwa and Olutayo's wedding weekend.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:34px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="border:1px solid #dec88c; background:#fbf6ec; padding:24px;" valign="top">
                        <p style="margin:0 0 8px; color:#7a1f35; font-size:11px; letter-spacing:2px; text-transform:uppercase; font-weight:bold;">Guest pass</p>
                        <p style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:30px; line-height:35px; color:#0b513f;">${guestName}</p>
                        <p style="margin:14px 0 0; font-size:14px; line-height:22px; color:#5f5a4e;">${escapeHtml(eventText)}<br/>${guestCount} guest${guestCount === 1 ? "" : "s"} on this RSVP</p>
                      </td>
                    </tr>
                  </table>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;">
                    <tr>
                      <td width="48%" style="background:#0b513f; padding:24px; border:1px solid #d7bd78;" valign="top">
                        <p style="margin:0 0 12px; color:#e1c783; font-size:11px; letter-spacing:2px; text-transform:uppercase; font-weight:bold;">Invitation code</p>
                        <p style="margin:0; font-family:Georgia, 'Times New Roman', serif; color:#fffaf0; font-size:44px; line-height:44px;">${invitationCode}</p>
                        <p style="margin:16px 0 0; color:#d8ccb8; font-size:12px; line-height:18px;">Check-in reference<br/><strong style="color:#fffaf0;">${escapeHtml(checkInRef)}</strong></p>
                      </td>
                      <td width="4%" style="font-size:1px; line-height:1px;">&nbsp;</td>
                      <td width="48%" align="center" style="background:#fffdf7; padding:18px; border:1px solid #dec88c;" valign="top">
                        <img src="${qrSrc}" width="190" height="190" alt="Invitation QR code" style="display:block; width:190px; height:190px; border:0;" />
                        <p style="margin:12px 0 0; color:#7a1f35; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; font-weight:bold;">Scan at entry</p>
                      </td>
                    </tr>
                  </table>
                  <div style="margin-top:22px; padding:18px 20px; border-left:4px solid #7a1f35; background:#f6eadb;">
                    <p style="margin:0; color:#4f493e; font-size:14px; line-height:24px;">Please keep this email safe and present the QR code at the venue. The QR code is unique to your RSVP and invitation code.</p>
                  </div>
                  <p style="margin:26px 0 0; font-size:14px; line-height:24px; color:#5f5a4e;">Wedding website: <a href="https://thebensons26.vercel.app/" style="color:#7a1f35; font-weight:bold;">thebensons26.vercel.app</a></p>
                  <p style="margin:8px 0 0; font-size:14px; line-height:24px; color:#5f5a4e;">Invitation card sample: <a href="${invitationCardUrl}" style="color:#7a1f35; font-weight:bold;">View invitation card</a></p>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 34px; background:#143f34; color:#f8f1e6;">
                  <p style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:22px; line-height:28px;">With love,<br/>Ibukunoluwa &amp; Olutayo</p>
                  <p style="margin:12px 0 0; color:#d8ccb8; font-size:12px; line-height:18px;">4th &amp; 5th December 2026 · Ibadan, Nigeria</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function buildQrAttachment(qrCodeDataUrl: string, invitationCode: string) {
  const qrCodeBase64 = qrCodeDataUrl.split(",")[1];

  if (!qrCodeBase64) {
    return undefined;
  }

  return {
    filename: `becoming-the-bensons-qr-${invitationCode}.png`,
    content: qrCodeBase64,
    contentType: "image/png",
    contentId: "invitation-qr",
  } satisfies EmailAttachment;
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
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://thebensons26.vercel.app";
  const invitationCardUrl = `${siteUrl}/images/wedding/invitation-card-sample.svg`;
  const qrAttachment = buildQrAttachment(qrCodeDataUrl, guest.invitation_code);

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
  const resendHtml = buildInvitationEmailHtml({
    guest,
    rsvp,
    qrCodeDataUrl,
    qrImageSrc: qrAttachment ? "cid:invitation-qr" : undefined,
    invitationCardUrl,
  });
  const subject = `${couple.hashtag} Wedding Invitation`;

  const resendResult = await sendWithResend({
    to,
    subject,
    html: resendHtml,
    attachments: qrAttachment ? [qrAttachment] : undefined,
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
      qrCodeDataUrl,
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
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
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
    attachments,
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
