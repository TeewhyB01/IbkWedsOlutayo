import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";

import {
  demoGuests,
  demoRsvps,
  loadDemoStore,
  saveDemoStore,
} from "@/lib/demoData";
import { isFirebaseConfigured } from "@/lib/firebaseConfig";
import {
  createFirebaseGuest,
  deleteFirebaseGuest,
  getFirebaseGuestById,
  getFirebaseGuestByInvitationCode,
  getFirebaseGuests,
  getFirebaseRsvpsWithGuests,
  markFirebaseSaveTheDateDownloaded,
  updateFirebaseGuest,
} from "@/lib/firebaseStore";
import { sendInvitationEmail } from "@/lib/invitations";
import { adminGuestSchema } from "@/lib/validations";
import type { GuestRecord } from "@/types";

export type AdminStats = {
  totalInvitedGuests: number;
  totalInvitationCodes: number;
  sharedInvitationCodes: number;
  usedInvitationCodes: number;
  unsharedInvitationCodes: number;
  totalRsvpsSubmitted: number;
  attendingTraditional: number;
  attendingFinale: number;
  notAttending: number;
  pendingRsvp: number;
  totalExpectedGuestCount: number;
};

function refreshAdminViews() {
  revalidatePath("/admin");
  revalidatePath("/admin/guests");
  revalidatePath("/admin/invitations");
  revalidatePath("/admin/rsvps");
}

function ensureUniqueDemoCode(code: string, currentGuestId?: string) {
  const duplicate = demoGuests.find(
    (guest) =>
      guest.invitation_code === code &&
      (!currentGuestId || guest.id !== currentGuestId),
  );

  if (duplicate) {
    throw new Error("That invitation code already belongs to another guest.");
  }
}

async function ensureUniqueInvitationCode(code: string, currentGuestId?: string) {
  if (isFirebaseConfigured()) {
    const duplicate = await getFirebaseGuestByInvitationCode(code);

    if (duplicate && (!currentGuestId || duplicate.id !== currentGuestId)) {
      throw new Error("That invitation code already belongs to another guest.");
    }

    return;
  }

  loadDemoStore();
  ensureUniqueDemoCode(code, currentGuestId);
}

export async function getAllGuests() {
  if (isFirebaseConfigured()) {
    return getFirebaseGuests();
  }

  loadDemoStore();
  return demoGuests;
}

export async function getGuestByIdForAdmin(id: string) {
  if (isFirebaseConfigured()) {
    return getFirebaseGuestById(id);
  }

  loadDemoStore();
  return demoGuests.find((guest) => guest.id === id) ?? null;
}

export async function markSaveTheDateDownloaded(id: string) {
  if (isFirebaseConfigured()) {
    const guest = await markFirebaseSaveTheDateDownloaded(id);
    refreshAdminViews();
    return guest;
  }

  const timestamp = new Date().toISOString();

  loadDemoStore();
  const guest = demoGuests.find((item) => item.id === id);

  if (!guest || guest.save_the_date_downloaded_at) {
    return null;
  }

  guest.save_the_date_downloaded_at = timestamp;
  guest.invitation_send_status = "sent";
  guest.invitation_sent_at = timestamp;
  guest.updated_at = timestamp;
  saveDemoStore();
  refreshAdminViews();
  return guest;
}

export async function getAllRsvps() {
  if (isFirebaseConfigured()) {
    return getFirebaseRsvpsWithGuests();
  }

  loadDemoStore();
  return Array.from(demoRsvps.values())
    .map((rsvp) => ({
      ...rsvp,
      guests: demoGuests.find((guest) => guest.id === rsvp.guest_id) ?? null,
    }))
    .sort(
      (first, second) =>
        new Date(second.submitted_at).getTime() -
        new Date(first.submitted_at).getTime(),
    );
}

export async function getAdminStats(): Promise<AdminStats> {
  const [guests, rsvps] = await Promise.all([getAllGuests(), getAllRsvps()]);
  const attendingTraditional = rsvps.reduce(
    (total, rsvp) => total + (rsvp.attending_traditional ? rsvp.guest_count : 0),
    0,
  );
  const attendingFinale = rsvps.reduce(
    (total, rsvp) => total + (rsvp.attending_finale ? rsvp.guest_count : 0),
    0,
  );
  const notAttending = rsvps.filter(
    (rsvp) => !rsvp.attending_traditional && !rsvp.attending_finale,
  ).length;
  const usedGuestIds = new Set(rsvps.map((rsvp) => rsvp.guest_id));
  const sharedInvitationCodes = guests.filter((guest) =>
    Boolean(guest.save_the_date_downloaded_at),
  ).length;

  return {
    totalInvitedGuests: guests.length,
    totalInvitationCodes: guests.length,
    sharedInvitationCodes,
    usedInvitationCodes: usedGuestIds.size,
    unsharedInvitationCodes: Math.max(guests.length - sharedInvitationCodes, 0),
    totalRsvpsSubmitted: rsvps.length,
    attendingTraditional,
    attendingFinale,
    notAttending,
    pendingRsvp: Math.max(guests.length - rsvps.length, 0),
    totalExpectedGuestCount: rsvps.reduce(
      (total, rsvp) => total + rsvp.guest_count,
      0,
    ),
  };
}

export async function createGuestFromForm(formData: FormData) {
  const parsed = adminGuestSchema.safeParse({
    invitationCode: formData.get("invitationCode"),
    guestName: formData.get("guestName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    allowedGuestCount: formData.get("allowedGuestCount"),
    groupName: formData.get("groupName"),
    invitationType: formData.get("invitationType"),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    throw new Error("Please check the guest details and try again.");
  }

  await ensureUniqueInvitationCode(parsed.data.invitationCode);

  if (isFirebaseConfigured()) {
    await createFirebaseGuest(parsed.data);
    refreshAdminViews();
    return;
  }

  const timestamp = new Date().toISOString();

  loadDemoStore();
  demoGuests.unshift({
    id: randomUUID(),
    invitation_code: parsed.data.invitationCode,
    guest_name: parsed.data.guestName,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    allowed_guest_count: parsed.data.allowedGuestCount,
    group_name: parsed.data.groupName || null,
    invitation_type: parsed.data.invitationType,
    is_active: parsed.data.isActive,
    invitation_sent_at: null,
    invitation_send_status: "unshared",
    invitation_email_last_sent_to: null,
    invitation_email_error: null,
    save_the_date_downloaded_at: null,
    created_at: timestamp,
    updated_at: timestamp,
  });

  refreshAdminViews();
  saveDemoStore();
}

export async function updateGuestFromForm(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const parsed = adminGuestSchema.safeParse({
    invitationCode: formData.get("invitationCode"),
    guestName: formData.get("guestName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    allowedGuestCount: formData.get("allowedGuestCount"),
    groupName: formData.get("groupName"),
    invitationType: formData.get("invitationType"),
    isActive: formData.get("isActive") === "on",
  });

  if (!id || !parsed.success) {
    throw new Error("Please check the guest details and try again.");
  }

  await ensureUniqueInvitationCode(parsed.data.invitationCode, id);

  if (isFirebaseConfigured()) {
    await updateFirebaseGuest(id, {
      invitation_code: parsed.data.invitationCode,
      guest_name: parsed.data.guestName,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      allowed_guest_count: parsed.data.allowedGuestCount,
      group_name: parsed.data.groupName || null,
      invitation_type: parsed.data.invitationType,
      is_active: parsed.data.isActive,
    });
    refreshAdminViews();
    return;
  }

  loadDemoStore();
  const guest = demoGuests.find((demoGuest) => demoGuest.id === id);

  if (!guest) {
    throw new Error("Guest record could not be found.");
  }

  guest.invitation_code = parsed.data.invitationCode;
  guest.guest_name = parsed.data.guestName;
  guest.email = parsed.data.email || null;
  guest.phone = parsed.data.phone || null;
  guest.allowed_guest_count = parsed.data.allowedGuestCount;
  guest.group_name = parsed.data.groupName || null;
  guest.invitation_type = parsed.data.invitationType;
  guest.is_active = parsed.data.isActive;
  guest.updated_at = new Date().toISOString();

  refreshAdminViews();
  saveDemoStore();
}

export async function bulkSendPendingInvitationCodes() {
  const guests = (await getAllGuests())
    .filter(
      (guest) =>
        guest.email &&
        guest.is_active &&
        guest.invitation_send_status !== "sent",
    )
    .slice(0, 300);

  let sent = 0;
  let mocked = 0;
  let failed = 0;

  for (const guest of guests) {
    const result = await sendInvitationEmail({ guest });
    const isSuccessful = result.status === "sent" || result.status === "mocked";
    const invitation_sent_at = isSuccessful ? new Date().toISOString() : null;
    const invitation_send_status: GuestRecord["invitation_send_status"] =
      isSuccessful ? "sent" : "failed";

    if (result.status === "sent") sent += 1;
    if (result.status === "mocked") mocked += 1;
    if (!isSuccessful) failed += 1;

    if (isFirebaseConfigured()) {
      await updateFirebaseGuest(guest.id, {
        invitation_sent_at,
        invitation_send_status,
        invitation_email_last_sent_to: result.to,
        invitation_email_error: isSuccessful ? null : result.message,
      });
      continue;
    }

    guest.invitation_sent_at = invitation_sent_at;
    guest.invitation_send_status = invitation_send_status;
    guest.invitation_email_last_sent_to = result.to;
    guest.invitation_email_error = isSuccessful ? null : result.message;
    guest.updated_at = new Date().toISOString();
  }

  refreshAdminViews();

  if (!isFirebaseConfigured()) {
    saveDemoStore();
  }

  return {
    totalProcessed: guests.length,
    sent,
    mocked,
    failed,
  };
}

export async function deleteGuestById(id: string) {
  if (!id) {
    throw new Error("Guest record could not be found.");
  }

  if (isFirebaseConfigured()) {
    await deleteFirebaseGuest(id);
    refreshAdminViews();
    return;
  }

  loadDemoStore();
  const guestIndex = demoGuests.findIndex((guest) => guest.id === id);

  if (guestIndex === -1) {
    throw new Error("Guest record could not be found.");
  }

  demoGuests.splice(guestIndex, 1);
  demoRsvps.delete(id);
  refreshAdminViews();
  saveDemoStore();
}
