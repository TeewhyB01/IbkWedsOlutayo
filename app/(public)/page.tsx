import Image from "next/image";
import type { ReactNode } from "react";
import { CalendarHeart, MapPin, Sparkles } from "lucide-react";

import { FeatureCards } from "@/components/home/FeatureCards";
import { HeroSection } from "@/components/home/HeroSection";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { VideoReels } from "@/components/media/VideoReels";
import { ButtonLink } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { weddingImages } from "@/content/images";
import { homeContent, weddingPalette } from "@/content/siteContent";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="relative overflow-hidden bg-green px-5 py-20 text-ivory sm:px-8 lg:py-28">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(227,201,143,0.4) 1px, transparent 1px), linear-gradient(rgba(227,201,143,0.28) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-burgundy/22" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-champagne">
                <Sparkles size={16} /> The Weekend
              </p>
              <h2 className="mt-5 font-serif text-5xl font-semibold leading-[0.95] text-balance sm:text-6xl lg:text-7xl">
                A wedding weekend with presence, heritage, and joy in every detail.
              </h2>
              <p className="mt-7 max-w-2xl text-base leading-8 text-ivory/76">
                {homeContent.welcome}
              </p>
              <p className="mt-6 max-w-2xl font-serif text-3xl font-semibold leading-tight text-champagne sm:text-4xl">
                {homeContent.longerWelcome}
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <WeekendMoment
                  icon={<CalendarHeart size={18} />}
                  kicker="Friday"
                  label="Traditional Wedding"
                  value="4 Dec 2026"
                />
                <WeekendMoment
                  icon={<CalendarHeart size={18} />}
                  kicker="Saturday"
                  label="The Grand Finale"
                  value="5 Dec 2026"
                />
                <WeekendMoment
                  icon={<MapPin size={18} />}
                  kicker="City"
                  label="Ibadan"
                  value="Nigeria"
                />
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.12}>
            <div className="grid min-h-[620px] gap-4 sm:grid-cols-[1.05fr_0.85fr]">
              <div className="group relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/14 bg-burgundy shadow-2xl shadow-black/20 sm:min-h-[620px]">
                <Image
                  src={weddingImages.storyFeature}
                  alt="Ibukunoluwa and Olutayo smiling together"
                  fill
                  sizes="(min-width: 1024px) 36vw, 100vw"
                  className="object-cover object-center transition duration-700 group-hover:scale-105"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green/92 via-green/18 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-champagne">
                    #BecomingTheBensons
                  </p>
                  <p className="mt-3 max-w-sm font-serif text-4xl font-semibold leading-none sm:text-5xl">
                    Two families, one beautiful beginning.
                  </p>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="relative min-h-[260px] overflow-hidden rounded-[1.5rem] border border-white/14 bg-ivory">
                  <Image
                    src={weddingImages.homeBannerTwo}
                    alt="A romantic wedding portrait detail"
                    fill
                    sizes="(min-width: 1024px) 26vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy/78 to-transparent" />
                  <p className="absolute bottom-5 left-5 right-5 font-serif text-3xl font-semibold leading-none">
                    Burgundy warmth. Emerald depth.
                  </p>
                </div>
                <div className="relative min-h-[250px] overflow-hidden rounded-[1.5rem] border border-white/14 bg-ivory">
                  <Image
                    src={weddingImages.ibadanMonument}
                    alt="A landmark view in Ibadan"
                    fill
                    sizes="(min-width: 1024px) 26vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green/86 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-champagne">
                      Celebration City
                    </p>
                    <p className="mt-2 font-serif text-3xl font-semibold leading-none">
                      Ibadan welcomes the weekend.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="bg-green px-5 py-20 text-ivory sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase text-champagne">
                  Discover
                </p>
                <h2 className="font-serif text-5xl font-semibold leading-[0.98] text-balance sm:text-6xl">
                  Everything for the wedding weekend
                </h2>
              </div>
              <p className="max-w-lg text-sm leading-7 text-ivory/72">
                From our story to the RSVP, each page has been designed to make
                the celebration feel effortless for every guest.
              </p>
            </div>
          </FadeIn>
          <FeatureCards />
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <FadeIn>
            <SectionHeading eyebrow="In Motion" title="A love that feels alive">
              <p>
                A few moving glimpses of the joy, culture, laughter, and quiet
                tenderness leading into the wedding weekend.
              </p>
              <div className="mt-8 rounded-[1.5rem] border border-gold/24 bg-white/64 p-6 shadow-xl shadow-gold/10">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-burgundy">
                  Wedding colours
                </p>
                <p className="mt-3 text-sm leading-7 text-muted">{weddingPalette.note}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {weddingPalette.colors.map((color) => (
                    <span
                      key={color.name}
                      className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-ivory px-3 py-2 text-xs font-semibold text-green"
                    >
                      <span
                        className="size-4 rounded-full border border-black/10"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.name}
                    </span>
                  ))}
                </div>
              </div>
            </SectionHeading>
          </FadeIn>
          <VideoReels compact />
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl space-y-8">
          {homeContent.imageLedSections.map((section, index) => (
            <FadeIn key={section.title} delay={index * 0.06}>
              <article className="group relative min-h-[420px] overflow-hidden rounded-[2rem] border border-gold/20 bg-green shadow-2xl shadow-green/10">
                <Image
                  src={section.image}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green/90 via-green/50 to-transparent" />
                <div className="relative flex min-h-[420px] max-w-2xl flex-col justify-end p-7 text-ivory sm:p-10 lg:p-14">
                  <p className="mb-3 text-sm font-semibold text-champagne">
                    0{index + 1}
                  </p>
                  <h3 className="font-serif text-5xl font-semibold leading-none sm:text-6xl">
                    {section.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-8 text-ivory/78">
                    {section.text}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:pb-28">
        <FadeIn>
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-gold/30 bg-green px-7 py-14 text-center text-ivory shadow-2xl shadow-green/15 sm:px-12">
            <p className="mx-auto max-w-3xl font-serif text-5xl font-semibold leading-[0.98] text-balance sm:text-6xl">
              Celebrate with us. Confirm your attendance using your invitation code.
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ivory/76">
              {homeContent.finalCta}
            </p>
            <ButtonLink href="/rsvp" variant="light" className="mt-8">
              RSVP Now
            </ButtonLink>
          </div>
        </FadeIn>
      </section>
    </>
  );
}

function WeekendMoment({
  icon,
  kicker,
  label,
  value,
}: {
  icon: ReactNode;
  kicker: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-white/14 bg-white/10 p-4 backdrop-blur-md">
      <span className="grid size-10 place-items-center rounded-full bg-champagne text-green">
        {icon}
      </span>
      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-champagne">
        {kicker}
      </p>
      <p className="mt-2 font-serif text-2xl font-semibold leading-none">{label}</p>
      <p className="mt-2 text-sm font-semibold text-ivory/70">{value}</p>
    </div>
  );
}
