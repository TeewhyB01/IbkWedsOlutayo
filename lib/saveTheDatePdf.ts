import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  PDFDocument,
  PDFName,
  PDFString,
  type PDFFont,
  type PDFImage,
  type PDFPage,
  rgb,
  StandardFonts,
} from "pdf-lib";
import QRCode from "qrcode";

import { couple } from "@/content/siteContent";
import type { GuestRecord } from "@/types";

const pageSize: [number, number] = [540, 960];
const weddingWebsiteUrl = "https://thebensons26.vercel.app/";
const ivory = rgb(0.984, 0.969, 0.933);
const champagne = rgb(0.89, 0.78, 0.55);
const emerald = rgb(0.043, 0.318, 0.247);
const deepEmerald = rgb(0.02, 0.09, 0.075);
const burgundy = rgb(0.478, 0.122, 0.208);
const ink = rgb(0.11, 0.105, 0.09);

type FontSet = {
  serif: PDFFont;
  serifBold: PDFFont;
  serifItalic: PDFFont;
  sans: PDFFont;
  sansBold: PDFFont;
};

function coverImage({
  imageWidth,
  imageHeight,
  pageWidth,
  pageHeight,
}: {
  imageWidth: number;
  imageHeight: number;
  pageWidth: number;
  pageHeight: number;
}) {
  const scale = Math.max(pageWidth / imageWidth, pageHeight / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;

  return {
    x: (pageWidth - width) / 2,
    y: (pageHeight - height) / 2,
    width,
    height,
  };
}

function drawCenteredText({
  page,
  text,
  font,
  size,
  y,
  color = ivory,
  opacity = 1,
}: {
  page: PDFPage;
  text: string;
  font: PDFFont;
  size: number;
  y: number;
  color?: ReturnType<typeof rgb>;
  opacity?: number;
}) {
  const { width } = page.getSize();
  const textWidth = font.widthOfTextAtSize(text, size);

  page.drawText(text, {
    x: (width - textWidth) / 2,
    y,
    size,
    font,
    color,
    opacity,
  });
}

function drawLetterSpacedText({
  page,
  text,
  x,
  y,
  size,
  font,
  color,
  spacing = 2.4,
  opacity = 1,
}: {
  page: PDFPage;
  text: string;
  x: number;
  y: number;
  size: number;
  font: PDFFont;
  color: ReturnType<typeof rgb>;
  spacing?: number;
  opacity?: number;
}) {
  let cursor = x;

  for (const character of text) {
    page.drawText(character, {
      x: cursor,
      y,
      size,
      font,
      color,
      opacity,
    });
    cursor += font.widthOfTextAtSize(character, size) + spacing;
  }
}

function letterSpacedWidth(text: string, font: PDFFont, size: number, spacing = 2.4) {
  return (
    text
      .split("")
      .reduce((width, character) => width + font.widthOfTextAtSize(character, size), 0) +
    Math.max(text.length - 1, 0) * spacing
  );
}

function drawCenteredLetterSpacedText({
  page,
  text,
  y,
  size,
  font,
  color,
  spacing = 2.4,
  opacity = 1,
}: {
  page: PDFPage;
  text: string;
  y: number;
  size: number;
  font: PDFFont;
  color: ReturnType<typeof rgb>;
  spacing?: number;
  opacity?: number;
}) {
  drawLetterSpacedText({
    page,
    text,
    x: (page.getWidth() - letterSpacedWidth(text, font, size, spacing)) / 2,
    y,
    size,
    font,
    color,
    spacing,
    opacity,
  });
}

function drawInsetFrame(page: PDFPage, inset: number, opacity = 0.92) {
  const { width, height } = page.getSize();

  page.drawRectangle({
    x: inset,
    y: inset,
    width: width - inset * 2,
    height: height - inset * 2,
    borderColor: champagne,
    borderWidth: 0.75,
    opacity,
  });
  page.drawRectangle({
    x: inset + 9,
    y: inset + 9,
    width: width - (inset + 9) * 2,
    height: height - (inset + 9) * 2,
    borderColor: ivory,
    borderWidth: 0.25,
    opacity: 0.45,
  });
}

function drawMonogram(page: PDFPage, fonts: FontSet, x: number, y: number) {
  page.drawRectangle({
    x,
    y,
    width: 54,
    height: 54,
    color: ivory,
    borderColor: champagne,
    borderWidth: 0.75,
    opacity: 0.94,
  });
  page.drawText("B", {
    x: x + 18.5,
    y: y + 13,
    size: 29,
    font: fonts.serifBold,
    color: emerald,
  });
}

function fittedTextSize(
  text: string,
  font: PDFFont,
  maxWidth: number,
  preferredSize: number,
  minSize: number,
) {
  let size = preferredSize;

  while (font.widthOfTextAtSize(text, size) > maxWidth && size > minSize) {
    size -= 0.5;
  }

  return size;
}

function addLinkAnnotation({
  pdf,
  page,
  url,
  x,
  y,
  width,
  height,
}: {
  pdf: PDFDocument;
  page: PDFPage;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  const annotation = pdf.context.obj({
    Type: PDFName.of("Annot"),
    Subtype: PDFName.of("Link"),
    Rect: [x, y, x + width, y + height],
    Border: [0, 0, 0],
    A: {
      Type: PDFName.of("Action"),
      S: PDFName.of("URI"),
      URI: PDFString.of(url),
    },
  });

  page.node.addAnnot(pdf.context.register(annotation));
}

async function embedJpgFromPublic(pdf: PDFDocument, filename: string) {
  const imageBytes = await readFile(
    path.join(process.cwd(), "public", "images", "wedding", filename),
  );

  return pdf.embedJpg(imageBytes);
}

async function embedWebsiteQr(pdf: PDFDocument) {
  const qrDataUrl = await QRCode.toDataURL(weddingWebsiteUrl, {
    errorCorrectionLevel: "M",
    margin: 1,
    scale: 8,
    color: {
      dark: "#0b513f",
      light: "#fbf7ee",
    },
  });
  const qrBase64 = qrDataUrl.split(",")[1] ?? "";

  return pdf.embedPng(Buffer.from(qrBase64, "base64"));
}

function drawPhotoBackground(page: PDFPage, image: PDFImage) {
  const { width, height } = page.getSize();
  page.drawImage(
    image,
    coverImage({
      imageWidth: image.width,
      imageHeight: image.height,
      pageWidth: width,
      pageHeight: height,
    }),
  );
}

function drawInvitationEventRow({
  page,
  fonts,
  x,
  y,
  accent,
  day,
  month,
  weekday,
  title,
  date,
}: {
  page: PDFPage;
  fonts: FontSet;
  x: number;
  y: number;
  accent: ReturnType<typeof rgb>;
  day: string;
  month: string;
  weekday: string;
  title: string;
  date: string;
}) {
  const width = 372;

  page.drawRectangle({
    x,
    y,
    width,
    height: 78,
    color: rgb(0.996, 0.988, 0.958),
    borderColor: champagne,
    borderWidth: 0.45,
  });
  page.drawRectangle({
    x: x + 16,
    y: y + 14,
    width: 52,
    height: 50,
    color: accent,
    opacity: 0.96,
  });
  page.drawText(day, {
    x: x + 28,
    y: y + 35,
    size: 19,
    font: fonts.serifBold,
    color: ivory,
  });
  page.drawText(month, {
    x: x + 28,
    y: y + 22,
    size: 7.5,
    font: fonts.sansBold,
    color: champagne,
  });
  page.drawText(weekday.toUpperCase(), {
    x: x + 88,
    y: y + 52,
    size: 8,
    font: fonts.sansBold,
    color: accent,
  });
  page.drawText(title, {
    x: x + 88,
    y: y + 28,
    size: 22,
    font: fonts.serifBold,
    color: emerald,
  });
  page.drawText(date, {
    x: x + 88,
    y: y + 13,
    size: 8.8,
    font: fonts.sansBold,
    color: ink,
    opacity: 0.72,
  });
}

function drawCoverPage({
  page,
  fonts,
  background,
}: {
  page: PDFPage;
  fonts: FontSet;
  background: PDFImage;
}) {
  const { width, height } = page.getSize();

  drawPhotoBackground(page, background);
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: deepEmerald,
    opacity: 0.26,
  });
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: deepEmerald,
    opacity: 0.12,
  });
  drawInsetFrame(page, 30);
  drawMonogram(page, fonts, width / 2 - 27, 818);

  drawCenteredLetterSpacedText({
    page,
    text: couple.hashtag.toUpperCase(),
    font: fonts.sansBold,
    size: 9,
    y: 785,
    color: champagne,
    spacing: 1.8,
    opacity: 0.98,
  });

  drawCenteredText({
    page,
    text: "Save",
    font: fonts.serifItalic,
    size: 76,
    y: 706,
    color: ivory,
  });
  drawCenteredText({
    page,
    text: "THE DATE",
    font: fonts.serifBold,
    size: 50,
    y: 654,
    color: ivory,
  });
  page.drawLine({
    start: { x: 154, y: 629 },
    end: { x: 386, y: 629 },
    thickness: 0.65,
    color: champagne,
    opacity: 0.9,
  });
  drawCenteredText({
    page,
    text: "IBUKUNOLUWA & OLUTAYO",
    font: fonts.serifBold,
    size: 24,
    y: 598,
    color: ivory,
  });
  drawCenteredText({
    page,
    text: "TWO FAMILIES. ONE BEAUTIFUL BEGINNING.",
    font: fonts.sansBold,
    size: 8.5,
    y: 577,
    color: champagne,
  });
  drawCenteredText({
    page,
    text: "4TH & 5TH DECEMBER 2026",
    font: fonts.serifBold,
    size: 31,
    y: 140,
    color: ivory,
  });
  page.drawLine({
    start: { x: 184, y: 119 },
    end: { x: 356, y: 119 },
    thickness: 0.55,
    color: champagne,
  });
  drawCenteredText({
    page,
    text: "IBADAN, NIGERIA",
    font: fonts.sansBold,
    size: 9.5,
    y: 96,
    color: champagne,
  });
}

function drawDetailsPage({
  pdf,
  page,
  fonts,
  heroImage,
  qrImage,
  guest,
}: {
  pdf: PDFDocument;
  page: PDFPage;
  fonts: FontSet;
  heroImage: PDFImage;
  qrImage: PDFImage;
  guest: GuestRecord;
}) {
  const { width, height } = page.getSize();
  const cardX = 48;
  const cardY = 68;
  const cardWidth = 444;
  const cardHeight = 542;
  const innerX = 72;
  const innerWidth = 396;

  page.drawRectangle({ x: 0, y: 0, width, height, color: ivory });
  page.drawRectangle({ x: 0, y: 0, width: 22, height, color: emerald });
  page.drawRectangle({ x: width - 22, y: 0, width: 22, height, color: burgundy });
  page.drawRectangle({
    x: 22,
    y: 0,
    width: width - 44,
    height,
    borderColor: champagne,
    borderWidth: 0.35,
    opacity: 0.55,
  });
  page.drawRectangle({
    x: 0,
    y: height - 330,
    width,
    height: 330,
    color: emerald,
  });
  const heroCover = coverImage({
    imageWidth: heroImage.width,
    imageHeight: heroImage.height,
    pageWidth: width,
    pageHeight: 330,
  });
  page.drawImage(heroImage, {
    ...heroCover,
    x: heroCover.x,
    y: height - 330 + heroCover.y,
  });
  page.drawRectangle({
    x: 0,
    y: height - 330,
    width,
    height: 330,
    color: deepEmerald,
    opacity: 0.42,
  });
  page.drawRectangle({
    x: 0,
    y: height - 128,
    width,
    height: 128,
    color: deepEmerald,
    opacity: 0.24,
  });
  drawMonogram(page, fonts, 46, 848);
  page.drawText(couple.hashtag.toUpperCase(), {
    x: 118,
    y: 880,
    size: 9,
    font: fonts.sansBold,
    color: champagne,
  });
  page.drawText("You are invited", {
    x: 50,
    y: 756,
    size: 46,
    font: fonts.serifBold,
    color: ivory,
  });
  page.drawText("to celebrate a weekend of family, faith, culture, and forever", {
    x: 52,
    y: 730,
    size: 12,
    font: fonts.sans,
    color: ivory,
    opacity: 0.82,
  });

  page.drawRectangle({
    x: cardX,
    y: cardY,
    width: cardWidth,
    height: cardHeight,
    color: rgb(1, 0.985, 0.945),
    borderColor: champagne,
    borderWidth: 0.65,
  });
  page.drawRectangle({
    x: cardX + 14,
    y: cardY + 14,
    width: cardWidth - 28,
    height: cardHeight - 28,
    borderColor: champagne,
    borderWidth: 0.3,
    opacity: 0.58,
  });

  drawCenteredLetterSpacedText({
    page,
    text: "SAVE THE DATE",
    y: 566,
    size: 8.2,
    font: fonts.sansBold,
    color: burgundy,
    spacing: 1.65,
  });
  drawCenteredText({
    page,
    text: "Ibukunoluwa & Olutayo",
    y: 526,
    size: 31,
    font: fonts.serifBold,
    color: emerald,
  });
  drawCenteredText({
    page,
    text: "Wedding Weekend / Ibadan, Nigeria",
    y: 504,
    size: 10.2,
    font: fonts.sans,
    color: ink,
    opacity: 0.72,
  });
  page.drawLine({
    start: { x: 132, y: 486 },
    end: { x: 408, y: 486 },
    thickness: 0.45,
    color: champagne,
    opacity: 0.8,
  });

  drawInvitationEventRow({
    page,
    fonts,
    x: innerX,
    y: 394,
    accent: burgundy,
    day: "04",
    month: "DEC",
    weekday: "Friday",
    title: "Traditional Wedding",
    date: "4th December 2026",
  });
  drawInvitationEventRow({
    page,
    fonts,
    x: innerX,
    y: 300,
    accent: emerald,
    day: "05",
    month: "DEC",
    weekday: "Saturday",
    title: "The Grand Finale",
    date: "5th December 2026 / Ibadan, Nigeria",
  });

  page.drawText("RESERVED FOR", {
    x: innerX,
    y: 264,
    size: 7.5,
    font: fonts.sansBold,
    color: burgundy,
  });
  const guestNameSize = fittedTextSize(
    guest.guest_name,
    fonts.serifBold,
    innerWidth,
    17,
    10,
  );
  page.drawText(guest.guest_name, {
    x: innerX,
    y: 242,
    size: guestNameSize,
    font: fonts.serifBold,
    color: emerald,
  });
  page.drawLine({
    start: { x: innerX, y: 228 },
    end: { x: innerX + innerWidth, y: 228 },
    thickness: 0.35,
    color: champagne,
    opacity: 0.62,
  });

  page.drawRectangle({
    x: innerX,
    y: 122,
    width: 174,
    height: 88,
    color: emerald,
    borderColor: champagne,
    borderWidth: 0.7,
  });
  page.drawText("INVITATION CODE", {
    x: innerX + 25,
    y: 178,
    size: 8,
    font: fonts.sansBold,
    color: champagne,
  });
  page.drawText(guest.invitation_code, {
    x: innerX + 44,
    y: 139,
    size: 34,
    font: fonts.serifBold,
    color: ivory,
  });
  page.drawText("Use this code to RSVP online.", {
    x: innerX,
    y: 100,
    size: 9.5,
    font: fonts.sans,
    color: ink,
    opacity: 0.72,
  });

  page.drawRectangle({
    x: 334,
    y: 117,
    width: 112,
    height: 112,
    color: ivory,
    borderColor: champagne,
    borderWidth: 0.65,
  });
  page.drawImage(qrImage, {
    x: 342,
    y: 125,
    width: 96,
    height: 96,
  });
  addLinkAnnotation({
    pdf,
    page,
    url: weddingWebsiteUrl,
    x: 334,
    y: 117,
    width: 112,
    height: 112,
  });
  page.drawText("SCAN TO RSVP", {
    x: 353,
    y: 100,
    size: 8,
    font: fonts.sansBold,
    color: burgundy,
  });

  const linkText = "thebensons26.vercel.app";
  const linkX = (width - fonts.sansBold.widthOfTextAtSize(linkText, 11)) / 2;
  const linkY = 82;
  page.drawText(linkText, {
    x: linkX,
    y: linkY,
    size: 11,
    font: fonts.sansBold,
    color: burgundy,
  });
  page.drawLine({
    start: { x: linkX, y: linkY - 3 },
    end: { x: linkX + fonts.sansBold.widthOfTextAtSize(linkText, 11), y: linkY - 3 },
    thickness: 0.55,
    color: burgundy,
  });
  addLinkAnnotation({
    pdf,
    page,
    url: weddingWebsiteUrl,
    x: linkX,
    y: linkY - 4,
    width: fonts.sansBold.widthOfTextAtSize(linkText, 11),
    height: 18,
  });
}

export async function createSaveTheDatePdf(guest: GuestRecord) {
  const pdf = await PDFDocument.create();
  const fonts: FontSet = {
    serif: await pdf.embedFont(StandardFonts.TimesRoman),
    serifBold: await pdf.embedFont(StandardFonts.TimesRomanBold),
    serifItalic: await pdf.embedFont(StandardFonts.TimesRomanItalic),
    sans: await pdf.embedFont(StandardFonts.Helvetica),
    sansBold: await pdf.embedFont(StandardFonts.HelveticaBold),
  };
  const cover = await embedJpgFromPublic(pdf, "events-grand-finale.jpg");
  const detailsHero = await embedJpgFromPublic(pdf, "our-story-hero.jpg");
  const qrImage = await embedWebsiteQr(pdf);
  const coverPage = pdf.addPage(pageSize);
  const detailsPage = pdf.addPage(pageSize);

  drawCoverPage({ page: coverPage, fonts, background: cover });
  drawDetailsPage({
    pdf,
    page: detailsPage,
    fonts,
    heroImage: detailsHero,
    qrImage,
    guest,
  });

  return pdf.save({ useObjectStreams: false });
}
