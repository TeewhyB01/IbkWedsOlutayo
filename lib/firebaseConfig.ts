export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

export const firebaseConfig: FirebaseWebConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyB6EpTDuAjrcsodL-tPsk5tU-dDEtfQo_U",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "ibkwedsolutayo.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "ibkwedsolutayo",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "ibkwedsolutayo.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "16876251930",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:16876251930:web:04023927b21c5d49fadaa3",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-WCNVWJNQKR",
};

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      (hasFirebaseServiceAccount() ||
        process.env.FIREBASE_USE_PUBLIC_REST === "true"),
  );
}

export function hasFirebaseServiceAccount() {
  return Boolean(
    process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY,
  );
}
