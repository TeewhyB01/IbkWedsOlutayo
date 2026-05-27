"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function CopyDetailButton({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copyValue}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-gold/28 bg-ivory px-4 text-xs font-bold uppercase tracking-[0.14em] text-green transition hover:bg-cream",
        className,
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : label}
    </button>
  );
}
