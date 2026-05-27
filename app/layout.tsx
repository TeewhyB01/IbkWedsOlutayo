import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://thebensons26.vercel.app",
  ),
  title: {
    default: "Ibukunoluwa & Olutayo Wedding",
    template: "%s | Ibukunoluwa & Olutayo Wedding",
  },
  description:
    "Join Ibukunoluwa and Olutayo as they celebrate their traditional wedding and grand finale on 4th and 5th December 2026.",
  openGraph: {
    title: "Ibukunoluwa & Olutayo Wedding",
    description:
      "Join Ibukunoluwa and Olutayo as they celebrate their traditional wedding and grand finale on 4th and 5th December 2026.",
    images: ["/images/wedding/og-image.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-ivory text-ink">{children}</body>
    </html>
  );
}
