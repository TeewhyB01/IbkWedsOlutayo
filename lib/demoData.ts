import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import type { GuestRecord, RSVPRecord } from "@/types";

const generatedGuestCount = 300;
const demoStoreDirectory = process.env.VERCEL
  ? tmpdir()
  : path.join(process.cwd(), ".next", "cache");
const demoStorePath = path.join(
  demoStoreDirectory,
  "becoming-bensons-demo-store.json",
);

type DemoStore = {
  guests: GuestRecord[];
  rsvps: Map<string, RSVPRecord>;
};

type SerializedDemoStore = {
  guests: GuestRecord[];
  rsvps: RSVPRecord[];
};

function normaliseGuestRecord(guest: GuestRecord): GuestRecord {
  return {
    ...guest,
    invitation_sent_at: guest.invitation_sent_at ?? null,
    invitation_send_status: guest.invitation_send_status ?? "unshared",
    invitation_email_last_sent_to: guest.invitation_email_last_sent_to ?? null,
    invitation_email_error: guest.invitation_email_error ?? null,
    save_the_date_downloaded_at: guest.save_the_date_downloaded_at ?? null,
  };
}

function createDemoGuests(): GuestRecord[] {
  const now = new Date().toISOString();

  return Array.from({ length: generatedGuestCount }, (_, index) => {
    const guestNumber = index + 1;
    const code = String(1000 + ((guestNumber * 73 + 4217) % 9000)).padStart(
      4,
      "0",
    );

    return {
      id: `00000000-0000-4000-8000-${String(guestNumber).padStart(12, "0")}`,
      invitation_code: code,
      guest_name: `Guest ${String(guestNumber).padStart(3, "0")}`,
      email: null,
      phone: null,
      allowed_guest_count: 1,
      group_name: "Generated Invitation Codes",
      invitation_type: "both",
      is_active: true,
      invitation_sent_at: null,
      invitation_send_status: "unshared",
      invitation_email_last_sent_to: null,
      invitation_email_error: null,
      save_the_date_downloaded_at: null,
      created_at: now,
      updated_at: now,
    };
  });
}

function readDemoStoreFromDisk(): SerializedDemoStore | null {
  try {
    if (!existsSync(demoStorePath)) {
      return null;
    }

    const parsed = JSON.parse(readFileSync(demoStorePath, "utf8")) as Partial<
      SerializedDemoStore
    >;

    if (!Array.isArray(parsed.guests) || !Array.isArray(parsed.rsvps)) {
      return null;
    }

    return {
      guests: parsed.guests.map(normaliseGuestRecord),
      rsvps: parsed.rsvps,
    };
  } catch {
    return null;
  }
}

const globalForDemoData = globalThis as typeof globalThis & {
  __becomingBensonsDemoStore?: DemoStore;
};

const diskStore = readDemoStoreFromDisk();

globalForDemoData.__becomingBensonsDemoStore ??= {
  guests: diskStore?.guests ?? createDemoGuests(),
  rsvps: new Map<string, RSVPRecord>(
    diskStore?.rsvps.map((rsvp) => [rsvp.guest_id, rsvp]) ?? [],
  ),
};

export const demoGuests = globalForDemoData.__becomingBensonsDemoStore.guests;
export const demoRsvps = globalForDemoData.__becomingBensonsDemoStore.rsvps;

export function loadDemoStore() {
  const latest = readDemoStoreFromDisk();

  if (!latest) {
    return {
      guests: demoGuests,
      rsvps: demoRsvps,
    };
  }

  demoGuests.splice(0, demoGuests.length, ...latest.guests);
  demoRsvps.clear();
  latest.rsvps.forEach((rsvp) => demoRsvps.set(rsvp.guest_id, rsvp));

  return {
    guests: demoGuests,
    rsvps: demoRsvps,
  };
}

export function saveDemoStore() {
  mkdirSync(path.dirname(demoStorePath), { recursive: true });
  writeFileSync(
    demoStorePath,
    JSON.stringify(
      {
        guests: demoGuests,
        rsvps: Array.from(demoRsvps.values()),
      },
      null,
      2,
    ),
  );
}
