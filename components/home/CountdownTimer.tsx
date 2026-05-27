"use client";

import { useEffect, useMemo, useState } from "react";

const units = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

function getTimeParts(targetDate: string) {
  const target = new Date(`${targetDate}T00:00:00`);
  const distance = Math.max(target.getTime() - Date.now(), 0);

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [parts, setParts] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const memoUnits = useMemo(() => units, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setParts(getTimeParts(targetDate));
    }, 0);
    const interval = window.setInterval(() => {
      setParts(getTimeParts(targetDate));
    }, 1000);

    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Countdown to the wedding">
      {memoUnits.map((unit) => (
        <div
          key={unit.key}
          className="rounded-[1.25rem] border border-white/18 bg-white/12 p-3 text-center shadow-2xl shadow-black/10 backdrop-blur-md sm:p-4"
        >
          <span className="block font-serif text-3xl font-semibold leading-none text-ivory sm:text-4xl">
            {String(parts[unit.key]).padStart(2, "0")}
          </span>
          <span className="mt-2 block text-[0.68rem] font-semibold uppercase text-champagne sm:text-xs">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
