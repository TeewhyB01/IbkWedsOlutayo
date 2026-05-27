"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CalendarHeart, Gift, Heart, Luggage, MailCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { weddingImages } from "@/content/images";

const cards = [
  {
    title: "Our Story",
    text: "Meet the heart behind the celebration.",
    href: "/our-story",
    image: weddingImages.featureCards.story,
    icon: Heart,
  },
  {
    title: "Events",
    text: "Traditional Wedding and Grand Finale details.",
    href: "/events",
    image: weddingImages.featureCards.events,
    icon: CalendarHeart,
  },
  {
    title: "Travel & Stay",
    text: "Ibadan hotels, travel notes, and city guidance.",
    href: "/travel-stay",
    image: weddingImages.featureCards.travel,
    icon: Luggage,
    attribution: "Mapo Hall, Ibadan",
  },
  {
    title: "Wedding Registry",
    text: "Thoughtful ways to bless the couple.",
    href: "/registry",
    image: weddingImages.featureCards.registry,
    icon: Gift,
  },
  {
    title: "RSVP",
    text: "Confirm attendance with your code.",
    href: "/rsvp",
    image: weddingImages.featureCards.rsvp,
    icon: MailCheck,
  },
];

export function FeatureCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: index * 0.05 }}
          >
            <Link
              href={card.href}
              className="group relative block h-72 overflow-hidden rounded-[1.4rem] border border-gold/20 bg-green shadow-xl shadow-green/10"
            >
              <Image
                src={card.image}
                alt=""
                fill
                sizes="(min-width: 1280px) 20vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green via-green/56 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
                <div className="mb-4 grid size-11 place-items-center rounded-full border border-champagne/40 bg-white/12 backdrop-blur-md">
                  <Icon size={20} />
                </div>
                <h3 className="font-serif text-3xl font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ivory/78">{card.text}</p>
                {"attribution" in card && card.attribution ? (
                  <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory/55">
                    {card.attribution}
                  </p>
                ) : null}
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-champagne">
                  Explore <ArrowUpRight size={16} />
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
