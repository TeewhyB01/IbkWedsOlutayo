import type { Metadata } from "next";
import Image from "next/image";
import { Banknote, Gift, HeartHandshake, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { CopyDetailButton } from "@/components/registry/CopyDetailButton";
import { ButtonLink } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { weddingImages } from "@/content/images";
import { amazonRegistry, bankTransferOptions } from "@/content/registry";

export const metadata: Metadata = {
  title: "Wedding Registry",
  description:
    "View registry options and gift guidance for Ibukunoluwa and Olutayo's wedding.",
};

export default function RegistryPage() {
  return (
    <>
      <PageHeader
        title="Wedding Registry"
        subtitle="Your presence is our greatest gift, but if you would like to bless us, we are truly grateful."
        image={weddingImages.registryHero}
      />

      <section className="relative overflow-hidden px-5 py-20 sm:px-8 lg:py-28">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <FadeIn>
            <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-gold/24 bg-green shadow-2xl shadow-green/15">
              <Image
                src={weddingImages.gallery[10]}
                alt="Ibukunoluwa and Olutayo in an elegant studio portrait"
                fill
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover object-[center_18%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green/88 via-green/12 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-ivory sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-champagne">
                  With Gratitude
                </p>
                <h2 className="mt-3 max-w-lg font-serif text-5xl font-semibold leading-[0.94] sm:text-6xl">
                  Blessings received with grateful hearts.
                </h2>
              </div>
            </div>
          </FadeIn>

          <div>
            <FadeIn delay={0.1}>
              <p className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase text-burgundy">
                <Sparkles size={16} /> Gift Registry
              </p>
              <h2 className="font-serif text-5xl font-semibold leading-[0.96] text-green text-balance sm:text-6xl">
                Thoughtful ways to celebrate with us
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
                Your presence is our greatest gift. If you would like to bless
                us further, these options have been prepared with care and
                gratitude.
              </p>
            </FadeIn>

            <FadeIn delay={0.18}>
              <article className="mt-10 overflow-hidden rounded-[2rem] border border-gold/24 bg-gradient-to-br from-green via-emerald to-burgundy-deep p-6 text-ivory shadow-2xl shadow-green/14 sm:p-8">
                <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
                  <div>
                    <span className="mb-5 grid size-14 place-items-center rounded-full border border-white/14 bg-white/10 text-champagne">
                      <Gift size={22} />
                    </span>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-champagne">
                      Curated Gift List
                    </p>
                    <h3 className="mt-3 font-serif text-4xl font-semibold">
                      {amazonRegistry.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-ivory/76">
                      {amazonRegistry.description}
                    </p>
                  </div>
                  <ButtonLink
                    href={amazonRegistry.href}
                    target="_blank"
                    rel="noreferrer"
                    variant="light"
                    className="w-full md:w-auto"
                  >
                    Open Amazon Registry
                  </ButtonLink>
                </div>
              </article>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(135deg,#fbf6ec_0%,#f4ead8_46%,#eaf1eb_100%)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mb-10 grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
              <div>
                <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase text-burgundy">
                  <Banknote size={16} /> Bank Transfer
                </p>
                <h2 className="font-serif text-5xl font-semibold leading-[0.96] text-green sm:text-6xl">
                  Direct blessings
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-muted lg:justify-self-end">
                For guests who prefer bank transfer, details are separated by
                currency so giving feels simple and clear.
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-6 lg:grid-cols-2">
            {bankTransferOptions.map((option, index) => (
              <FadeIn key={option.currency} delay={index * 0.08}>
                <article className="relative overflow-hidden rounded-[2rem] border border-gold/24 bg-white/78 p-6 shadow-2xl shadow-gold/12 backdrop-blur-sm sm:p-8">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-burgundy via-gold to-emerald" />
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">
                        {option.currency}
                      </p>
                      <h3 className="mt-3 font-serif text-4xl font-semibold text-green">
                        {option.label}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-muted">{option.note}</p>
                    </div>
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-green text-ivory">
                      <Banknote size={20} />
                    </span>
                  </div>

                  <dl className="mt-7 grid gap-3">
                    <RegistryDetail label="Account Name" value={option.accountName} />
                    <RegistryDetail label="Bank" value={option.bankName} />
                    <RegistryDetail
                      label="Account Number"
                      value={option.accountNumber}
                      copyLabel="Copy Account"
                    />
                    {option.sortCode ? (
                      <RegistryDetail
                        label="Sort Code"
                        value={option.sortCode}
                        copyLabel="Copy Sort Code"
                      />
                    ) : null}
                  </dl>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-24">
        <FadeIn>
          <div className="mx-auto grid max-w-7xl gap-6 rounded-[2rem] border border-gold/22 bg-green p-6 text-ivory shadow-2xl shadow-green/12 sm:p-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <span className="grid size-14 place-items-center rounded-full border border-white/14 bg-white/10 text-champagne">
              <HeartHandshake size={24} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-champagne">
                Cash Gifts
              </p>
              <h2 className="mt-2 font-serif text-4xl font-semibold">
                A reception gift table will be available.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-ivory/72 lg:text-right">
              For guests who prefer to give in person, we will receive every
              blessing with deep gratitude.
            </p>
          </div>
        </FadeIn>
      </section>
    </>
  );
}

function RegistryDetail({
  label,
  value,
  copyLabel,
}: {
  label: string;
  value: string;
  copyLabel?: string;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-gold/16 bg-ivory/78 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <dt className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
          {label}
        </dt>
        <dd className="mt-1 text-base font-semibold text-green">{value}</dd>
      </div>
      {copyLabel ? <CopyDetailButton value={value} label={copyLabel} /> : null}
    </div>
  );
}
