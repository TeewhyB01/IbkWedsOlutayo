"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/home/CountdownTimer";
import { weddingImages } from "@/content/images";
import { couple, homeContent } from "@/content/siteContent";

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-green text-ivory">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 7, ease: "easeOut" }}
      >
        <Image
          src={weddingImages.homeHero}
          alt="Elegant Nigerian wedding inspired backdrop"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] sm:object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-green via-green/72 to-burgundy/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_24%,rgba(227,201,143,0.32),transparent_24rem)]" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-8 pt-28 sm:px-8 lg:justify-end lg:pb-14">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_420px] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <p className="mb-5 inline-flex rounded-full border border-champagne/45 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
              {homeContent.eyebrow}
            </p>
            <h1
              aria-label={couple.displayName}
              className="font-serif text-5xl font-semibold leading-[0.9] text-balance sm:text-7xl md:text-8xl lg:text-9xl"
            >
              <span aria-hidden="true" className="block">
                {couple.bride}
              </span>
              <span aria-hidden="true" className="block">
                &amp; {couple.groom}
              </span>
            </h1>
            <div className="mt-5 flex flex-col gap-3 text-sm text-ivory/86 sm:mt-7 sm:flex-row sm:flex-wrap sm:items-center sm:text-lg">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={18} /> {couple.dateDisplay}
              </span>
              <span className="hidden text-champagne sm:inline">/</span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={18} /> {couple.location}
              </span>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
              <ButtonLink href="/rsvp" variant="light">
                RSVP Now
              </ButtonLink>
              <ButtonLink href="/events" variant="ghost">
                View Events
              </ButtonLink>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[1.75rem] border border-white/16 bg-black/18 p-3 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-5"
          >
            <p className="mb-4 text-center text-sm font-semibold text-champagne">
              Countdown to the Traditional Wedding
            </p>
            <CountdownTimer targetDate={couple.traditionalDate} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
