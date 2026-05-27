import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { StoryQA } from "@/components/story/StoryQA";
import { ImageGallery } from "@/components/story/ImageGallery";
import { FadeIn } from "@/components/ui/FadeIn";
import { weddingImages } from "@/content/images";
import { galleryImages, storyIntro, storyQuestions } from "@/content/storyQuestions";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Read the love story of Ibukunoluwa and Olutayo and view their wedding gallery.",
};

export default function OurStoryPage() {
  return (
    <>
      <PageHeader
        title="Our Story"
        subtitle="A love story shaped by friendship, faith, family, and the beautiful promise of forever."
        image={weddingImages.ourStoryHero}
      />

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="grid overflow-hidden rounded-[2rem] border border-gold/24 bg-white/72 shadow-2xl shadow-green/10 backdrop-blur-sm lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[520px] bg-green">
                <Image
                  src={weddingImages.storyFeature}
                  alt="Ibukunoluwa and Olutayo sharing a soft portrait moment"
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-[1.25rem] border border-white/16 bg-white/10 p-5 text-ivory backdrop-blur-md">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-champagne">
                    From Our Hearts
                  </p>
                  <p className="mt-2 font-serif text-3xl font-semibold leading-none">
                    Friendship, faith, laughter, forever.
                  </p>
                </div>
              </div>
              <div className="p-7 sm:p-10 lg:p-12">
                <SectionHeading eyebrow="From Our Hearts" title="The story only we can tell">
                  <p>{storyIntro}</p>
                </SectionHeading>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {["Faith", "Family", "Forever"].map((word) => (
                    <div
                      key={word}
                      className="rounded-[1.1rem] border border-gold/18 bg-ivory/70 p-4"
                    >
                      <p className="font-serif text-3xl font-semibold text-burgundy">
                        {word}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.12}>
            <div className="mt-12">
              <div className="mb-8 max-w-3xl">
                <p className="mb-3 text-sm font-semibold uppercase text-gold">
                  Q&A
                </p>
                <h2 className="font-serif text-5xl font-semibold leading-[0.98] text-green text-balance sm:text-6xl">
                  Two voices, one story
                </h2>
              </div>
            </div>
            <StoryQA questions={storyQuestions} />
          </FadeIn>
        </div>
      </section>

      <section className="bg-green px-5 py-20 text-ivory sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-sm font-semibold uppercase text-champagne">
                Gallery
              </p>
              <h2 className="font-serif text-5xl font-semibold leading-[0.98] text-balance sm:text-6xl">
                Moments we will keep forever
              </h2>
              <p className="mt-5 text-base leading-8 text-ivory/74">
                A curated space for the memories, portraits, and celebration
                moments that will tell this story in images.
              </p>
            </div>
          </FadeIn>
          <ImageGallery images={galleryImages} />
        </div>
      </section>
    </>
  );
}
