import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env['FIREBASE_API_KEY'],
  authDomain: process.env['FIREBASE_AUTH_DOMAIN'],
  projectId: process.env['FIREBASE_PROJECT_ID'],
  storageBucket: process.env['FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'],
  appId: process.env['FIREBASE_APP_ID'],
  measurementId: process.env['FIREBASE_MEASUREMENT_ID'],
};

// Initialize only once to support hot reload during development
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6Ld8E3QqAAAAAK-OCfevnvhzo1UMGhK5s1Rio9fj'),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true,
});

const firestore = getFirestore(appCheck.app);

export default firestore;
