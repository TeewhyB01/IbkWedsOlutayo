"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { navigationLinks, couple } from "@/content/siteContent";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isElevated = scrolled || open;

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 24);

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-500",
        isElevated
          ? "border-gold/20 bg-ivory/92 shadow-xl shadow-green/10 backdrop-blur-xl"
          : "border-white/0 bg-transparent",
      )}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span
            className={cn(
              "grid size-12 place-items-center rounded-full border text-lg font-serif font-semibold shadow-lg transition-all duration-500",
              isElevated
                ? "border-gold/50 bg-gradient-to-br from-emerald to-burgundy text-ivory shadow-green/15"
                : "border-white/35 bg-white/10 text-ivory shadow-black/15 backdrop-blur-md",
            )}
          >
            {couple.monogram}
          </span>
          <span
            className={cn(
              "hidden text-sm font-bold tracking-[0.08em] transition-colors duration-500 sm:block",
              isElevated ? "text-green" : "text-ivory drop-shadow-sm",
            )}
          >
            {couple.hashtag}
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navigationLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition duration-300",
                  isElevated
                    ? "text-green/75 hover:text-green"
                    : "text-ivory/86 drop-shadow-sm hover:text-white",
                  isActive && (isElevated ? "text-green" : "text-white"),
                )}
              >
                {link.label}
                {isActive ? (
                  <motion.span
                    layoutId="nav-pill"
                    className={cn(
                      "absolute inset-0 -z-10 rounded-full border",
                      isElevated
                        ? "border-gold/25 bg-white/70"
                        : "border-white/25 bg-white/12 backdrop-blur-sm",
                    )}
                    transition={{ type: "spring", bounce: 0.18, duration: 0.55 }}
                  />
                ) : null}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "grid size-12 place-items-center rounded-full border shadow-sm transition lg:hidden",
            isElevated
              ? "border-gold/30 bg-white/70 text-green hover:bg-cream"
              : "border-white/30 bg-white/10 text-ivory backdrop-blur-md hover:bg-white/18",
          )}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-x-0 top-20 z-50 border-b border-gold/20 bg-gradient-to-b from-green to-burgundy-deep px-5 py-8 text-ivory shadow-2xl lg:hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28 }}
          >
            <div className="mx-auto flex max-w-md flex-col gap-3">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-white/12 px-5 py-4 font-serif text-2xl font-semibold transition hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
