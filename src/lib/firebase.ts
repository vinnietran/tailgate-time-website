import { initializeApp, getApps } from "firebase/app";
import {
  getToken,
  initializeAppCheck,
  ReCaptchaV3Provider,
  type AppCheck
} from "firebase/app-check";
import { getAnalytics, isSupported, logEvent, type Analytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const forceMockFirebase = import.meta.env.VITE_E2E_MOCK_FIREBASE === "true";
const appCheckSiteKey =
  typeof import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY === "string"
    ? import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY.trim()
    : "";
const appCheckDebugToken =
  typeof import.meta.env.VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN === "string"
    ? import.meta.env.VITE_FIREBASE_APP_CHECK_DEBUG_TOKEN.trim()
    : "";
const hasConfig = Boolean(
  !forceMockFirebase &&
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
);

export const app = hasConfig
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const functions = app ? getFunctions(app) : null;
export const storage = app ? getStorage(app) : null;

type AppCheckDebugWindow = Window &
  typeof globalThis & {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean;
  };

let appCheckInstance: AppCheck | null = null;

if (app && typeof window !== "undefined" && appCheckSiteKey) {
  try {
    if (import.meta.env.DEV && appCheckDebugToken) {
      (window as AppCheckDebugWindow).FIREBASE_APPCHECK_DEBUG_TOKEN =
        appCheckDebugToken === "true" ? true : appCheckDebugToken;
    }

    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true
    });
  } catch (error) {
    console.warn("Firebase App Check initialization failed", error);
  }
}

export const appCheck = appCheckInstance;

let analyticsPromise: Promise<Analytics | null> | null = null;

function getAnalyticsInstance() {
  if (!app || typeof window === "undefined" || !firebaseConfig.measurementId) {
    return Promise.resolve<Analytics | null>(null);
  }

  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((supported) => (supported ? getAnalytics(app) : null))
      .catch(() => null);
  }

  return analyticsPromise;
}

export function trackPageView(path: string) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  void getAnalyticsInstance().then((analytics) => {
    if (!analytics) {
      return;
    }

    logEvent(analytics, "page_view", {
      page_location: window.location.href,
      page_path: path,
      page_title: document.title
    });
  });
}

export async function getAppCheckTokenValue() {
  if (!appCheckInstance) {
    return null;
  }

  try {
    const result = await getToken(appCheckInstance, false);
    return result.token || null;
  } catch (error) {
    console.warn("Failed to resolve Firebase App Check token", error);
    return null;
  }
}
