export type InvitationType = "traditional" | "finale" | "both";

export type NavLink = {
  label: string;
  href: string;
};

export type WeddingImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type StoryQuestion = {
  question: string;
  brideAnswer: string;
  groomAnswer: string;
};

export type WeddingEvent = {
  id: "traditional" | "finale";
  title: string;
  kicker: string;
  date: string;
  dateLabel: string;
  time: string;
  venue: string;
  address: string;
  dressCode: string;
  description: string;
  image: string;
  theme: string;
  guestNote: string;
  calendarUrl: string;
};

export type TimelineGroup = {
  title: string;
  date: string;
  items: string[];
};

export type VenueInfo = {
  title: string;
  date: string;
  venue: string;
  address: string;
  mapsUrl: string;
};

export type HotelRecommendation = {
  name: string;
  address: string;
  distance: string;
  priceRange: string;
  bookingUrl: string;
  notes: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type RegistryOption = {
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  icon: "gift" | "bank" | "heart";
  accountFields?: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    iban: string;
  };
};

export type BankTransferOption = {
  currency: string;
  label: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  sortCode?: string;
  note: string;
};

export type GuestRecord = {
  id: string;
  invitation_code: string;
  guest_name: string;
  email: string | null;
  phone: string | null;
  allowed_guest_count: number;
  group_name: string | null;
  invitation_type: InvitationType;
  is_active: boolean;
  invitation_sent_at: string | null;
  invitation_send_status: "unshared" | "queued" | "sent" | "failed";
  invitation_email_last_sent_to: string | null;
  invitation_email_error: string | null;
  save_the_date_downloaded_at: string | null;
  created_at: string;
  updated_at: string;
};

export type RSVPRecord = {
  id: string;
  guest_id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  attending_traditional: boolean;
  attending_finale: boolean;
  guest_count: number;
  meal_preference: string | null;
  allergies: string | null;
  song_request: string | null;
  message_to_couple: string | null;
  submitted_at: string;
  updated_at: string;
  guests?: Pick<
    GuestRecord,
    "guest_name" | "invitation_code" | "allowed_guest_count" | "invitation_type"
  > | null;
};

export type PublicGuest = {
  id: string;
  guestName: string;
  invitationCode: string;
  allowedGuestCount: number;
  invitationType: InvitationType;
  existingRsvp?: {
    fullName: string;
    email?: string;
    phone?: string;
    attendingTraditional: boolean;
    attendingFinale: boolean;
    guestCount: number;
    mealPreference?: string;
    allergies?: string;
    songRequest?: string;
    messageToCouple?: string;
  } | null;
};
