import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { couple } from "@/content/siteContent";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normaliseInvitationCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
}

export function isRsvpClosed(now = new Date()) {
  const deadline = new Date(`${couple.rsvpDeadline}T23:59:59.999`);
  return now > deadline;
}

export function formatDeadline() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${couple.rsvpDeadline}T12:00:00`));
}

export function csvEscape(value: unknown) {
  const stringValue = value == null ? "" : String(value);
  return `"${stringValue.replaceAll('"', '""')}"`;
}

export function toCsv(rows: Record<string, unknown>[]) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ];

  return lines.join("\n");
}

function xmlEscape(value: unknown) {
  const stringValue = value == null ? "" : String(value);

  return stringValue
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function toExcelXml({
  rows,
  worksheetName,
}: {
  rows: Record<string, unknown>[];
  worksheetName: string;
}) {
  const headers = rows.length > 0 ? Object.keys(rows[0]) : ["No records"];
  const headerRow = headers
    .map(
      (header) =>
        `<Cell><Data ss:Type="String">${xmlEscape(header)}</Data></Cell>`,
    )
    .join("");
  const dataRows = rows
    .map((row) =>
      `<Row>${headers
        .map((header) => {
          const value = row[header];
          const type = typeof value === "number" ? "Number" : "String";

          return `<Cell><Data ss:Type="${type}">${xmlEscape(value)}</Data></Cell>`;
        })
        .join("")}</Row>`,
    )
    .join("");

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:x="urn:schemas-microsoft-com:office:excel"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:html="http://www.w3.org/TR/REC-html40">
  <Styles>
    <Style ss:ID="Header">
      <Font ss:Bold="1" ss:Color="#FBF6EC"/>
      <Interior ss:Color="#0B513F" ss:Pattern="Solid"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="${xmlEscape(worksheetName)}">
    <Table>
      <Row ss:StyleID="Header">${headerRow}</Row>
      ${dataRows || `<Row><Cell><Data ss:Type="String">No registered guests yet.</Data></Cell></Row>`}
    </Table>
  </Worksheet>
</Workbook>`;
}

export function formatRelativeTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const divisions: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];
  const formatter = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });

  for (const [unit, amount] of divisions) {
    if (Math.abs(seconds) >= amount || unit === "second") {
      return formatter.format(Math.round(seconds / amount), unit);
    }
  }

  return "just now";
}
