import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    console.log("Initializing Firebase Admin...");
    console.log("Project ID:", "swapweb-30b2f");
    console.log("Client Email exists:", !!process.env.FIREBASE_CLIENT_EMAIL);
    console.log("Private Key exists:", !!process.env.FIREBASE_PRIVATE_KEY);

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: "swapweb-30b2f",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("Firebase Admin initialization failed:", error);
  }
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
