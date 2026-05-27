import { Banknote, Gift, HeartHandshake } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import type { RegistryOption } from "@/types";

const icons = {
  gift: Gift,
  bank: Banknote,
  heart: HeartHandshake,
};

export function RegistryCard({ option }: { option: RegistryOption }) {
  const Icon = icons[option.icon];

  return (
    <article className="relative overflow-hidden rounded-[1.5rem] border border-gold/24 bg-white/70 p-6 shadow-xl shadow-gold/10 backdrop-blur-sm">
      <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full bg-champagne/22" />
      <div className="relative">
        <div className="mb-5 grid size-12 place-items-center rounded-full bg-green text-ivory">
          <Icon size={20} />
        </div>
        <h3 className="font-serif text-4xl font-semibold text-green">{option.title}</h3>
        <p className="mt-4 text-sm leading-7 text-muted">{option.description}</p>
        {option.accountFields ? (
          <>
            <p className="mt-5 rounded-2xl border border-gold/18 bg-ivory/72 p-4 text-sm font-semibold text-green">
              Bank transfer details will be shared securely.
            </p>
            <dl className="sr-only">
              <dt>Account Name</dt>
              <dd>{option.accountFields.accountName}</dd>
              <dt>Bank Name</dt>
              <dd>{option.accountFields.bankName}</dd>
              <dt>Account Number</dt>
              <dd>{option.accountFields.accountNumber}</dd>
              <dt>Sort Code / IBAN</dt>
              <dd>{option.accountFields.iban}</dd>
            </dl>
          </>
        ) : null}
        <ButtonLink href={option.href} variant="secondary" className="mt-6 min-h-11 px-5 text-xs">
          {option.buttonLabel}
        </ButtonLink>
      </div>
    </article>
  );
}
