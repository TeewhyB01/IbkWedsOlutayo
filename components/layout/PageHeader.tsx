import Image from "next/image";
import type { ReactNode } from "react";

import { couple } from "@/content/siteContent";

export function PageHeader({
  title,
  subtitle,
  image,
  children,
}: {
  title: string;
  subtitle: string;
  image: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate min-h-[56vh] overflow-hidden bg-green text-ivory">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-green via-green/76 to-burgundy/38" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(227,201,143,0.28),transparent_24rem)]" />
      <div className="relative mx-auto flex min-h-[56vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 lg:pb-20">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex rounded-full border border-champagne/45 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
            {couple.hashtag}
          </p>
          <h1 className="pl-1 font-serif text-6xl font-semibold leading-[0.92] text-balance sm:text-7xl lg:text-8xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ivory/82 sm:text-lg">
            {subtitle}
          </p>
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
