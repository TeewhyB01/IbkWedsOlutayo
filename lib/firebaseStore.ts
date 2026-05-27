import { createSign, randomUUID } from "node:crypto";

import { firebaseConfig, isFirebaseConfigured } from "@/lib/firebaseConfig";
import type { GuestRecord, InvitationType, RSVPRecord } from "@/types";

type FirestoreValue =
  | { nullValue: null }
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { mapValue: { fields?: FirestoreFields } }
  | { arrayValue: { values?: FirestoreValue[] } };

type FirestoreFields = Record<string, FirestoreValue>;

type FirestoreDocument = {
  name: string;
  fields?: FirestoreFields;
  createTime?: string;
  updateTime?: string;
};

type FirestoreRunQueryRow = {
  document?: FirestoreDocument;
};

type FirestoreWhere = {
  field: string;
  op: "EQUAL";
  value: unknown;
};

type FirestoreWrite = {
  update?: {
    name: string;
    fields: FirestoreFields;
  };
  delete?: string;
  updateMask?: {
    fieldPaths: string[];
  };
  currentDocument?: {
    exists?: boolean;
  };
};

export class FirebaseStoreError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "FirebaseStoreError";
    this.status = status;
    this.code = code;
  }
}

const databaseId = "(default)";
let cachedAccessToken: { token: string; expiresAt: number } | null = null;

function firestoreRoot() {
  return `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/${databaseId}`;
}

function documentName(collectionId: string, id: string) {
  return `projects/${firebaseConfig.projectId}/databases/${databaseId}/documents/${collectionId}/${id}`;
}

function firestoreUrl(path: string, params?: Record<string, string | string[]>) {
  const documentPrefix = path.startsWith(":") ? "documents" : "documents/";
  const url = new URL(`${firestoreRoot()}/${documentPrefix}${path}`);

  url.searchParams.set("key", firebaseConfig.apiKey);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, item));
      return;
    }

    url.searchParams.set(key, value);
  });

  return url;
}

function encodeValue(value: unknown): FirestoreValue {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }

  if (typeof value === "string") {
    return { stringValue: value };
  }

  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }

  if (typeof value === "boolean") {
    return { booleanValue: value };
  }

  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(encodeValue) } };
  }

  if (typeof value === "object") {
    return {
      mapValue: {
        fields: encodeFields(value as Record<string, unknown>),
      },
    };
  }

  return { stringValue: String(value) };
}

function decodeValue(value: FirestoreValue): unknown {
  if ("nullValue" in value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("arrayValue" in value) return (value.arrayValue.values ?? []).map(decodeValue);
  if ("mapValue" in value) return decodeFields(value.mapValue.fields ?? {});

  return null;
}

function encodeFields(record: Record<string, unknown>): FirestoreFields {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, encodeValue(value)]),
  );
}

function decodeFields(fields: FirestoreFields) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]),
  );
}

function recordFromDocument<T>(document: FirestoreDocument): T {
  const decoded = decodeFields(document.fields ?? {}) as Record<string, unknown>;
  const id = String(decoded.id ?? document.name.split("/").pop() ?? "");

  return {
    ...decoded,
    id,
  } as T;
}

async function firestoreRequest<T>(
  path: string,
  init?: RequestInit,
  params?: Record<string, string | string[]>,
) {
  if (!isFirebaseConfigured()) {
    throw new FirebaseStoreError("Firebase is not configured.", 500);
  }

  const accessToken = await getFirebaseAccessToken();
  const response = await fetch(firestoreUrl(path, params), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message =
      payload?.error?.message ??
      `Firebase request failed with status ${response.status}.`;

    throw new FirebaseStoreError(
      message,
      response.status,
      payload?.error?.status,
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

function getFirebasePrivateKey() {
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? null;
}

async function getFirebaseAccessToken() {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getFirebasePrivateKey();

  if (!clientEmail || !privateKey) {
    return null;
  }

  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 60_000) {
    return cachedAccessToken.token;
  }

  const now = Math.floor(Date.now() / 1000);
  const assertionHeader = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" }),
  ).toString("base64url");
  const assertionPayload = Buffer.from(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
      sub: clientEmail,
    }),
  ).toString("base64url");
  const signer = createSign("RSA-SHA256");

  signer.update(`${assertionHeader}.${assertionPayload}`);
  signer.end();

  const signature = signer.sign(privateKey).toString("base64url");
  const assertion = `${assertionHeader}.${assertionPayload}.${signature}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);

    throw new FirebaseStoreError(
      payload?.error_description ??
        payload?.error ??
        "Firebase service account authentication failed.",
      response.status,
    );
  }

  const tokenPayload = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedAccessToken = {
    token: tokenPayload.access_token,
    expiresAt: Date.now() + tokenPayload.expires_in * 1000,
  };

  return cachedAccessToken.token;
}

function buildWhere(filters: FirestoreWhere[]) {
  const fieldFilters = filters.map((filter) => ({
    fieldFilter: {
      field: { fieldPath: filter.field },
      op: filter.op,
      value: encodeValue(filter.value),
    },
  }));

  if (fieldFilters.length === 0) {
    return undefined;
  }

  if (fieldFilters.length === 1) {
    return fieldFilters[0];
  }

  return {
    compositeFilter: {
      op: "AND",
      filters: fieldFilters,
    },
  };
}

async function runCollectionQuery<T>({
  collectionId,
  filters = [],
  orderBy,
  direction = "DESCENDING",
  limit,
}: {
  collectionId: string;
  filters?: FirestoreWhere[];
  orderBy?: string;
  direction?: "ASCENDING" | "DESCENDING";
  limit?: number;
}) {
  const structuredQuery: Record<string, unknown> = {
    from: [{ collectionId }],
  };
  const where = buildWhere(filters);

  if (where) structuredQuery.where = where;
  if (orderBy) {
    structuredQuery.orderBy = [
      {
        field: { fieldPath: orderBy },
        direction,
      },
    ];
  }
  if (limit) structuredQuery.limit = limit;

  const rows = await firestoreRequest<FirestoreRunQueryRow[]>(":runQuery", {
    method: "POST",
    body: JSON.stringify({ structuredQuery }),
  });

  return rows
    .filter((row) => row.document)
    .map((row) => recordFromDocument<T>(row.document!));
}

async function getDocument<T>(collectionId: string, id: string) {
  try {
    const document = await firestoreRequest<FirestoreDocument>(
      `${collectionId}/${id}`,
    );

    return recordFromDocument<T>(document);
  } catch (error) {
    if (error instanceof FirebaseStoreError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

async function commitWrites(writes: FirestoreWrite[]) {
  return firestoreRequest(":commit", {
    method: "POST",
    body: JSON.stringify({ writes }),
  });
}

async function patchDocument(
  collectionId: string,
  id: string,
  partial: Record<string, unknown>,
) {
  const fieldPaths = Object.keys(partial);

  if (fieldPaths.length === 0) return;

  await firestoreRequest(
    `${collectionId}/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ fields: encodeFields(partial) }),
    },
    { "updateMask.fieldPaths": fieldPaths },
  );
}

async function deleteDocument(collectionId: string, id: string) {
  await firestoreRequest(`${collectionId}/${id}`, {
    method: "DELETE",
  });
}

function createGeneratedGuests() {
  const now = new Date().toISOString();

  return Array.from({ length: 300 }, (_, index): GuestRecord => {
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

export async function seedFirebaseGuestsIfEmpty() {
  if (!isFirebaseConfigured()) return false;

  const existing = await runCollectionQuery<GuestRecord>({
    collectionId: "guests",
    limit: 1,
  });

  if (existing.length > 0) {
    return false;
  }

  const guests = createGeneratedGuests();

  try {
    await commitWrites(
      guests.map((guest) => ({
        update: {
          name: documentName("guests", guest.id),
          fields: encodeFields(guest as unknown as Record<string, unknown>),
        },
        currentDocument: { exists: false },
      })),
    );
  } catch (error) {
    if (
      error instanceof FirebaseStoreError &&
      (error.status === 409 || error.code === "ALREADY_EXISTS")
    ) {
      return false;
    }

    throw error;
  }

  return true;
}

export async function getFirebaseGuests() {
  await seedFirebaseGuestsIfEmpty();

  return runCollectionQuery<GuestRecord>({
    collectionId: "guests",
    orderBy: "created_at",
    direction: "DESCENDING",
  });
}

export async function getFirebaseGuestById(id: string) {
  return getDocument<GuestRecord>("guests", id);
}

export async function getFirebaseGuestByInvitationCode(
  invitationCode: string,
  options?: { activeOnly?: boolean },
) {
  await seedFirebaseGuestsIfEmpty();

  const guests = await runCollectionQuery<GuestRecord>({
    collectionId: "guests",
    filters: [{ field: "invitation_code", op: "EQUAL", value: invitationCode }],
    limit: 1,
  });

  const guest = guests[0] ?? null;

  if (options?.activeOnly && guest && !guest.is_active) {
    return null;
  }

  return guest;
}

export async function getFirebaseRsvpByGuestId(guestId: string) {
  return getDocument<RSVPRecord>("rsvps", guestId);
}

export async function getFirebaseRsvpsWithGuests() {
  const [rsvps, guests] = await Promise.all([
    runCollectionQuery<RSVPRecord>({
      collectionId: "rsvps",
      orderBy: "submitted_at",
      direction: "DESCENDING",
    }),
    getFirebaseGuests(),
  ]);
  const guestsById = new Map(guests.map((guest) => [guest.id, guest]));

  return rsvps.map((rsvp) => {
    const guest = guestsById.get(rsvp.guest_id);

    return {
      ...rsvp,
      guests: guest
        ? {
            guest_name: guest.guest_name,
            invitation_code: guest.invitation_code,
            allowed_guest_count: guest.allowed_guest_count,
            invitation_type: guest.invitation_type,
          }
        : null,
    };
  });
}

export async function createFirebaseRsvp(record: RSVPRecord) {
  try {
    await commitWrites([
      {
        update: {
          name: documentName("rsvps", record.guest_id),
          fields: encodeFields(record as unknown as Record<string, unknown>),
        },
        currentDocument: { exists: false },
      },
    ]);
  } catch (error) {
    if (
      error instanceof FirebaseStoreError &&
      /exist/i.test(error.message)
    ) {
      throw new Error("RSVP_ALREADY_EXISTS");
    }

    throw error;
  }

  return record;
}

export async function createFirebaseGuest(input: {
  invitationCode: string;
  guestName: string;
  email?: string;
  phone?: string;
  allowedGuestCount: number;
  groupName?: string;
  invitationType: InvitationType;
  isActive: boolean;
}) {
  const now = new Date().toISOString();
  const guest: GuestRecord = {
    id: randomUUID(),
    invitation_code: input.invitationCode,
    guest_name: input.guestName,
    email: input.email || null,
    phone: input.phone || null,
    allowed_guest_count: input.allowedGuestCount,
    group_name: input.groupName || null,
    invitation_type: input.invitationType,
    is_active: input.isActive,
    invitation_sent_at: null,
    invitation_send_status: "unshared",
    invitation_email_last_sent_to: null,
    invitation_email_error: null,
    save_the_date_downloaded_at: null,
    created_at: now,
    updated_at: now,
  };

  await commitWrites([
    {
      update: {
        name: documentName("guests", guest.id),
        fields: encodeFields(guest as unknown as Record<string, unknown>),
      },
      currentDocument: { exists: false },
    },
  ]);

  return guest;
}

export async function updateFirebaseGuest(
  id: string,
  input: Partial<Omit<GuestRecord, "id" | "created_at">>,
) {
  await patchDocument("guests", id, {
    ...input,
    updated_at: new Date().toISOString(),
  });
}

export async function markFirebaseSaveTheDateDownloaded(id: string) {
  const guest = await getFirebaseGuestById(id);

  if (!guest || guest.save_the_date_downloaded_at) {
    return null;
  }

  const timestamp = new Date().toISOString();
  const updatedGuest: GuestRecord = {
    ...guest,
    save_the_date_downloaded_at: timestamp,
    invitation_sent_at: timestamp,
    invitation_send_status: "sent",
    updated_at: timestamp,
  };

  try {
    await commitWrites([
      {
        update: {
          name: documentName("save_the_date_downloads", id),
          fields: encodeFields({
            id,
            guest_id: id,
            invitation_code: guest.invitation_code,
            downloaded_at: timestamp,
          }),
        },
        currentDocument: { exists: false },
      },
      {
        update: {
          name: documentName("guests", id),
          fields: encodeFields({
            save_the_date_downloaded_at: timestamp,
            invitation_sent_at: timestamp,
            invitation_send_status: "sent",
            updated_at: timestamp,
          }),
        },
        updateMask: {
          fieldPaths: [
            "save_the_date_downloaded_at",
            "invitation_sent_at",
            "invitation_send_status",
            "updated_at",
          ],
        },
      },
    ]);
  } catch (error) {
    if (
      error instanceof FirebaseStoreError &&
      /exist/i.test(error.message)
    ) {
      return null;
    }

    throw error;
  }

  return updatedGuest;
}

export async function deleteFirebaseGuest(id: string) {
  await Promise.allSettled([
    deleteDocument("guests", id),
    deleteDocument("rsvps", id),
    deleteDocument("save_the_date_downloads", id),
  ]);
}
