"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { UseFormRegisterReturn } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { submitRsvpSchema, type SubmitRsvpInput } from "@/lib/validations";
import type { PublicGuest } from "@/types";

const mealOptions = ["No preference", "Vegetarian", "Vegan", "Halal", "Other"] as const;
type MealPreference = (typeof mealOptions)[number];

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
  const canAttendTraditional =
    guest.invitationType === "traditional" || guest.invitationType === "both";
  const canAttendFinale = guest.invitationType === "finale" || guest.invitationType === "both";

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SubmitRsvpInput>({
    resolver: zodResolver(submitRsvpSchema),
    defaultValues: {
      guestId: guest.id,
      fullName: existing?.fullName ?? guest.guestName,
      email: existing?.email ?? "",
      phone: existing?.phone ?? "",
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

  return (
    <form
      className="rounded-[1.75rem] border border-gold/24 bg-white/76 p-5 shadow-2xl shadow-gold/12 backdrop-blur-sm sm:p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-8 rounded-[1.25rem] border border-gold/20 bg-ivory/80 p-5">
        <p className="text-sm font-semibold text-burgundy">Invitation found</p>
        <h2 className="mt-2 font-serif text-4xl font-semibold text-green">
          {guest.guestName}
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
            {...register("fullName")}
            aria-invalid={Boolean(errors.fullName)}
          />
        </Field>
        <Field label="Email Address" error={errors.email?.message}>
          <input
            className={inputClass}
            type="email"
            autoComplete="email"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>
        <Field label="Phone Number" error={errors.phone?.message}>
          <input
            className={inputClass}
            type="tel"
            autoComplete="tel"
            {...register("phone")}
            aria-invalid={Boolean(errors.phone)}
          />
        </Field>
        <Field label="Number of Guests Attending" error={errors.guestCount?.message}>
          <input
            className={inputClass}
            type="number"
            min={attendingTraditional || attendingFinale ? 1 : 0}
            max={guest.allowedGuestCount}
            {...register("guestCount", { valueAsNumber: true })}
            aria-invalid={Boolean(errors.guestCount)}
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
        <select className={inputClass} {...register("mealPreference")}>
          {mealOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </Field>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <Field label="Allergies or Dietary Requirements" error={errors.allergies?.message}>
          <textarea className={textareaClass} rows={4} {...register("allergies")} />
        </Field>
        <Field label="Song Request" error={errors.songRequest?.message}>
          <textarea className={textareaClass} rows={4} {...register("songRequest")} />
        </Field>
      </div>

      <Field label="Message to the Couple" error={errors.messageToCouple?.message} className="mt-5">
        <textarea className={textareaClass} rows={5} {...register("messageToCouple")} />
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
