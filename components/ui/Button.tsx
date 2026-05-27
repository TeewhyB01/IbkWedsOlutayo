import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "light";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-green bg-green text-ivory shadow-[0_18px_45px_rgba(23,60,52,0.2)] hover:bg-green-soft",
  secondary:
    "border-gold bg-ivory text-green shadow-[0_16px_36px_rgba(184,138,68,0.16)] hover:bg-cream",
  ghost:
    "border-gold/45 bg-white/10 text-ivory backdrop-blur-md hover:bg-white/20",
  light:
    "border-white/70 bg-white/88 text-green shadow-[0_18px_45px_rgba(0,0,0,0.16)] hover:bg-ivory",
};

export function buttonClasses({
  variant = "primary",
  className,
}: {
  variant?: ButtonVariant;
  className?: string;
} = {}) {
  return cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition duration-300 disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    className,
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button className={buttonClasses({ variant, className })} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  children,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={buttonClasses({ variant, className })} {...props}>
      {children}
    </Link>
  );
}
