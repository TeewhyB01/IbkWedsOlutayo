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

function drawSaveTheDateTitle(page: PDFPage, fonts: FontSet, y: number) {
  const saveText = "SAVE";
  const dateText = "DATE";
  const saveSize = 62;
  const theSize = 40;
  const saveWidth = fonts.serif.widthOfTextAtSize(saveText, saveSize);
  const theWidth = fonts.serifItalic.widthOfTextAtSize("the", theSize);
  const dateWidth = fonts.serif.widthOfTextAtSize(dateText, saveSize);
  const gap = 18;
  const groupWidth = saveWidth + theWidth + dateWidth + gap * 2;
  const startX = (page.getWidth() - groupWidth) / 2;

  page.drawText(saveText, {
    x: startX,
    y,
    size: saveSize,
    font: fonts.serif,
    color: ivory,
  });
  page.drawText("the", {
    x: startX + saveWidth + gap,
    y: y + 7,
    size: theSize,
    font: fonts.serifItalic,
    color: ivory,
  });
  page.drawText(dateText, {
    x: startX + saveWidth + theWidth + gap * 2,
    y,
    size: saveSize,
    font: fonts.serif,
    color: ivory,
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

function drawDetailRow({
  page,
  fonts,
  label,
  value,
  y,
}: {
  page: PDFPage;
  fonts: FontSet;
  label: string;
  value: string;
  y: number;
}) {
  page.drawText(label, {
    x: 66,
    y,
    size: 8,
    font: fonts.sansBold,
    color: burgundy,
  });
  page.drawText(value, {
    x: 66,
    y: y - 26,
    size: 20,
    font: fonts.serifBold,
    color: emerald,
  });
  page.drawLine({
    start: { x: 66, y: y - 43 },
    end: { x: 474, y: y - 43 },
    thickness: 0.45,
    color: champagne,
    opacity: 0.65,
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
    opacity: 0.44,
  });
  page.drawRectangle({
    x: 0,
    y: height * 0.57,
    width,
    height: height * 0.43,
    color: deepEmerald,
    opacity: 0.26,
  });
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height: height * 0.34,
    color: burgundy,
    opacity: 0.24,
  });

  drawCenteredText({
    page,
    text: couple.hashtag.toUpperCase(),
    font: fonts.sansBold,
    size: 9,
    y: 800,
    color: champagne,
    opacity: 0.98,
  });
  drawSaveTheDateTitle(page, fonts, 736);
  drawCenteredText({
    page,
    text: "IBUKUNOLUWA & OLUTAYO",
    font: fonts.serifBold,
    size: 25,
    y: 692,
  });
  page.drawLine({
    start: { x: 156, y: 666 },
    end: { x: 384, y: 666 },
    thickness: 0.65,
    color: champagne,
    opacity: 0.9,
  });
  drawCenteredText({
    page,
    text: "IBADAN, NIGERIA",
    font: fonts.sansBold,
    size: 10,
    y: 642,
    color: champagne,
  });
  drawCenteredText({
    page,
    text: "04.12.26   &   05.12.26",
    font: fonts.serif,
    size: 39,
    y: 96,
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
  page.drawRectangle({ x: 0, y: height - 338, width, height: 338, color: emerald });
  const heroCover = coverImage({
    imageWidth: heroImage.width,
    imageHeight: heroImage.height,
    pageWidth: width,
    pageHeight: 338,
  });
  page.drawImage(
    heroImage,
    {
      ...heroCover,
      y: height - 338 + heroCover.y,
    },
  );
  page.drawRectangle({
    x: 0,
    y: height - 338,
    width,
    height: 338,
    color: deepEmerald,
    opacity: 0.44,
  });
  page.drawText(couple.hashtag.toUpperCase(), {
    x: 44,
    y: 872,
    size: 9,
    font: fonts.sansBold,
    color: champagne,
  });
  page.drawText("You are invited", {
    x: 44,
    y: 807,
    size: 45,
    font: fonts.serif,
    color: ivory,
  });
  page.drawText("to save the date for our wedding weekend", {
    x: 47,
    y: 777,
    size: 12,
    font: fonts.sans,
    color: ivory,
    opacity: 0.82,
  });

  page.drawRectangle({
    x: 40,
    y: 58,
    width: 460,
    height: 538,
    color: rgb(1, 0.985, 0.94),
    borderColor: champagne,
    borderWidth: 0.65,
  });
  page.drawText("IBUKUNOLUWA & OLUTAYO", {
    x: 66,
    y: 548,
    size: 13,
    font: fonts.sansBold,
    color: burgundy,
  });
  page.drawText("Wedding Weekend", {
    x: 66,
    y: 510,
    size: 39,
    font: fonts.serifBold,
    color: emerald,
  });
  page.drawText("Please use the details below to RSVP online.", {
    x: 68,
    y: 482,
    size: 11,
    font: fonts.sans,
    color: ink,
    opacity: 0.72,
  });

  drawDetailRow({
    page,
    fonts,
    label: "TRADITIONAL WEDDING",
    value: "Friday, 4th December 2026",
    y: 432,
  });
  drawDetailRow({
    page,
    fonts,
    label: "THE GRAND FINALE",
    value: "Saturday, 5th December 2026",
    y: 348,
  });
  drawDetailRow({
    page,
    fonts,
    label: "LOCATION",
    value: "Ibadan, Nigeria",
    y: 264,
  });

  page.drawRectangle({
    x: 64,
    y: 114,
    width: 190,
    height: 96,
    color: emerald,
    borderColor: champagne,
    borderWidth: 0.7,
  });
  page.drawText("INVITATION CODE", {
    x: 83,
    y: 180,
    size: 8,
    font: fonts.sansBold,
    color: champagne,
  });
  page.drawText(guest.invitation_code, {
    x: 96,
    y: 136,
    size: 34,
    font: fonts.serifBold,
    color: ivory,
  });

  page.drawImage(qrImage, {
    x: 316,
    y: 112,
    width: 118,
    height: 118,
  });
  addLinkAnnotation({
    pdf,
    page,
    url: weddingWebsiteUrl,
    x: 316,
    y: 112,
    width: 118,
    height: 118,
  });
  page.drawText("SCAN TO RSVP", {
    x: 324,
    y: 91,
    size: 8,
    font: fonts.sansBold,
    color: burgundy,
  });

  const linkText = "thebensons26.vercel.app";
  const linkX = 66;
  const linkY = 76;
  page.drawText(linkText, {
    x: linkX,
    y: linkY,
    size: 13,
    font: fonts.sansBold,
    color: burgundy,
  });
  page.drawLine({
    start: { x: linkX, y: linkY - 3 },
    end: { x: linkX + fonts.sansBold.widthOfTextAtSize(linkText, 13), y: linkY - 3 },
    thickness: 0.55,
    color: burgundy,
  });
  addLinkAnnotation({
    pdf,
    page,
    url: weddingWebsiteUrl,
    x: linkX,
    y: linkY - 4,
    width: fonts.sansBold.widthOfTextAtSize(linkText, 13),
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
  const detailsHero = await embedJpgFromPublic(pdf, "home-banner-2.jpg");
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
