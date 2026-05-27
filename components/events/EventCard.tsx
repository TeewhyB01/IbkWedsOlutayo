import { CalendarPlus, Clock, MapPin, Palette, Shirt } from "lucide-react";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import type { WeddingEvent } from "@/types";

export function EventCard({ event, index }: { event: WeddingEvent; index: number }) {
  const dateBadge = event.id === "traditional" ? "04 Dec" : "05 Dec";

  return (
    <article className="grid overflow-hidden rounded-[2rem] border border-gold/24 bg-white/72 shadow-2xl shadow-green/10 backdrop-blur-sm lg:grid-cols-[0.92fr_1.08fr]">
      <div className={index % 2 === 1 ? "relative min-h-[420px] lg:order-2" : "relative min-h-[420px]"}>
        <Image
          src={event.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 44vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green/90 via-green/18 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-ivory">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-champagne">
            {event.kicker}
          </p>
          <p className="mt-3 font-serif text-5xl font-semibold leading-none">
            {dateBadge}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">
            {event.dateLabel}
          </p>
          <h3 className="mt-4 font-serif text-5xl font-semibold leading-[0.92] text-green sm:text-6xl">
            {event.title}
          </h3>
          <p className="mt-5 text-base leading-8 text-muted">{event.description}</p>
          <p className="mt-4 rounded-2xl border border-gold/18 bg-ivory/70 p-4 text-sm leading-7 text-green">
            {event.theme}
          </p>

          <dl className="mt-7 grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-2xl border border-gold/16 bg-white/70 p-4">
              <dt className="inline-flex items-center gap-2 font-semibold text-green">
                <Clock size={16} /> Time
              </dt>
              <dd className="mt-2 text-muted">{event.time}</dd>
            </div>
            <div className="rounded-2xl border border-gold/16 bg-white/70 p-4">
              <dt className="inline-flex items-center gap-2 font-semibold text-green">
                <MapPin size={16} /> Venue
              </dt>
              <dd className="mt-2 text-muted">{event.venue}</dd>
            </div>
            <div className="rounded-2xl border border-gold/16 bg-white/70 p-4 sm:col-span-2">
              <dt className="inline-flex items-center gap-2 font-semibold text-green">
                <Shirt size={16} /> Dress Code
              </dt>
              <dd className="mt-2 text-muted">{event.dressCode}</dd>
            </div>
            <div className="rounded-2xl border border-gold/16 bg-white/70 p-4 sm:col-span-2">
              <dt className="inline-flex items-center gap-2 font-semibold text-burgundy">
                <Palette size={16} /> Colour Note
              </dt>
              <dd className="mt-2 text-muted">{event.guestNote}</dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href={event.calendarUrl}
              target="_blank"
              rel="noreferrer"
              variant="primary"
              className="min-h-11 px-5 text-xs"
            >
              <CalendarPlus size={16} /> Add to Calendar
            </ButtonLink>
            <ButtonLink href="#" variant="secondary" className="min-h-11 px-5 text-xs">
              <MapPin size={16} /> Google Maps
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}
