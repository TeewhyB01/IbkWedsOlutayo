import Link from "next/link";
import { CalendarDays, Heart, MapPin } from "lucide-react";

import { couple, navigationLinks } from "@/content/siteContent";
import { WeddingLogo } from "@/components/layout/WeddingLogo";
import { ButtonLink } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gold/20 bg-green text-ivory">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(122,31,53,0.78),rgba(11,61,49,0.92)_42%,rgba(5,38,30,1))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-10 border-b border-white/12 pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-champagne">
              {couple.hashtag}
            </p>
            <h2 className="max-w-3xl font-serif text-5xl font-semibold leading-[0.94] text-balance sm:text-6xl">
              Two families, one beginning, and a weekend we will never forget.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <ButtonLink href="/rsvp" variant="light">
              RSVP Now
            </ButtonLink>
            <ButtonLink href="/events" variant="ghost">
              View Events
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <WeddingLogo />
            <p className="mt-5 max-w-md text-sm leading-7 text-ivory/72">
              With grateful hearts, we cannot wait to celebrate this beautiful
              wedding weekend with our family and friends.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-champagne">Wedding Weekend</p>
            <div className="mt-5 space-y-4 text-sm text-ivory/75">
              <p className="inline-flex items-center gap-3">
                <CalendarDays size={17} className="text-champagne" />
                {couple.dateDisplay}
              </p>
              <p className="inline-flex items-center gap-3">
                <MapPin size={17} className="text-champagne" />
                {couple.location}
              </p>
              <p className="inline-flex items-center gap-3">
                <Heart size={17} className="text-champagne" />
                Burgundy & Emerald Green
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-champagne">Explore</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-ivory/75">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-champagne"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/12 pt-6 text-xs text-ivory/58 sm:flex-row sm:items-center sm:justify-between">
          <p>{couple.hashtag} wedding website.</p>
          <p>Created by Olutayo.</p>
        </div>
      </div>
    </footer>
  );
}
