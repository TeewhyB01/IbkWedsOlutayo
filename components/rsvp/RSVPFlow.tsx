"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { InvitationCodeStep } from "@/components/rsvp/InvitationCodeStep";
import { RSVPConfirmation, type RSVPConfirmationData } from "@/components/rsvp/RSVPConfirmation";
import { RSVPForm } from "@/components/rsvp/RSVPForm";
import { cn } from "@/lib/utils";
import type { SubmitRsvpInput } from "@/lib/validations";
import type { PublicGuest } from "@/types";

const steps = ["Invitation Code", "RSVP Details", "Confirmation"];

type FlowStep = 0 | 1 | 2;

export function RSVPFlow() {
  const [step, setStep] = useState<FlowStep>(0);
  const [guest, setGuest] = useState<PublicGuest | null>(null);
  const [confirmation, setConfirmation] = useState<RSVPConfirmationData | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  async function validateCode(code: string) {
    setChecking(true);
    setCodeError(null);

    const response = await fetch("/api/validate-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    setChecking(false);

    if (!response.ok || !data.valid) {
      setCodeError(data.message ?? "Please check your invitation code and try again.");
      return;
    }

    setGuest(data.guest);
    setStep(1);
  }

  async function submitRsvp(values: SubmitRsvpInput) {
    setSaving(true);
    setSubmitError(null);

    const response = await fetch("/api/submit-rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    setSaving(false);

    if (!response.ok || !data.success) {
      setSubmitError(data.message ?? "We could not save your RSVP. Please try again.");
      return;
    }

    setGuest(data.guest);
    setConfirmation(data.confirmation);
    setStep(2);
  }

  function restartFlow() {
    setStep(0);
    setGuest(null);
    setConfirmation(null);
    setCodeError(null);
    setSubmitError(null);
    setChecking(false);
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <ol className="mb-8 grid grid-cols-3 gap-2 rounded-full border border-gold/24 bg-white/58 p-2 shadow-xl shadow-gold/10 backdrop-blur-sm">
        {steps.map((label, index) => (
          <li
            key={label}
            className={cn(
              "rounded-full px-3 py-3 text-center text-xs font-semibold transition sm:text-sm",
              index <= step ? "bg-green text-ivory" : "text-muted",
            )}
          >
            {label}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
          >
            <InvitationCodeStep
              onSubmit={validateCode}
              loading={checking}
              error={codeError}
            />
          </motion.div>
        ) : null}

        {step === 1 && guest ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
          >
            <RSVPForm
              guest={guest}
              onSubmit={submitRsvp}
              saving={saving}
              error={submitError}
            />
          </motion.div>
        ) : null}

        {step === 2 && confirmation ? (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
          >
            <RSVPConfirmation confirmation={confirmation} onAddAnother={restartFlow} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
