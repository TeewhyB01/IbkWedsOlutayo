"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { UseFormRegisterReturn } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  rsvpCategoryOptions,
  submitRsvpSchema,
  type SubmitRsvpFormValues,
  type SubmitRsvpInput,
} from "@/lib/validations";
import type { PublicGuest } from "@/types";

const mealOptions = ["No preference", "Vegetarian", "Vegan", "Halal", "Other"] as const;
type MealPreference = (typeof mealOptions)[number];
type RsvpCategory = (typeof rsvpCategoryOptions)[number];

export function RSVPForm({
  guest,
  onSubmit,
  saving,
  error,
}: {
  guest: PublicGuest;
  onSubmit: (values: SubmitRsvpInput) => void;
  saving: boolean;
  error?: string | null;
}) {
  const existing = guest.existingRsvp;
  const displayGuestName = getDisplayGuestName(guest.guestName);
  const canAttendTraditional =
    guest.invitationType === "traditional" || guest.invitationType === "both";
  const canAttendFinale = guest.invitationType === "finale" || guest.invitationType === "both";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SubmitRsvpFormValues, unknown, SubmitRsvpInput>({
    resolver: zodResolver(submitRsvpSchema),
    defaultValues: {
      guestId: guest.id,
      fullName: existing?.fullName ?? "",
      email: existing?.email ?? "",
      phone: existing?.phone ?? "",
      category: normaliseCategory(existing?.category) ?? "",
      categoryOther: existing?.categoryOther ?? "",
      attendingTraditional:
        existing?.attendingTraditional ?? (canAttendTraditional ? true : false),
      attendingFinale: existing?.attendingFinale ?? (canAttendFinale ? true : false),
      guestCount: existing?.guestCount ?? 1,
      mealPreference: normaliseMealPreference(existing?.mealPreference),
      allergies: existing?.allergies ?? "",
      songRequest: existing?.songRequest ?? "",
      messageToCouple: existing?.messageToCouple ?? "",
    },
  });

  const attendingTraditional = useWatch({ control, name: "attendingTraditional" });
  const attendingFinale = useWatch({ control, name: "attendingFinale" });
  const guestCount = useWatch({ control, name: "guestCount" });
  const category = useWatch({ control, name: "category" });

  useEffect(() => {
    if (!canAttendTraditional) {
      setValue("attendingTraditional", false);
    }

    if (!canAttendFinale) {
      setValue("attendingFinale", false);
    }
  }, [canAttendFinale, canAttendTraditional, setValue]);

  useEffect(() => {
    if (!attendingTraditional && !attendingFinale) {
      setValue("guestCount", 0, { shouldValidate: true });
    } else if (guestCount === 0) {
      setValue("guestCount", 1, { shouldValidate: true });
    }
  }, [attendingFinale, attendingTraditional, guestCount, setValue]);

  useEffect(() => {
    if (category !== "Others") {
      setValue("categoryOther", "", { shouldValidate: true });
    }
  }, [category, setValue]);

  return (
    <form
      className="rounded-[1.75rem] border border-gold/24 bg-white/76 p-5 shadow-2xl shadow-gold/12 backdrop-blur-sm sm:p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-8 rounded-[1.25rem] border border-gold/20 bg-ivory/80 p-5">
        <p className="text-sm font-semibold text-burgundy">Invitation found</p>
        <h2 className="mt-2 font-serif text-4xl font-semibold text-green">
          {displayGuestName}
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          This invitation allows a maximum of {guest.allowedGuestCount} guest(s).
        </p>
        {existing ? (
          <p className="mt-3 rounded-full bg-green/10 px-4 py-2 text-sm font-semibold text-green">
            We found an existing RSVP. You can update it before the deadline.
          </p>
        ) : null}
      </div>

      <input type="hidden" {...register("guestId")} />

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full Name" error={errors.fullName?.message}>
          <input
            className={inputClass}
            autoComplete="name"
            placeholder="Enter your full name"
            {...register("fullName")}
            aria-invalid={Boolean(errors.fullName)}
            required
          />
        </Field>
        <Field label="Email Address" error={errors.email?.message}>
          <input
            className={inputClass}
            type="email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
            required
          />
        </Field>
        <Field label="Phone Number" error={errors.phone?.message}>
          <input
            className={inputClass}
            type="tel"
            autoComplete="tel"
            {...register("phone")}
            aria-invalid={Boolean(errors.phone)}
            required
          />
        </Field>
        <Field label="Category" error={errors.category?.message}>
          <select
            className={inputClass}
            {...register("category")}
            aria-invalid={Boolean(errors.category)}
            required
          >
            <option value="">Select category</option>
            {rsvpCategoryOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        {category === "Others" ? (
          <Field
            label="Please indicate"
            error={errors.categoryOther?.message}
            className="md:col-span-2"
          >
            <input
              className={inputClass}
              {...register("categoryOther")}
              aria-invalid={Boolean(errors.categoryOther)}
              required
            />
          </Field>
        ) : null}
        <Field label="Number of Guests Attending" error={errors.guestCount?.message}>
          <input
            className={inputClass}
            type="number"
            min={attendingTraditional || attendingFinale ? 1 : 0}
            max={guest.allowedGuestCount}
            {...register("guestCount", { valueAsNumber: true })}
            aria-invalid={Boolean(errors.guestCount)}
            required
          />
        </Field>
      </div>

      <fieldset className="mt-7">
        <legend className="mb-4 text-sm font-semibold text-green">Event Attendance</legend>
        <div className="grid gap-4 md:grid-cols-2">
          {canAttendTraditional ? (
            <AttendanceChoice
              title="Traditional Wedding"
              description="Friday, 4th December 2026"
              checked={attendingTraditional}
              registration={register("attendingTraditional")}
            />
          ) : null}
          {canAttendFinale ? (
            <AttendanceChoice
              title="The Grand Finale"
              description="Saturday, 5th December 2026"
              checked={attendingFinale}
              registration={register("attendingFinale")}
            />
          ) : null}
        </div>
      </fieldset>

      <Field label="Meal Preference" error={errors.mealPreference?.message} className="mt-7">
        <select
          className={inputClass}
          {...register("mealPreference")}
          aria-invalid={Boolean(errors.mealPreference)}
          required
        >
          {mealOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </Field>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="Allergies or Dietary Requirements" error={errors.allergies?.message}>
          <textarea
            className={textareaClass}
            rows={4}
            placeholder="None if not applicable"
            {...register("allergies")}
            aria-invalid={Boolean(errors.allergies)}
            required
          />
        </Field>
        <Field label="Song Request" error={errors.songRequest?.message}>
          <textarea
            className={textareaClass}
            rows={4}
            placeholder="None if not applicable"
            {...register("songRequest")}
            aria-invalid={Boolean(errors.songRequest)}
            required
          />
        </Field>
      </div>

      <Field label="Message to the Couple" error={errors.messageToCouple?.message} className="mt-5">
        <textarea
          className={textareaClass}
          rows={5}
          {...register("messageToCouple")}
          aria-invalid={Boolean(errors.messageToCouple)}
          required
        />
      </Field>

      {error ? <p className="mt-5 text-sm font-semibold text-burgundy">{error}</p> : null}

      <Button type="submit" disabled={saving} className="mt-7 w-full sm:w-auto">
        {saving ? "Saving RSVP..." : existing ? "Update RSVP" : "Submit RSVP"}
      </Button>
    </form>
  );
}

const inputClass =
  "mt-2 min-h-12 w-full rounded-2xl border border-gold/24 bg-ivory px-4 text-sm text-ink shadow-inner outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/16";

const textareaClass =
  "mt-2 w-full rounded-2xl border border-gold/24 bg-ivory px-4 py-3 text-sm text-ink shadow-inner outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/16";

function normaliseMealPreference(value?: string): MealPreference {
  return mealOptions.includes(value as MealPreference)
    ? (value as MealPreference)
    : "No preference";
}

function normaliseCategory(value?: string): RsvpCategory | null {
  return rsvpCategoryOptions.includes(value as RsvpCategory)
    ? (value as RsvpCategory)
    : null;
}

function getDisplayGuestName(value: string) {
  return /^Guest\s+\d+$/i.test(value.trim())
    ? "Your invitation code is confirmed"
    : value;
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block text-sm font-semibold text-green", className)}>
      {label}
      {children}
      {error ? <span className="mt-2 block text-sm text-burgundy">{error}</span> : null}
    </label>
  );
}

function AttendanceChoice({
  title,
  description,
  checked,
  registration,
}: {
  title: string;
  description: string;
  checked: boolean;
  registration: UseFormRegisterReturn;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-[1.25rem] border p-4 transition",
        checked
          ? "border-green bg-green text-ivory"
          : "border-gold/24 bg-ivory/80 text-green hover:border-gold",
      )}
    >
      <input type="checkbox" className="size-5 accent-gold" {...registration} />
      <span>
        <span className="block font-serif text-2xl font-semibold">{title}</span>
        <span className={cn("mt-1 block text-sm", checked ? "text-ivory/72" : "text-muted")}>
          {description}
        </span>
      </span>
    </label>
  );
}
