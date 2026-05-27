import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase text-gold">{eyebrow}</p>
      ) : null}
      <h2 className="font-serif text-5xl font-semibold leading-[0.98] text-green text-balance sm:text-6xl">
        {title}
      </h2>
      {children ? (
        <div className="mt-5 text-base leading-8 text-muted sm:text-lg">{children}</div>
      ) : null}
    </div>
  );
}
