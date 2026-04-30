import { db } from "./firebase-admin";

export async function createNotification({
  userEmail,
  title,
  message,
  type,
  link
}: {
  userEmail: string;
  title: string;
  message: string;
  type: "request" | "session" | "system";
  link?: string;
}) {
  try {
    await db.collection("notifications").add({
      userEmail,
      title,
      message,
      type,
      link: link || "",
      read: false,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}
