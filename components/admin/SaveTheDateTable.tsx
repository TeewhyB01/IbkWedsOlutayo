import Link from "next/link";
import type { ReactNode } from "react";

import { SaveTheDateDownloadButton } from "@/components/admin/SaveTheDateDownloadButton";
import type { GuestRecord } from "@/types";

const pageSize = 10;

export function SaveTheDateTable({
  guests,
  page,
}: {
  guests: GuestRecord[];
  page: number;
}) {
  const totalPages = Math.max(Math.ceil(guests.length / pageSize), 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  const pageGuests = guests.slice(start, start + pageSize);

  return (
    <section className="mt-10 rounded-[1.5rem] border border-gold/22 bg-white/76 p-5 shadow-xl shadow-gold/10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-burgundy">
            Save-the-Date PDFs
          </p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-green">
            Download once per invitation code
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Each generated invitation code has a unique save-the-date PDF. Once
            a PDF is downloaded, that code is counted as shared and the download
            action locks.
          </p>
        </div>
        <p className="rounded-full border border-gold/24 bg-ivory px-4 py-2 text-sm font-semibold text-green">
          Page {safePage} of {totalPages}
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-gold/18">
        <div className="overflow-x-auto">
          <table className="min-w-[920px] w-full text-left text-sm">
            <thead className="bg-green text-ivory">
              <tr>
                <th className="px-4 py-4">No.</th>
                <th className="px-4 py-4">Guest</th>
                <th className="px-4 py-4">Code</th>
                <th className="px-4 py-4">Seats</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Save the Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/14 bg-ivory/50">
              {pageGuests.map((guest, index) => {
                const isDownloaded = Boolean(guest.save_the_date_downloaded_at);

                return (
                  <tr key={guest.id}>
                    <td className="px-4 py-4 font-mono text-xs text-muted">
                      {start + index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-green">{guest.guest_name}</p>
                      <p className="text-xs text-muted">{guest.group_name}</p>
                    </td>
                    <td className="px-4 py-4 font-mono text-sm font-semibold text-burgundy">
                      {guest.invitation_code}
                    </td>
                    <td className="px-4 py-4 text-muted">
                      {guest.allowed_guest_count}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full border border-gold/20 bg-white/76 px-3 py-1 text-xs font-semibold text-green">
                        {isDownloaded ? "Shared" : "Unshared"}
                      </span>
                      {guest.save_the_date_downloaded_at ? (
                        <p className="mt-2 text-xs text-muted">
                          {new Date(guest.save_the_date_downloaded_at).toLocaleString("en-GB")}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <SaveTheDateDownloadButton
                        guestId={guest.id}
                        code={guest.invitation_code}
                        alreadyDownloaded={isDownloaded}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <PaginationLink disabled={safePage <= 1} page={safePage - 1}>
          Previous 10
        </PaginationLink>
        <PaginationLink disabled={safePage >= totalPages} page={safePage + 1}>
          Next 10
        </PaginationLink>
      </div>
    </section>
  );
}

function PaginationLink({
  page,
  disabled,
  children,
}: {
  page: number;
  disabled: boolean;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <span className="rounded-full border border-gold/16 px-5 py-3 text-sm font-semibold text-muted/55">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={`/admin/invitations?page=${page}`}
      className="rounded-full border border-gold/28 bg-ivory px-5 py-3 text-sm font-semibold text-green transition hover:bg-cream"
    >
      {children}
    </Link>
  );
}
