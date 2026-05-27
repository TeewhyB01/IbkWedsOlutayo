"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { FaqItem } from "@/types";

export function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-gold/18 rounded-[1.4rem] border border-gold/25 bg-white/62 shadow-xl shadow-gold/10 backdrop-blur-sm">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.question}>
            <button
              type="button"
              className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-green sm:px-7"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span>{item.question}</span>
              <ChevronDown
                size={18}
                className={cn("shrink-0 transition", isOpen && "rotate-180")}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-7 text-muted sm:px-7">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
