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

function drawEventBlock({
  page,
  fonts,
  x,
  y,
  width = 408,
  label,
  title,
  date,
}: {
  page: PDFPage;
  fonts: FontSet;
  x: number;
  y: number;
  width?: number;
  label: string;
  title: string;
  date: string;
}) {
  page.drawRectangle({
    x,
    y,
    width,
    height: 92,
    color: ivory,
    borderColor: champagne,
    borderWidth: 0.6,
  });
  page.drawRectangle({
    x,
    y,
    width: 7,
    height: 92,
    color: label.includes("01") ? burgundy : emerald,
  });
  page.drawText(label, {
    x: x + 24,
    y: y + 62,
    size: 8,
    font: fonts.sansBold,
    color: burgundy,
  });
  page.drawText(title, {
    x: x + 24,
    y: y + 32,
    size: title.length > 18 ? 22 : 24,
    font: fonts.serifBold,
    color: emerald,
  });
  page.drawText(date, {
    x: x + 24,
    y: y + 15,
    size: 10,
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
    opacity: 0.22,
  });
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: deepEmerald,
    opacity: 0.18,
  });
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height: 334,
    color: burgundy,
    opacity: 0.44,
  });
  page.drawRectangle({
    x: 0,
    y: 334,
    width,
    height: 190,
    color: deepEmerald,
    opacity: 0.3,
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

  page.drawRectangle({ x: 0, y: 0, width, height, color: ivory });
  page.drawRectangle({ x: 0, y: 0, width: 54, height, color: emerald });
  page.drawRectangle({ x: width - 54, y: 0, width: 54, height, color: burgundy });
  page.drawRectangle({
    x: 54,
    y: 0,
    width: width - 108,
    height,
    borderColor: champagne,
    borderWidth: 0.55,
    opacity: 0.85,
  });
  page.drawRectangle({ x: 54, y: height - 304, width: width - 108, height: 304, color: emerald });
  const heroCover = coverImage({
    imageWidth: heroImage.width,
    imageHeight: heroImage.height,
    pageWidth: width - 108,
    pageHeight: 304,
  });
  page.drawImage(heroImage, {
    ...heroCover,
    x: 54 + heroCover.x,
    y: height - 304 + heroCover.y,
  });
  page.drawRectangle({
    x: 54,
    y: height - 304,
    width: width - 108,
    height: 304,
    color: deepEmerald,
    opacity: 0.34,
  });
  page.drawRectangle({
    x: 54,
    y: height - 304,
    width: width - 108,
    height: 94,
    color: burgundy,
    opacity: 0.34,
  });
  drawMonogram(page, fonts, 74, 850);
  page.drawText(couple.hashtag.toUpperCase(), {
    x: 144,
    y: 880,
    size: 9,
    font: fonts.sansBold,
    color: champagne,
  });
  page.drawText("You are invited", {
    x: 74,
    y: 748,
    size: 46,
    font: fonts.serifBold,
    color: ivory,
  });
  page.drawText("to celebrate a weekend of family, faith, culture, and forever", {
    x: 76,
    y: 724,
    size: 12,
    font: fonts.sans,
    color: ivory,
    opacity: 0.82,
  });

  page.drawRectangle({
    x: 74,
    y: 92,
    width: 392,
    height: 528,
    color: rgb(1, 0.985, 0.945),
    borderColor: champagne,
    borderWidth: 0.65,
  });
  page.drawRectangle({
    x: 92,
    y: 110,
    width: 356,
    height: 492,
    borderColor: champagne,
    borderWidth: 0.35,
    opacity: 0.7,
  });
  page.drawText("IBUKUNOLUWA & OLUTAYO", {
    x: 112,
    y: 560,
    size: 10,
    font: fonts.sansBold,
    color: burgundy,
  });
  page.drawText("Wedding Weekend", {
    x: 112,
    y: 525,
    size: 34,
    font: fonts.serifBold,
    color: emerald,
  });
  page.drawText("Kindly save these dates. A formal invitation and venue details will follow.", {
    x: 114,
    y: 500,
    size: 9.5,
    font: fonts.sans,
    color: ink,
    opacity: 0.72,
  });

  drawEventBlock({
    page,
    fonts,
    x: 110,
    y: 384,
    width: 320,
    label: "CELEBRATION 01",
    title: "Traditional Wedding",
    date: "Friday, 4th December 2026",
  });
  drawEventBlock({
    page,
    fonts,
    x: 110,
    y: 278,
    width: 320,
    label: "CELEBRATION 02",
    title: "The Grand Finale",
    date: "Saturday, 5th December 2026 / Ibadan, Nigeria",
  });

  page.drawText("RESERVED FOR", {
    x: 112,
    y: 248,
    size: 7.5,
    font: fonts.sansBold,
    color: burgundy,
  });
  page.drawText(guest.guest_name, {
    x: 112,
    y: 229,
    size: Math.min(15, Math.max(10, 240 / Math.max(guest.guest_name.length, 1))),
    font: fonts.serifBold,
    color: emerald,
  });

  page.drawRectangle({
    x: 112,
    y: 132,
    width: 158,
    height: 84,
    color: emerald,
    borderColor: champagne,
    borderWidth: 0.7,
  });
  page.drawText("INVITATION CODE", {
    x: 132,
    y: 187,
    size: 8,
    font: fonts.sansBold,
    color: champagne,
  });
  page.drawText(guest.invitation_code, {
    x: 143,
    y: 149,
    size: 31,
    font: fonts.serifBold,
    color: ivory,
  });
  page.drawText("Use this code to RSVP online.", {
    x: 116,
    y: 98,
    size: 9.5,
    font: fonts.sans,
    color: ink,
    opacity: 0.72,
  });

  page.drawRectangle({
    x: 304,
    y: 118,
    width: 118,
    height: 118,
    color: ivory,
    borderColor: champagne,
    borderWidth: 0.65,
  });
  page.drawImage(qrImage, {
    x: 312,
    y: 126,
    width: 102,
    height: 102,
  });
  addLinkAnnotation({
    pdf,
    page,
    url: weddingWebsiteUrl,
    x: 304,
    y: 118,
    width: 118,
    height: 118,
  });
  page.drawText("SCAN TO RSVP", {
    x: 323,
    y: 100,
    size: 8,
    font: fonts.sansBold,
    color: burgundy,
  });

  const linkText = "thebensons26.vercel.app";
  const linkX = (width - fonts.sansBold.widthOfTextAtSize(linkText, 11)) / 2;
  const linkY = 68;
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
