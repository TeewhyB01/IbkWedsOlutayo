"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { GalleryLightbox } from "@/components/story/GalleryLightbox";
import { cn } from "@/lib/utils";
import type { WeddingImage } from "@/types";

export function ImageGallery({ images }: { images: WeddingImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const onNext = useCallback(() => {
    setActiveIndex((index) => (index == null ? 0 : (index + 1) % images.length));
  }, [images.length]);

  const onPrevious = useCallback(() => {
    setActiveIndex((index) =>
      index == null ? 0 : (index - 1 + images.length) % images.length,
    );
  }, [images.length]);

  return (
    <>
      <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "group relative overflow-hidden rounded-[1.25rem] border border-gold/20 bg-green text-left shadow-xl shadow-green/10",
              index === 0 && "sm:col-span-2 sm:row-span-2",
              index === 3 && "lg:row-span-2",
              index === 5 && "sm:col-span-2",
            )}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-green/64 to-transparent opacity-80 transition group-hover:opacity-60" />
            <span className="absolute bottom-4 left-4 right-4 text-sm font-semibold text-ivory opacity-0 transition group-hover:opacity-100">
              {image.caption}
            </span>
          </button>
        ))}
      </div>
      <GalleryLightbox
        images={images}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNext={onNext}
        onPrevious={onPrevious}
      />
    </>
  );
}
