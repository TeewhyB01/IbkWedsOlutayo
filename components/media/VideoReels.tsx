"use client";

import { motion } from "framer-motion";

import { weddingVideos } from "@/content/media";

export function VideoReels({ compact = false }: { compact?: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {weddingVideos.map((video, index) => (
        <motion.article
          key={video.src}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: index * 0.06 }}
          className="group overflow-hidden rounded-[1.6rem] border border-gold/20 bg-green shadow-2xl shadow-green/15"
        >
          <div className={compact ? "relative aspect-[4/5]" : "relative aspect-[9/14]"}>
            <video
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              poster={video.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={video.title}
            >
              <source src={video.src} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-green/88 via-green/8 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-champagne">
                {video.eyebrow}
              </p>
              <h3 className="mt-2 font-serif text-3xl font-semibold">{video.title}</h3>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
