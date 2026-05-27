import type { TimelineGroup } from "@/types";

export function WeddingTimeline({ groups }: { groups: TimelineGroup[] }) {
  return (
    <div className="relative grid gap-5 lg:grid-cols-2 lg:gap-6">
      {groups.map((group, groupIndex) => (
        <article
          key={group.title}
          className="relative overflow-hidden rounded-[2rem] border border-gold/22 bg-white/78 p-6 text-green shadow-2xl shadow-green/10 backdrop-blur-sm sm:p-8 lg:p-10"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-burgundy via-gold to-emerald" />
          <div className="flex items-start justify-between gap-6 border-b border-gold/24 pb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-burgundy">
                {group.date}
              </p>
              <h3 className="mt-3 max-w-md font-serif text-4xl font-semibold leading-[0.96] sm:text-5xl">
                {group.title}
              </h3>
            </div>
            <span className="font-serif text-7xl font-semibold leading-none text-gold/30">
              0{groupIndex + 1}
            </span>
          </div>

          <ol className="mt-3 divide-y divide-gold/18">
            {group.items.map((item, index) => (
              <li key={item} className="grid grid-cols-[3.5rem_1fr] items-center gap-4 py-5">
                <span className="font-serif text-3xl font-semibold leading-none text-burgundy">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-base font-semibold leading-7 text-green/82">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </article>
      ))}
    </div>
  );
}
