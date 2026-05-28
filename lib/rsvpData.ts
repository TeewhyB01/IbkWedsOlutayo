import { randomUUID } from "node:crypto";

import {
  demoGuests,
  demoRsvps,
  loadDemoStore,
  saveDemoStore,
} from "@/lib/demoData";
import { isFirebaseConfigured } from "@/lib/firebaseConfig";
import {
  createFirebaseRsvp,
  getFirebaseGuestById,
  getFirebaseGuestByInvitationCode,
  getFirebaseRsvpByGuestId,
} from "@/lib/firebaseStore";
import type { GuestRecord, InvitationType, PublicGuest, RSVPRecord } from "@/types";

const invalidCodeMessage =
  "We could not find this invitation code. Please check your invite and try again.";
export const usedCodeMessage =
  "This invitation code has already been used. Please contact the couple directly if you need to make a change.";

export function toPublicGuest(
  guest: GuestRecord,
  existingRsvp?: RSVPRecord | null,
): PublicGuest {
  return {
    id: guest.id,
    guestName: guest.guest_name,
    invitationCode: guest.invitation_code,
    allowedGuestCount: guest.allowed_guest_count,
    invitationType: guest.invitation_type,
    existingRsvp: existingRsvp
      ? {
          fullName: existingRsvp.full_name,
          email: existingRsvp.email ?? undefined,
          phone: existingRsvp.phone ?? undefined,
          category: existingRsvp.guest_category ?? undefined,
          categoryOther: existingRsvp.guest_category_other ?? undefined,
          attendingTraditional: existingRsvp.attending_traditional,
          attendingFinale: existingRsvp.attending_finale,
          guestCount: existingRsvp.guest_count,
          mealPreference: existingRsvp.meal_preference ?? undefined,
          allergies: existingRsvp.allergies ?? undefined,
          songRequest: existingRsvp.song_request ?? undefined,
          messageToCouple: existingRsvp.message_to_couple ?? undefined,
        }
      : null,
  };
}

export async function findGuestByInvitationCode(code: string) {
  if (isFirebaseConfigured()) {
    const guest = await getFirebaseGuestByInvitationCode(code, {
      activeOnly: true,
    });

    if (!guest) {
      return { guest: null, existingRsvp: null, error: invalidCodeMessage };
    }

    return {
      guest,
      existingRsvp: await getFirebaseRsvpByGuestId(guest.id),
      error: null,
    };
  }

  loadDemoStore();
  const guest = demoGuests.find(
    (item) => item.invitation_code === code && item.is_active,
  );

  if (!guest) {
    return { guest: null, existingRsvp: null, error: invalidCodeMessage };
  }

  return {
    guest,
    existingRsvp: demoRsvps.get(guest.id) ?? null,
    error: null,
  };
}

export async function findGuestById(guestId: string) {
  if (isFirebaseConfigured()) {
    const guest = await getFirebaseGuestById(guestId);

    return guest?.is_active ? guest : null;
  }

  loadDemoStore();
  return demoGuests.find((guest) => guest.id === guestId && guest.is_active) ?? null;
}

export async function findRsvpByGuestId(guestId: string) {
  if (isFirebaseConfigured()) {
    return getFirebaseRsvpByGuestId(guestId);
  }

  loadDemoStore();
  return demoRsvps.get(guestId) ?? null;
}

export function validateInvitationScope(
  invitationType: InvitationType,
  attendingTraditional: boolean,
  attendingFinale: boolean,
) {
  if (invitationType === "traditional" && attendingFinale) {
    return "This invitation is for the Traditional Wedding only.";
  }

  if (invitationType === "finale" && attendingTraditional) {
    return "This invitation is for the Grand Finale only.";
  }

  return null;
}

export async function createRsvp(
  guest: GuestRecord,
  input: {
    fullName: string;
    email: string;
    phone: string;
    category: string;
    categoryOther?: string;
    attendingTraditional: boolean;
    attendingFinale: boolean;
    guestCount: number;
    mealPreference: string;
    allergies: string;
    songRequest: string;
    messageToCouple: string;
  },
) {
  const now = new Date().toISOString();
  const record: RSVPRecord = {
    id: isFirebaseConfigured() ? guest.id : randomUUID(),
    guest_id: guest.id,
    full_name: input.fullName,
    email: input.email || null,
    phone: input.phone || null,
    guest_category: input.category,
    guest_category_other:
      input.category === "Others" ? input.categoryOther || null : null,
    attending_traditional: input.attendingTraditional,
    attending_finale: input.attendingFinale,
    guest_count: input.guestCount,
    meal_preference: input.mealPreference || "No preference",
    allergies: input.allergies || null,
    song_request: input.songRequest || null,
    message_to_couple: input.messageToCouple || null,
    submitted_at: now,
    updated_at: now,
  };

  if (isFirebaseConfigured()) {
    return createFirebaseRsvp(record);
  }

  loadDemoStore();
  const existing = demoRsvps.get(guest.id);

  if (existing) {
    throw new Error("RSVP_ALREADY_EXISTS");
  }

  demoRsvps.set(guest.id, record);
  saveDemoStore();
  return record;
}
