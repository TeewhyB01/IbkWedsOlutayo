"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

import type { WeddingImage } from "@/types";

export function GalleryLightbox({
  images,
  activeIndex,
  onClose,
  onNext,
  onPrevious,
}: {
  images: WeddingImage[];
  activeIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const image = activeIndex == null ? null : images[activeIndex];

  useEffect(() => {
    if (activeIndex == null) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNext();
      if (event.key === "ArrowLeft") onPrevious();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, onClose, onNext, onPrevious]);

  return (
    <AnimatePresence>
      {image ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image preview"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/88 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close gallery image"
            onClick={onClose}
            className="absolute right-5 top-5 grid size-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
          >
            <X size={20} />
          </button>
          <button
            type="button"
            aria-label="Previous image"
            onClick={onPrevious}
            className="absolute left-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronLeft size={22} />
          </button>
          <motion.div
            key={image.src}
            className="relative h-[78vh] w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/14 bg-green"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="90vw"
              className="object-contain"
            />
            {image.caption ? (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-center text-sm text-white">
                {image.caption}
              </div>
            ) : null}
          </motion.div>
          <button
            type="button"
            aria-label="Next image"
            onClick={onNext}
            className="absolute right-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
          >
            <ChevronRight size={22} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
