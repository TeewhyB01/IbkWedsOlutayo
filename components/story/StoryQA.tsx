import type { StoryQuestion } from "@/types";

export function StoryQA({ questions }: { questions: StoryQuestion[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {questions.map((item, index) => (
        <article
          key={item.question}
          className="rounded-[1.5rem] border border-gold/22 bg-white/72 p-5 shadow-xl shadow-gold/10 backdrop-blur-sm sm:p-6"
        >
          <div className="flex items-start gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald to-burgundy font-serif text-xl font-semibold text-ivory">
              {index + 1}
            </span>
            <h3 className="font-serif text-3xl font-semibold leading-[1.05] text-green">
              {item.question}
            </h3>
          </div>
          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-gold/16 bg-ivory/72 p-5">
              <p className="text-xs font-semibold uppercase text-burgundy">Ibukunoluwa</p>
              <p className="mt-3 text-sm leading-7 text-muted">{item.brideAnswer}</p>
            </div>
            <div className="rounded-2xl border border-gold/16 bg-green/5 p-5">
              <p className="text-xs font-semibold uppercase text-green">Olutayo</p>
              <p className="mt-3 text-sm leading-7 text-muted">{item.groomAnswer}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
