import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const snapshot = await db.collection("notifications")
      .where("userEmail", "==", email)
      .limit(50)
      .get();

    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort manually to avoid requiring a composite index
    data.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // Return only top 20
    data = data.slice(0, 20);

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { notificationId, read } = await request.json();

    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID is required." }, { status: 400 });
    }

    await db.collection("notifications").doc(notificationId).update({
      read: read ?? true
    });

    return NextResponse.json({ success: true, message: "Notification updated." });

  } catch (error: any) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ error: "Failed to update notification." }, { status: 500 });
  }
}
