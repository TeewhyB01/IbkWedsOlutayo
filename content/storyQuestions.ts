import { weddingImages } from "@/content/images";
import type { StoryQuestion, WeddingImage } from "@/types";

export const storyIntro =
  "Every love story carries its own rhythm. Ours is a story of friendship, faith, laughter, family, and the quiet certainty that God was writing something beautiful.";

export const storyQuestions: StoryQuestion[] = [
  {
    question: "How did you meet?",
    brideAnswer:
      "Bride's answer goes here. Share the first hello, the setting, and the little details that made the moment memorable.",
    groomAnswer:
      "Groom's answer goes here. Share your side of the story and what stood out when your paths first crossed.",
  },
  {
    question: "What was your first impression?",
    brideAnswer:
      "Bride's answer goes here. Capture the warmth, humour, confidence, or calm you noticed first.",
    groomAnswer:
      "Groom's answer goes here. Describe what drew your attention and stayed with you afterwards.",
  },
  {
    question: "When did you know this was love?",
    brideAnswer:
      "Bride's answer goes here. Share the moment your heart became certain.",
    groomAnswer:
      "Groom's answer goes here. Describe the season or moment that made forever feel natural.",
  },
  {
    question: "What do you admire most about each other?",
    brideAnswer:
      "Bride's answer goes here. Mention the qualities you honour and cherish.",
    groomAnswer:
      "Groom's answer goes here. Speak to the character, grace, and joy you see in your bride.",
  },
  {
    question: "What are you most looking forward to in marriage?",
    brideAnswer:
      "Bride's answer goes here. Share the dreams, home, growth, and adventures you are excited for.",
    groomAnswer:
      "Groom's answer goes here. Share what you are ready to build, protect, and celebrate together.",
  },
  {
    question: "What message do you have for your guests?",
    brideAnswer:
      "Bride's answer goes here. Thank your family and friends for loving, praying, and celebrating with you.",
    groomAnswer:
      "Groom's answer goes here. Add your gratitude and excitement for everyone joining the celebration.",
  },
];

const galleryDetails = [
  {
    alt: "Ibukunoluwa and Olutayo in a romantic hallway portrait",
    caption: "A quiet portrait from the beginning of forever",
  },
  {
    alt: "The proposal framed by roses and candlelight",
    caption: "The yes that changed everything",
  },
  {
    alt: "Ibukunoluwa and Olutayo in traditional attire",
    caption: "Honouring culture, family, and joy",
  },
  {
    alt: "A close-up of Olutayo placing Ibukunoluwa's engagement ring",
    caption: "The ring, the promise, the moment",
  },
  {
    alt: "Olutayo kissing Ibukunoluwa's forehead in traditional attire",
    caption: "Soft laughter and a love that feels like home",
  },
  {
    alt: "Ibukunoluwa smiling in her traditional outfit and gele",
    caption: "Ibukunoluwa, radiant and elegant",
  },
  {
    alt: "Olutayo seated beside Ibukunoluwa in a formal studio portrait",
    caption: "A portrait of two families becoming one",
  },
  {
    alt: "Ibukunoluwa and Olutayo laughing together in traditional attire",
    caption: "The kind of joy guests will feel all weekend",
  },
  {
    alt: "Ibukunoluwa and Olutayo smiling together in front of a cultural mural",
    caption: "Rooted in heritage, stepping into forever",
  },
  {
    alt: "Ibukunoluwa standing beside Olutayo in a white studio portrait",
    caption: "A clean portrait with a grand finale feeling",
  },
  {
    alt: "Ibukunoluwa and Olutayo looking at each other in formal white and beige",
    caption: "Soft joy, quiet confidence, and forever in view",
  },
  {
    alt: "Ibukunoluwa resting beside Olutayo in an intimate studio close-up",
    caption: "A peaceful moment between two hearts",
  },
  {
    alt: "Ibukunoluwa smiling in a white bridal-inspired outfit",
    caption: "Ibukunoluwa, graceful and radiant",
  },
  {
    alt: "Olutayo smiling in a beige suit portrait",
    caption: "Olutayo, composed and joyful",
  },
];

export const galleryImages: WeddingImage[] = weddingImages.gallery.map(
  (src, index) => ({
    src,
    alt: galleryDetails[index]?.alt ?? "Ibukunoluwa and Olutayo wedding portrait",
    caption: galleryDetails[index]?.caption ?? "A moment from our love story",
  }),
);
