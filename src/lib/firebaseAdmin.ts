
import admin from 'firebase-admin';

// --- Environment Variable Retrieval ---
const serviceAccountKeyJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

// --- Admin SDK Initialization ---
let adminApp: admin.app.App | undefined = undefined;
let adminDb: admin.firestore.Firestore | null = null;
let adminStorage: admin.storage.Storage | null = null;

const initializeAdminApp = () => {
  if (admin.apps.length > 0) {
    console.log('[FirebaseAdmin] Using existing Firebase Admin SDK app.');
    return admin.apps[0];
  }

  console.log('[FirebaseAdmin] Initializing new Firebase Admin SDK app...');

  if (!serviceAccountKeyJson) {
    throw new Error('CRITICAL: FIREBASE_SERVICE_ACCOUNT_KEY_JSON environment variable is not set. The server cannot authenticate with Firebase services. Please add it to your .env.local file.');
  }

  if (!storageBucket) {
    throw new Error('CRITICAL: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variable is not set. The server cannot connect to Firebase Storage.');
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountKeyJson);
  } catch (e: any) {
    throw new Error(`CRITICAL: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY_JSON. Please ensure it's a valid, unescaped JSON string. Error: ${e.message}`);
  }

  try {
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket,
    });
    console.log('[FirebaseAdmin] Firebase Admin SDK initialized successfully.');
    return app;
  } catch (error: any) {
    console.error('[FirebaseAdmin] CRITICAL ERROR during admin.initializeApp():', error.message);
    throw new Error(`Failed to initialize Firebase Admin SDK. Code: ${error.code}. Message: ${error.message}`);
  }
};

try {
  adminApp = initializeAdminApp();
  adminDb = admin.firestore(adminApp);
  adminStorage = admin.storage(adminApp);
  console.log('[FirebaseAdmin] Firestore and Storage instances obtained.');
} catch (error: any) {
  console.error('--------------------------------------------------------------------');
  console.error('[FirebaseAdmin] A critical error occurred during initialization.');
  console.error(error.message);
  console.error('--------------------------------------------------------------------');
  // Set to null so dependent services know initialization failed.
  adminDb = null;
  adminStorage = null;
}

export { admin, adminDb, adminStorage };
