import { couple } from "@/content/siteContent";
import { cn } from "@/lib/utils";

export function WeddingLogo({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-4", className)}>
      <span className="relative grid size-14 place-items-center rounded-full border border-champagne/50 bg-gradient-to-br from-emerald to-burgundy text-ivory shadow-xl shadow-black/15">
        <span className="absolute inset-1 rounded-full border border-white/14" />
        <span className="font-serif text-3xl font-semibold leading-none">
          {couple.monogram}
        </span>
      </span>
      {compact ? null : (
        <span className="leading-none">
          <span className="block font-serif text-4xl font-semibold tracking-normal text-ivory">
            {couple.footerLogo}
          </span>
          <span className="mt-2 block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-champagne">
            {couple.hashtag}
          </span>
        </span>
      )}
    </div>
  );
}
