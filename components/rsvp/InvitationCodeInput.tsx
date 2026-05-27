"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { invitationCodeSchema } from "@/lib/validations";
import { normaliseInvitationCode } from "@/lib/utils";

export function InvitationCodeInput({
  onSubmit,
  loading,
  error,
}: {
  onSubmit: (code: string) => void;
  loading: boolean;
  error?: string | null;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ code: string }>({
    resolver: zodResolver(invitationCodeSchema),
    defaultValues: { code: "" },
  });

  return (
    <form
      className="mx-auto max-w-md rounded-[1.6rem] border border-gold/24 bg-white/74 p-6 text-center shadow-2xl shadow-gold/12 backdrop-blur-sm sm:p-8"
      onSubmit={handleSubmit((values) => onSubmit(values.code))}
    >
      <label htmlFor="code" className="block text-sm font-semibold text-green">
        Invitation Code
      </label>
      <input
        id="code"
        inputMode="text"
        maxLength={4}
        autoComplete="one-time-code"
        className="mt-4 h-16 w-full rounded-2xl border border-gold/30 bg-ivory px-5 text-center font-serif text-4xl font-semibold text-green shadow-inner outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/18"
        aria-invalid={Boolean(errors.code || error)}
        {...register("code", {
          onChange: (event) => {
            setValue("code", normaliseInvitationCode(event.target.value), {
              shouldValidate: false,
            });
          },
        })}
      />
      <p className="mt-3 text-xs leading-6 text-muted">
        Please enter the 4-character code sent with your invitation.
      </p>
      {errors.code?.message ? (
        <p className="mt-3 text-sm font-semibold text-burgundy">{errors.code.message}</p>
      ) : null}
      {error ? <p className="mt-3 text-sm font-semibold text-burgundy">{error}</p> : null}
      <Button type="submit" disabled={loading} className="mt-6 w-full">
        {loading ? "Checking..." : "Continue"}
      </Button>
    </form>
  );
}
