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

function drawCoverTitle({
  page,
  fonts,
  y,
}: {
  page: PDFPage;
  fonts: FontSet;
  y: number;
}) {
  const saveText = "SAVE";
  const theText = "the";
  const dateText = "DATE";
  const saveSize = 54;
  const theSize = 30;
  const dateSize = 54;
  const gap = 18;
  const saveWidth = fonts.serif.widthOfTextAtSize(saveText, saveSize);
  const theWidth = fonts.serifItalic.widthOfTextAtSize(theText, theSize);
  const dateWidth = fonts.serif.widthOfTextAtSize(dateText, dateSize);
  const totalWidth = saveWidth + gap + theWidth + gap + dateWidth;
  let x = (page.getWidth() - totalWidth) / 2;

  page.drawText(saveText, {
    x,
    y,
    size: saveSize,
    font: fonts.serif,
    color: ivory,
  });
  x += saveWidth + gap;
  page.drawText(theText, {
    x,
    y: y + 8,
    size: theSize,
    font: fonts.serifItalic,
    color: ivory,
  });
  x += theWidth + gap;
  page.drawText(dateText, {
    x,
    y,
    size: dateSize,
    font: fonts.serif,
    color: ivory,
  });
}

function drawModernEventRow({
  page,
  fonts,
  x,
  y,
  width,
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
  width: number;
  accent: ReturnType<typeof rgb>;
  day: string;
  month: string;
  weekday: string;
  title: string;
  date: string;
}) {
  page.drawRectangle({
    x,
    y,
    width,
    height: 82,
    color: rgb(0.998, 0.988, 0.958),
    borderColor: champagne,
    borderWidth: 0.42,
  });
  page.drawRectangle({
    x,
    y,
    width: 4,
    height: 82,
    color: accent,
    opacity: 0.96,
  });
  page.drawRectangle({
    x: x + 17,
    y: y + 14,
    width: 56,
    height: 54,
    color: ivory,
    borderColor: accent,
    borderWidth: 0.62,
  });
  page.drawText(day, {
    x: x + 29,
    y: y + 36,
    size: 21,
    font: fonts.serifBold,
    color: accent,
  });
  page.drawText(month, {
    x: x + 29,
    y: y + 22,
    size: 7,
    font: fonts.sansBold,
    color: ink,
    opacity: 0.68,
  });
  page.drawText(weekday.toUpperCase(), {
    x: x + 93,
    y: y + 55,
    size: 8,
    font: fonts.sansBold,
    color: accent,
  });
  page.drawText(title, {
    x: x + 93,
    y: y + 31,
    size: title.length > 20 ? 19 : 21,
    font: fonts.serifBold,
    color: emerald,
  });
  page.drawText(date, {
    x: x + 93,
    y: y + 15,
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
    opacity: 0.24,
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
    opacity: 0.36,
  });
  page.drawRectangle({
    x: 0,
    y: 334,
    width,
    height: 190,
    color: ivory,
    opacity: 0.2,
  });

  drawCenteredLetterSpacedText({
    page,
    text: couple.hashtag.toUpperCase(),
    font: fonts.sansBold,
    size: 8.7,
    y: 705,
    color: champagne,
    spacing: 1.1,
    opacity: 0.98,
  });

  drawCoverTitle({ page, fonts, y: 615 });
  drawCenteredText({
    page,
    text: "IBUKUNOLUWA & OLUTAYO",
    font: fonts.serifBold,
    size: 25,
    y: 558,
    color: ivory,
  });
  page.drawLine({
    start: { x: 155, y: 529 },
    end: { x: 385, y: 529 },
    thickness: 0.65,
    color: champagne,
    opacity: 0.9,
  });
  drawCenteredText({
    page,
    text: "IBADAN, NIGERIA",
    font: fonts.sansBold,
    size: 10,
    y: 504,
    color: champagne,
  });
  drawCenteredText({
    page,
    text: "04.12.26    &    05.12.26",
    font: fonts.serif,
    size: 35,
    y: 94,
    color: ivory,
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
  const heroHeight = 330;
  const heroY = height - heroHeight;
  const cardX = 40;
  const cardY = 68;
  const cardWidth = 460;
  const cardHeight = 540;
  const innerX = 66;
  const innerWidth = 408;

  page.drawRectangle({ x: 0, y: 0, width, height, color: ivory });
  page.drawRectangle({
    x: 0,
    y: heroY,
    width,
    height: heroHeight,
    color: emerald,
  });
  const heroCover = coverImage({
    imageWidth: heroImage.width,
    imageHeight: heroImage.height,
    pageWidth: width,
    pageHeight: heroHeight,
  });
  page.drawImage(heroImage, {
    ...heroCover,
    x: heroCover.x,
    y: heroY + heroCover.y,
  });
  page.drawRectangle({
    x: 0,
    y: heroY,
    width,
    height: heroHeight,
    color: deepEmerald,
    opacity: 0.32,
  });
  page.drawRectangle({
    x: 0,
    y: heroY,
    width: 245,
    height: heroHeight,
    color: deepEmerald,
    opacity: 0.78,
  });
  page.drawText(couple.hashtag.toUpperCase(), {
    x: 44,
    y: 832,
    size: 8.6,
    font: fonts.sansBold,
    color: champagne,
  });
  page.drawText("You are invited", {
    x: 44,
    y: 746,
    size: 45,
    font: fonts.serif,
    color: ivory,
  });
  page.drawText("to save the date for our wedding weekend", {
    x: 46,
    y: 716,
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
    color: rgb(1, 0.986, 0.946),
    borderColor: champagne,
    borderWidth: 0.65,
  });
  page.drawRectangle({
    x: cardX + 11,
    y: cardY + 11,
    width: cardWidth - 22,
    height: cardHeight - 22,
    borderColor: champagne,
    borderWidth: 0.25,
    opacity: 0.46,
  });
  drawLetterSpacedText({
    page,
    text: "IBUKUNOLUWA & OLUTAYO",
    x: innerX,
    y: 552,
    size: 9.2,
    font: fonts.sansBold,
    color: burgundy,
    spacing: 1.2,
  });
  page.drawText("Wedding Weekend", {
    x: innerX,
    y: 512,
    size: 38,
    font: fonts.serifBold,
    color: emerald,
  });
  page.drawText("Please use the details below to RSVP online.", {
    x: innerX,
    y: 486,
    size: 10.6,
    font: fonts.sans,
    color: ink,
    opacity: 0.72,
  });

  drawModernEventRow({
    page,
    fonts,
    x: innerX,
    y: 385,
    width: innerWidth,
    accent: burgundy,
    day: "04",
    month: "DEC",
    weekday: "Friday",
    title: "Traditional Wedding",
    date: "Friday, 4th December 2026",
  });
  drawModernEventRow({
    page,
    fonts,
    x: innerX,
    y: 294,
    width: innerWidth,
    accent: emerald,
    day: "05",
    month: "DEC",
    weekday: "Saturday",
    title: "The Grand Finale",
    date: "Saturday, 5th December 2026",
  });

  page.drawText("LOCATION", {
    x: innerX,
    y: 258,
    size: 7.5,
    font: fonts.sansBold,
    color: burgundy,
  });
  page.drawText("Ibadan, Nigeria", {
    x: innerX,
    y: 234,
    size: 20,
    font: fonts.serifBold,
    color: emerald,
  });
  page.drawLine({
    start: { x: innerX, y: 218 },
    end: { x: innerX + innerWidth, y: 218 },
    thickness: 0.35,
    color: champagne,
    opacity: 0.62,
  });
  page.drawText("RSVP ACCESS", {
    x: innerX,
    y: 197,
    size: 7.5,
    font: fonts.sansBold,
    color: burgundy,
  });
  page.drawRectangle({
    x: innerX,
    y: 110,
    width: 180,
    height: 78,
    color: emerald,
    borderColor: champagne,
    borderWidth: 0.7,
  });
  page.drawText("INVITATION CODE", {
    x: innerX + 25,
    y: 158,
    size: 8,
    font: fonts.sansBold,
    color: champagne,
  });
  page.drawText(guest.invitation_code, {
    x: innerX + (180 - fonts.serifBold.widthOfTextAtSize(guest.invitation_code, 33)) / 2,
    y: 124,
    size: 33,
    font: fonts.serifBold,
    color: ivory,
  });

  page.drawRectangle({
    x: 330,
    y: 112,
    width: 118,
    height: 118,
    color: ivory,
    borderColor: champagne,
    borderWidth: 0.65,
  });
  page.drawImage(qrImage, {
    x: 338,
    y: 120,
    width: 102,
    height: 102,
  });
  addLinkAnnotation({
    pdf,
    page,
    url: weddingWebsiteUrl,
    x: 330,
    y: 112,
    width: 118,
    height: 118,
  });
  page.drawText("SCAN TO RSVP", {
    x: 349,
    y: 94,
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
  const cover = await embedJpgFromPublic(pdf, "story-feature.jpg");
  const detailsHero = await embedJpgFromPublic(pdf, "home-hero.jpg");
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
