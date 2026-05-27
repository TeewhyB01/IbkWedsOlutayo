# Ibukunoluwa & Olutayo Wedding RSVP

Premium multi-page wedding website for Ibukunoluwa and Olutayo's Nigerian wedding weekend.

## Routes

- `/` Home
- `/our-story`
- `/travel-stay`
- `/events`
- `/registry`
- `/rsvp`
- `/admin`
- `/admin/guests`
- `/admin/rsvps`

## Local Development

This project uses Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Firebase Firestore, React Hook Form, Zod, and Lucide icons.

```bash
pnpm install
pnpm dev
```

The local dev server runs at `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and adjust the Firebase or deployment values if needed.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_PASSWORD=SholaBenson123@
```

Firebase web app keys are public configuration. Firestore writes use `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` from a Firebase service account, so the database can stay locked down. Admin access is still protected by the server-side password session.

## Firebase

The app stores live data in Firestore collections:

- `guests`
- `rsvps`
- `save_the_date_downloads`

On first access with service credentials configured, the Firebase data layer seeds 300 invitation-code records if the `guests` collection is empty. The app uses server-side API routes for invitation-code validation, RSVP submission, admin guest management, save-the-date download locking, and CSV export.

## Demo RSVP Codes

If Firebase configuration is removed, local preview mode falls back to the demo store:

- `A123` / both events / 2 seats
- `T001` / traditional only / 1 seat
- `F555` / grand finale only / 4 seats
- `IO26` / both events / 1 seat

With Firebase configuration present, the app reads and writes from Firestore.

## Editing Content

Most public copy and placeholder data lives in:

- `content/siteContent.ts`
- `content/images.ts`
- `content/storyQuestions.ts`
- `content/events.ts`
- `content/travel.ts`
- `content/registry.ts`

Replace placeholder images in `public/images` using the same filenames or update `content/images.ts`.
