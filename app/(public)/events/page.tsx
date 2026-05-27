import type { Metadata } from "next";
import Image from "next/image";
import { CalendarHeart, CheckCircle2, Gem, Sparkles } from "lucide-react";

import { EventCard } from "@/components/events/EventCard";
import { WeddingTimeline } from "@/components/events/WeddingTimeline";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { VideoReels } from "@/components/media/VideoReels";
import { ButtonLink } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { dressCodeNotes, weddingEvents, weddingTimeline } from "@/content/events";
import { weddingImages } from "@/content/images";
import { weddingPalette } from "@/content/siteContent";

export const metadata: Metadata = {
  title: "Events",
  description:
    "View the Traditional Wedding and Grand Finale details for Ibukunoluwa and Olutayo's wedding weekend.",
};

export default function EventsPage() {
  return (
    <>
      <PageHeader
        title="Wedding Events"
        subtitle="Two beautiful celebrations: a traditional wedding honouring culture and a grand finale filled with worship, joy, and unforgettable style."
        image={weddingImages.eventsHero}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/rsvp" variant="light">
            RSVP Now
          </ButtonLink>
          <ButtonLink href="#weekend-flow" variant="ghost">
            View Timeline
          </ButtonLink>
        </div>
      </PageHeader>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[2rem] border border-gold/24 bg-green shadow-2xl shadow-green/15">
              <Image
                src={weddingImages.eventsEditorialPoster}
                alt=""
                width={1600}
                height={1000}
                className="aspect-[4/3] h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green/86 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-ivory sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-champagne">
                  4th & 5th December 2026
                </p>
                <p className="mt-3 max-w-xl font-serif text-4xl font-semibold leading-none sm:text-5xl">
                  A weekend designed in burgundy, emerald, and joy.
                </p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.12}>
            <SectionHeading eyebrow="Weekend Details" title="The celebration edit">
              <p>
                The weekend is being shaped with culture, colour, worship,
                movement, and a clear rhythm from the first arrival to the
                final dance.
              </p>
            </SectionHeading>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {weddingPalette.colors.slice(0, 2).map((color) => (
                <div
                  key={color.name}
                  className="rounded-[1.25rem] border border-gold/20 bg-white/70 p-5 shadow-lg shadow-gold/10"
                >
                  <span
                    className="block h-16 rounded-[1rem] border border-black/10"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-green">
                    {color.name}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="mx-auto max-w-7xl space-y-8">
          {weddingEvents.map((event, index) => (
            <FadeIn key={event.id} delay={index * 0.08}>
              <EventCard event={event} index={index} />
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-green via-emerald to-burgundy-deep px-5 py-20 text-ivory sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
          <FadeIn>
            <div>
              <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase text-champagne">
                <Sparkles size={16} /> Wedding Film Notes
              </p>
              <h2 className="font-serif text-5xl font-semibold leading-[0.98] sm:text-6xl">
                Motion, colour, and presence
              </h2>
              <p className="mt-5 text-base leading-8 text-ivory/74">
                A glimpse of the warmth, laughter, and cultural beauty that
                will carry the weekend from ceremony to celebration.
              </p>
            </div>
          </FadeIn>
          <VideoReels compact />
        </div>
      </section>

      <section
        id="weekend-flow"
        className="relative overflow-hidden border-y border-gold/18 bg-[linear-gradient(135deg,#fbf6ec_0%,#f4ead8_48%,#e7efe8_100%)] px-5 py-20 text-green sm:px-8 lg:py-28"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase text-burgundy">
                  <CalendarHeart size={16} /> Weekend Flow
                </p>
                <h2 className="font-serif text-5xl font-semibold leading-[0.96] text-balance sm:text-6xl">
                  A graceful rhythm for both days
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-muted lg:justify-self-end">
                The order of celebration is intentionally simple: arrive, be
                present, honour the moment, and move into joy with family and
                friends.
              </p>
            </div>
          </FadeIn>
          <WeddingTimeline groups={weddingTimeline} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-green px-5 py-20 text-ivory sm:px-8 lg:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(122,31,53,0.4),rgba(11,61,49,0.72)_44%,rgba(5,38,30,0.95))]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <FadeIn>
            <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/12 shadow-2xl shadow-black/24">
              <Image
                src={weddingImages.eventsBride}
                alt="Ibukunoluwa in an elegant wedding portrait"
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-[center_18%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green/72 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-champagne">
                  Wedding Colours
                </p>
                <p className="mt-3 font-serif text-4xl font-semibold leading-none">
                  Burgundy & Emerald Green
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="lg:pl-8">
              <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase text-champagne">
                <Gem size={16} /> Dress Code
              </p>
              <h2 className="font-serif text-5xl font-semibold leading-[0.96] text-balance sm:text-6xl">
                Arrive beautifully
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-ivory/78">
                Think polished, celebratory, and camera-ready. The palette is
                rich, romantic, and regal, with room for personal elegance.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {weddingPalette.colors.slice(0, 2).map((color) => (
                  <div
                    key={color.name}
                    className="inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/8 px-4 py-3 backdrop-blur-sm"
                  >
                    <span
                      className="size-8 rounded-full border border-white/20"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-sm font-bold uppercase tracking-[0.16em] text-ivory/88">
                      {color.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 divide-y divide-white/12 border-y border-white/12">
                {dressCodeNotes.map((note) => (
                  <div key={note} className="grid grid-cols-[2.75rem_1fr] gap-4 py-5">
                    <span className="mt-1 grid size-9 place-items-center rounded-full border border-champagne/40 text-champagne">
                      <CheckCircle2 size={17} />
                    </span>
                    <p className="text-sm leading-7 text-ivory/78">{note}</p>
                  </div>
                ))}
              </div>

              <p className="mt-7 max-w-xl text-sm italic leading-7 text-champagne/88">
                The goal is not uniformity. It is harmony: rich colour,
                thoughtful tailoring, and celebration-ready confidence.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
