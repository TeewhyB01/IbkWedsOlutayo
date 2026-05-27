import { z } from "zod";

import { normaliseInvitationCode } from "@/lib/utils";

export const invitationCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Invitation code is required.")
    .transform(normaliseInvitationCode)
    .pipe(
      z
        .string()
        .length(4, "Invitation code must be exactly 4 characters.")
        .regex(/^[A-Z0-9]{4}$/, "Invitation code can only use letters and numbers."),
    ),
});

export const mealPreferenceSchema = z.enum([
  "No preference",
  "Vegetarian",
  "Vegan",
  "Halal",
  "Other",
]);

export const submitRsvpSchema = z
  .object({
    guestId: z.string().uuid("Invalid guest record."),
    fullName: z.string().trim().min(2, "Full name is required.").max(120),
    email: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine((value) => !value || z.email().safeParse(value).success, {
        message: "Please enter a valid email address.",
      }),
    phone: z
      .string()
      .trim()
      .optional()
      .or(z.literal(""))
      .refine((value) => !value || /^[+()0-9\s-]{7,24}$/.test(value), {
        message: "Please enter a valid phone number.",
      }),
    attendingTraditional: z.boolean(),
    attendingFinale: z.boolean(),
    guestCount: z.number().int().min(0).max(20),
    mealPreference: mealPreferenceSchema.optional(),
    allergies: z.string().trim().max(500).optional().or(z.literal("")),
    songRequest: z.string().trim().max(160).optional().or(z.literal("")),
    messageToCouple: z.string().trim().max(800).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const attendingAny = data.attendingTraditional || data.attendingFinale;

    if (attendingAny && data.guestCount < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["guestCount"],
        message: "Guest count must be at least 1 if you are attending.",
      });
    }

    if (!attendingAny && data.guestCount !== 0) {
      ctx.addIssue({
        code: "custom",
        path: ["guestCount"],
        message: "Guest count can only be 0 if you are not attending either event.",
      });
    }
  });

export const adminGuestSchema = z.object({
  invitationCode: z
    .string()
    .transform(normaliseInvitationCode)
    .pipe(z.string().length(4).regex(/^[A-Z0-9]{4}$/)),
  guestName: z.string().trim().min(2).max(160),
  email: z.string().trim().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  allowedGuestCount: z.coerce.number().int().min(1).max(20),
  groupName: z.string().trim().optional().or(z.literal("")),
  invitationType: z.enum(["traditional", "finale", "both"]),
  isActive: z.coerce.boolean().default(true),
});

export type SubmitRsvpInput = z.infer<typeof submitRsvpSchema>;
