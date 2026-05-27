import { isUsingTemporaryProductionStore } from "@/lib/firebaseConfig";

export function DataPersistenceNotice() {
  if (!isUsingTemporaryProductionStore()) {
    return null;
  }

  return (
    <section className="border-b border-burgundy/20 bg-burgundy px-5 py-4 text-ivory sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold text-champagne">
          Firebase persistence is not connected
        </p>
        <p className="mt-1 max-w-4xl text-sm leading-6 text-ivory/78">
          Production is currently using a temporary Vercel store, so RSVP counts,
          downloaded save-the-dates, and guest edits may not stay in sync across
          admin pages. Add the Firebase service account values{" "}
          <code className="font-semibold text-champagne">FIREBASE_CLIENT_EMAIL</code>{" "}
          and{" "}
          <code className="font-semibold text-champagne">FIREBASE_PRIVATE_KEY</code>{" "}
          to Vercel environment variables to make the dashboard update reliably.
        </p>
      </div>
    </section>
  );
}
