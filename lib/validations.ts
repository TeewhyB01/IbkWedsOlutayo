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

export const rsvpCategoryOptions = [
  "Bride's Family",
  "Groom's Family",
  "Friends of the Bride",
  "Friends of the Groom",
  "Brides Church Family",
  "Group Church Family",
  "Bride's Father",
  "Bride's Mother",
  "Others",
] as const;

export const rsvpCategorySchema = z.enum(rsvpCategoryOptions);

function requiredText(message: string) {
  return z.string({ error: message }).trim().min(1, message);
}

const requiredMealPreferenceSchema = requiredText("Meal preference is required.")
  .refine((value) => mealPreferenceSchema.safeParse(value).success, {
    message: "Please select a valid meal preference.",
  })
  .transform((value) => value as z.infer<typeof mealPreferenceSchema>);

const requiredRsvpCategorySchema = requiredText("Category is required.")
  .refine((value) => rsvpCategorySchema.safeParse(value).success, {
    message: "Please select a valid category.",
  })
  .transform((value) => value as z.infer<typeof rsvpCategorySchema>);

export const submitRsvpSchema = z
  .object({
    guestId: z.string().uuid("Invalid guest record."),
    fullName: requiredText("Full name is required.")
      .pipe(z.string().min(2, "Full name is required.").max(120)),
    email: requiredText("Email address is required.")
      .pipe(z.email("Please enter a valid email address.")),
    phone: requiredText("Phone number is required.").refine(
      (value) => /^[+()0-9\s-]{7,24}$/.test(value),
      {
        message: "Please enter a valid phone number.",
      },
    ),
    category: requiredRsvpCategorySchema,
    categoryOther: z.string().trim().max(120).optional().or(z.literal("")),
    attendingTraditional: z.boolean(),
    attendingFinale: z.boolean(),
    guestCount: z.number().int().min(0).max(20),
    mealPreference: requiredMealPreferenceSchema,
    allergies: requiredText("Please enter dietary requirements, or type None.").pipe(
      z.string().max(500),
    ),
    songRequest: requiredText("Please enter a song request, or type None.")
      .pipe(z.string().max(160)),
    messageToCouple: requiredText("Please leave a message, or type None.").pipe(
      z.string().max(800),
    ),
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

    if (data.category === "Others" && !data.categoryOther?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["categoryOther"],
        message: "Please indicate your category.",
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
export type SubmitRsvpFormValues = z.input<typeof submitRsvpSchema>;
