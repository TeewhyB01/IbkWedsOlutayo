import type { Metadata } from "next";
import Image from "next/image";
import { BedDouble, MapPinned, Plane } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { TravelCard } from "@/components/travel/TravelCard";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { FadeIn } from "@/components/ui/FadeIn";
import { ButtonLink } from "@/components/ui/Button";
import { weddingImages } from "@/content/images";
import { hotelRecommendations, travelFaqs, travelVenues } from "@/content/travel";

export const metadata: Metadata = {
  title: "Travel & Stay",
  description:
    "Everything guests need to plan their journey and stay for Ibukunoluwa and Olutayo's wedding celebration.",
};

export default function TravelStayPage() {
  return (
    <>
      <PageHeader
        title="Travel & Stay"
        subtitle="Everything you need to plan your journey and stay for our wedding celebration."
        image={weddingImages.travelHero}
      />

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <FadeIn>
            <div className="relative overflow-hidden rounded-[2rem] border border-gold/24 bg-green shadow-2xl shadow-green/15">
              <Image
                src={weddingImages.ibadanMonument}
                alt="Mapo Hall, a landmark monument in Ibadan"
                width={1800}
                height={1200}
                className="aspect-[16/10] h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green/72 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.25rem] border border-white/16 bg-white/10 p-5 text-ivory backdrop-blur-md">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-champagne">
                  Ibadan Landmark
                </p>
                <p className="mt-2 font-serif text-3xl font-semibold leading-none">
                  Mapo Hall, Ibadan
                </p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.12}>
            <SectionHeading eyebrow="City Guide" title="Ibadan awaits">
              <p>
                A city of history, family, movement, and celebration. Hotel
                options around Ibadan are listed below while the exact venue
                addresses are being finalised.
              </p>
              <p className="mt-4 text-xs leading-6 text-muted">
                Landmark image: Mapo Hall, Ibadan. Source: Omoeko Media /
                Wikimedia Commons, CC BY-SA 4.0.
              </p>
            </SectionHeading>
          </FadeIn>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHeading eyebrow="Venues" title="Wedding locations">
              <p>
                Ceremony addresses, maps, and directions will sit here for a
                calm, well-planned guest arrival.
              </p>
            </SectionHeading>
          </FadeIn>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {travelVenues.map((venue, index) => (
              <FadeIn key={venue.title} delay={index * 0.08}>
                <TravelCard
                  title={venue.title}
                  primary={`${venue.venue} / ${venue.date}`}
                  secondary={venue.address}
                  meta="Venue details to be announced"
                  href={venue.mapsUrl}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-green px-5 py-20 text-ivory sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-10 grid gap-6 lg:grid-cols-[0.85fr_1fr] lg:items-end">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase text-champagne">
                  Accommodation
                </p>
                <h2 className="font-serif text-5xl font-semibold leading-[0.98] sm:text-6xl">
                  Recommended stays
                </h2>
              </div>
              <p className="text-base leading-8 text-ivory/72">
                Recommended accommodation options for guests who want to stay
                close to the wedding celebrations.
              </p>
            </div>
          </FadeIn>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {hotelRecommendations.map((hotel, index) => (
              <FadeIn key={hotel.name} delay={index * 0.08}>
                <article className="h-full rounded-[1.5rem] border border-white/14 bg-white/10 p-6 shadow-2xl shadow-black/12 backdrop-blur-md">
                  <div className="mb-5 grid size-12 place-items-center rounded-full bg-champagne text-green">
                    <BedDouble size={20} />
                  </div>
                  <h3 className="font-serif text-3xl font-semibold">{hotel.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-ivory/76">
                    {hotel.address}
                  </p>
                  <dl className="mt-5 space-y-3 text-sm">
                    <div>
                      <dt className="font-semibold text-champagne">Distance</dt>
                      <dd className="text-ivory/75">{hotel.distance}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-champagne">Price Range</dt>
                      <dd className="text-ivory/75">{hotel.priceRange}</dd>
                    </div>
                  </dl>
                  <p className="mt-5 text-sm leading-7 text-ivory/70">{hotel.notes}</p>
                  <ButtonLink
                    href={hotel.bookingUrl}
                    variant="ghost"
                    className="mt-6 min-h-11 px-5 text-xs"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Booking Link
                  </ButtonLink>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <FadeIn>
            <SectionHeading eyebrow="Travel Tips" title="Guest guidance">
              <p>
                Helpful notes for airport choices, transport, parking, arrival
                timing, dress code planning, and safe movement around the city.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gold/20 bg-white/60 p-5">
                  <Plane className="text-burgundy" size={22} />
                  <p className="mt-4 text-sm font-semibold text-green">
                    Ibadan Airport
                  </p>
                </div>
                <div className="rounded-2xl border border-gold/20 bg-white/60 p-5">
                  <MapPinned className="text-burgundy" size={22} />
                  <p className="mt-4 text-sm font-semibold text-green">
                    Ibadan city stays
                  </p>
                </div>
              </div>
            </SectionHeading>
          </FadeIn>
          <FadeIn delay={0.12}>
            <FAQAccordion items={travelFaqs} />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
