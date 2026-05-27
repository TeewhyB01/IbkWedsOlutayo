import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { RSVPFlow } from "@/components/rsvp/RSVPFlow";
import { FadeIn } from "@/components/ui/FadeIn";
import { weddingImages } from "@/content/images";
import { formatDeadline } from "@/lib/utils";

export const metadata: Metadata = {
  title: "RSVP",
  description:
    "Confirm your attendance for Ibukunoluwa and Olutayo's wedding using your invitation code.",
};

export default function RSVPPage() {
  return (
    <>
      <PageHeader
        title="RSVP"
        subtitle="Please enter the invitation code sent with your invitation to confirm your attendance."
        image={weddingImages.rsvpHero}
      />

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div className="mx-auto mb-10 text-center">
              <SectionHeading
                eyebrow="Confirm Attendance"
                title="Your invitation code unlocks your RSVP"
                align="center"
              >
                <p>
                  RSVP updates are open until {formatDeadline()}. Codes are 4
                  letters or numbers, and the form will only show the events
                  included in your invitation.
                </p>
              </SectionHeading>
            </div>
          </FadeIn>
          <RSVPFlow />
        </div>
      </section>
    </>
  );
}
