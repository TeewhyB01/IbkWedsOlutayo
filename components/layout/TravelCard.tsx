import { MapPin } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";

export function TravelCard({
  title,
  primary,
  secondary,
  meta,
  href = "#",
}: {
  title: string;
  primary: string;
  secondary: string;
  meta?: string;
  href?: string;
}) {
  return (
    <article className="rounded-[1.5rem] border border-gold/24 bg-white/68 p-6 shadow-xl shadow-gold/10 backdrop-blur-sm">
      <div className="mb-5 grid size-12 place-items-center rounded-full bg-green text-ivory">
        <MapPin size={20} />
      </div>
      <h3 className="font-serif text-3xl font-semibold text-green">{title}</h3>
      <p className="mt-3 font-semibold text-ink">{primary}</p>
      <p className="mt-2 text-sm leading-7 text-muted">{secondary}</p>
      {meta ? <p className="mt-3 text-sm font-semibold text-burgundy">{meta}</p> : null}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href={href} variant="secondary" className="min-h-11 px-5 text-xs">
          Google Maps
        </ButtonLink>
        <ButtonLink href={href} variant="primary" className="min-h-11 px-5 text-xs">
          Get Directions
        </ButtonLink>
      </div>
    </article>
  );
}
