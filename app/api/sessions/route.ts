import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const status = searchParams.get("status"); // 'upcoming' or 'completed'

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    let query = db.collection("sessions")
      .where("participants", "array-contains", email);

    if (status) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.get();
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, data: sessions });

  } catch (error: any) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json({ error: "Failed to fetch sessions." }, { status: 500 });
  }
}
export async function PATCH(request: Request) {
  try {
    const { sessionId, action, date, time, duration, userEmail } = await request.json();

    if (!sessionId || !action || !userEmail) {
      return NextResponse.json({ error: "Session ID, action, and user email are required." }, { status: 400 });
    }

    const sessionDoc = await db.collection("sessions").doc(sessionId).get();
    if (!sessionDoc.exists) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    const sessionData = sessionDoc.data()!;
    const partnerEmail = sessionData.participants.find((e: string) => e !== userEmail);

    if (action === "propose") {
      if (!date || !time || !duration) {
        return NextResponse.json({ error: "Date, time, and duration are required for proposal." }, { status: 400 });
      }

      await db.collection("sessions").doc(sessionId).update({
        rescheduleRequest: {
          date,
          time,
          duration,
          proposedBy: userEmail,
          status: "pending"
        }
      });

      // Notify partner
      const { createNotification } = require("@/lib/notifications");
      await createNotification({
        userEmail: partnerEmail,
        title: "Reschedule Proposed",
        message: `Your partner wants to reschedule the session for ${date} at ${time}.`,
        type: "session",
        link: "/dashboard"
      });

      return NextResponse.json({ success: true, message: "Reschedule proposal sent." });

    } else if (action === "accept") {
      const { rescheduleRequest } = sessionData;
      if (!rescheduleRequest || rescheduleRequest.status !== "pending") {
        return NextResponse.json({ error: "No pending reschedule request found." }, { status: 400 });
      }

      // Update session with new timings and clear request
      await db.collection("sessions").doc(sessionId).update({
        date: rescheduleRequest.date,
        time: rescheduleRequest.time,
        duration: rescheduleRequest.duration,
        rescheduleRequest: null // Clear request
      });

      // Notify the proposer
      const { createNotification } = require("@/lib/notifications");
      await createNotification({
        userEmail: rescheduleRequest.proposedBy,
        title: "Reschedule Accepted!",
        message: `Your reschedule request for ${rescheduleRequest.date} has been accepted.`,
        type: "session",
        link: "/dashboard"
      });

      return NextResponse.json({ success: true, message: "Reschedule accepted." });

    } else if (action === "reject") {
      const { rescheduleRequest } = sessionData;
      if (!rescheduleRequest || rescheduleRequest.status !== "pending") {
        return NextResponse.json({ error: "No pending reschedule request found." }, { status: 400 });
      }

      // Clear the request
      await db.collection("sessions").doc(sessionId).update({
        rescheduleRequest: null
      });

      // Notify the proposer
      const { createNotification } = require("@/lib/notifications");
      await createNotification({
        userEmail: rescheduleRequest.proposedBy,
        title: "Reschedule Declined",
        message: `Your reschedule request for ${rescheduleRequest.date} was declined.`,
        type: "session",
        link: "/dashboard"
      });

      return NextResponse.json({ success: true, message: "Reschedule declined." });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });

  } catch (error: any) {
    console.error("Error updating session:", error);
    return NextResponse.json({ error: "Failed to update session." }, { status: 500 });
  }
}
