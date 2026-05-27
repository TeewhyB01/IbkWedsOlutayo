import type { TimelineGroup, WeddingEvent } from "@/types";

export const weddingEvents: WeddingEvent[] = [
  {
    id: "traditional",
    title: "Traditional Wedding",
    kicker: "Day One / Heritage",
    date: "2026-12-04",
    dateLabel: "Friday, 4th December 2026",
    time: "To be announced",
    venue: "To be announced",
    address: "To be announced",
    dressCode: "Traditional / Cultural Elegance",
    description:
      "Join us as we honour our families, culture, and heritage in a beautiful traditional marriage celebration.",
    image: "/images/wedding/gallery-3.jpg",
    theme: "Family honour, culture, music, colour, and the joy of two lineages becoming one.",
    guestNote:
      "Burgundy and emerald accents are welcome, especially through gele, fila, beads, aso-ebi styling, and elegant cultural pieces.",
    calendarUrl:
      "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Ibukunoluwa%20%26%20Olutayo%20Traditional%20Marriage&dates=20261204/20261205&details=Join%20us%20for%20the%20traditional%20marriage%20celebration.",
  },
  {
    id: "finale",
    title: "The Grand Finale",
    kicker: "Day Two / Forever",
    date: "2026-12-05",
    dateLabel: "Saturday, 5th December 2026",
    time: "To be announced",
    venue: "To be announced",
    address: "To be announced",
    dressCode: "Formal / Elegant Celebration",
    description:
      "Celebrate with us as we mark the beginning of our forever with joy, worship, love, and unforgettable memories.",
    image: "/images/wedding/events-grand-finale.jpg",
    theme: "A refined formal celebration with worship, vows, dinner, dancing, and unforgettable memories.",
    guestNote:
      "Formal wedding guest attire is encouraged. Burgundy and emerald details will sit beautifully with the celebration palette.",
    calendarUrl:
      "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Ibukunoluwa%20%26%20Olutayo%20Grand%20Finale&dates=20261205/20261206&details=Celebrate%20with%20us%20at%20the%20grand%20finale.",
  },
];

export const weddingTimeline: TimelineGroup[] = [
  {
    title: "Traditional Wedding Day",
    date: "4th December 2026",
    items: [
      "Guest Arrival",
      "Family Introduction",
      "Traditional Ceremony",
      "Couple Entrance",
      "Celebration & Photos",
    ],
  },
  {
    title: "Grand Finale Day",
    date: "5th December 2026",
    items: [
      "Guest Arrival",
      "Ceremony",
      "Reception",
      "Couple Entrance",
      "Dinner",
      "Dancing & Celebration",
    ],
  },
];

export const dressCodeNotes = [
  "Wedding colours: Burgundy and Emerald Green, softened with ivory, champagne, gold, or black details.",
  "Traditional Wedding: rich cultural attire, elegant aso-ebi styling, gele, fila, beads, and celebratory textures.",
  "Grand Finale: formal wedding guest attire with a refined evening feel.",
  "Please choose comfortable shoes for celebration, photos, and dancing.",
];
