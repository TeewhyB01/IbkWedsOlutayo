import type { FaqItem, HotelRecommendation, VenueInfo } from "@/types";

export const travelVenues: VenueInfo[] = [
  {
    title: "Traditional Wedding Venue",
    date: "4th December 2026",
    venue: "To be announced",
    address: "Ibadan, Oyo State. Full address to be announced.",
    mapsUrl: "#",
  },
  {
    title: "Grand Finale Venue",
    date: "5th December 2026",
    venue: "To be announced",
    address: "Ibadan, Oyo State. Full address to be announced.",
    mapsUrl: "#",
  },
];

export const hotelRecommendations: HotelRecommendation[] = [
  {
    name: "Waterfield Luxury Hotel Ibadan",
    address:
      "Plot 2 & 3 Basorun Estate by Akobo Police Station, behind FOODCO Supermarket, Akobo, Ibadan.",
    distance: "Good Akobo/Basorun-side option. Exact venue distance to be confirmed.",
    priceRange: "Confirm directly",
    bookingUrl: "https://waterfieldluxhotel.com/contact/",
    notes:
      "A polished luxury option to consider for guests who want a calmer stay around Akobo.",
  },
  {
    name: "Adis Hotels",
    address: "5 Ibrahim Taiwo Avenue, New Bodija, Ibadan.",
    distance: "Central Bodija option. Exact venue distance to be confirmed.",
    priceRange: "Confirm directly",
    bookingUrl: "https://adishotels.com/home",
    notes:
      "A neat, quiet guest-friendly hotel option with restaurant and airport/train pickup support available by request.",
  },
  {
    name: "Kakanfo Inn & Conference Centre",
    address:
      "1 Nihinlola Street, off Mobil Petrol Station, off Joyce'B Area, Ring Road, Ibadan.",
    distance: "Ring Road option. Exact venue distance to be confirmed.",
    priceRange: "Confirm directly",
    bookingUrl: "https://www.kakanfoinn.com/",
    notes:
      "A known Ibadan hotel and event-centre option with a practical location for guests moving around the city.",
  },
  {
    name: "The Carlton Gate Hotel",
    address: "Quarters 860, Agodi GRA, Ibadan.",
    distance: "Agodi GRA option. Exact venue distance to be confirmed.",
    priceRange: "Confirm directly",
    bookingUrl: "https://hotels.ng/hotel/46138-carlton-gate-hotel-ibadan-oyo",
    notes:
      "A city option around Agodi GRA for guests who prefer a quieter residential area.",
  },
  {
    name: "BON Hotel Nest Bodija Ibadan",
    address: "Plot A, Oduduwa Street, off Adeyi Street, Old Bodija, Ibadan.",
    distance: "Old Bodija option. Exact venue distance to be confirmed.",
    priceRange: "Confirm directly",
    bookingUrl: "https://www.bonhotels.com/nest",
    notes:
      "A modern Bodija stay option with amenities suited to wedding guests and weekend travel.",
  },
];

export const travelFaqs: FaqItem[] = [
  {
    question: "What is the nearest airport?",
    answer:
      "Ibadan Airport is the closest airport for local arrivals. Guests flying internationally may also consider Lagos and continue to Ibadan by road with trusted transport.",
  },
  {
    question: "What transport options should guests consider?",
    answer:
      "We recommend arranging trusted taxis, ride-hailing services, hotel cars, or family-coordinated transport. Shuttle details will be added if available.",
  },
  {
    question: "Will parking be available?",
    answer:
      "Parking information will be shared with the final venue details. Please plan to arrive early once timings are published, especially for the Grand Finale.",
  },
  {
    question: "What time should guests arrive?",
    answer:
      "Please aim to arrive 30 to 45 minutes before the published start time so you can settle in comfortably.",
  },
  {
    question: "Any travel notes for the dress code?",
    answer:
      "For traditional attire, consider garment bags, gele/fila protection, and comfortable footwear. For the Grand Finale, formalwear in burgundy, emerald, ivory, champagne, or gold accents will photograph beautifully.",
  },
  {
    question: "Any safety guidance?",
    answer:
      "Travel with trusted drivers where possible, keep valuables close, and share your route with family or friends.",
  },
];
