import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const type = searchParams.get("type"); // 'incoming' or 'outgoing'

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (type === "incoming") {
      const snapshot = await db.collection("requests").where("receiverEmail", "==", email).get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json({ success: true, data });
    } else if (type === "outgoing") {
      const snapshot = await db.collection("requests").where("senderEmail", "==", email).get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json({ success: true, data });
    } else {
      const [incoming, outgoing] = await Promise.all([
        db.collection("requests").where("receiverEmail", "==", email).get(),
        db.collection("requests").where("senderEmail", "==", email).get()
      ]);

      const all = [
        ...incoming.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        ...outgoing.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      ];

      return NextResponse.json({ success: true, data: all });
    }

  } catch (error: any) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ error: "Failed to fetch requests." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { senderEmail, receiverEmail, skillWanted, skillOffered, message } = await request.json();

    if (!senderEmail || !receiverEmail) {
      return NextResponse.json({ error: "Both sender and receiver emails are required." }, { status: 400 });
    }

    // Fetch sender profile to get their name
    const senderDoc = await db.collection("users").doc(senderEmail).get();
    const receiverDoc = await db.collection("users").doc(receiverEmail).get();

    if (!senderDoc.exists || !receiverDoc.exists) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const senderData = senderDoc.data()!;
    const receiverData = receiverDoc.data()!;

    // Check if a pending request already exists between these two users
    const existingCheck = await db.collection("requests")
      .where("senderEmail", "==", senderEmail)
      .where("receiverEmail", "==", receiverEmail)
      .where("status", "==", "pending")
      .get();

    if (!existingCheck.empty) {
      return NextResponse.json({ error: "You already have a pending request with this user." }, { status: 409 });
    }

    // Create the swap request
    const newRequest = {
      senderEmail,
      senderName: senderData.fullName || "Unknown",
      receiverEmail,
      receiverName: receiverData.fullName || "Unknown",
      skillWanted: skillWanted || receiverData.expertise?.[0] || "General",
      skillOffered: skillOffered || senderData.expertise?.[0] || "General",
      message: message || `Hi ${receiverData.fullName}, I'd love to swap skills with you!`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("requests").add(newRequest);

    return NextResponse.json({
      success: true,
      message: "Swap request sent successfully!",
      data: { id: docRef.id, ...newRequest }
    });

  } catch (error: any) {
    console.error("Error creating swap request:", error);
    return NextResponse.json({ error: "Failed to create swap request: " + error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { requestId, action, email } = await request.json();

    if (!requestId || !action) {
      return NextResponse.json({ error: "Request ID and action are required." }, { status: 400 });
    }

    const requestDoc = await db.collection("requests").doc(requestId).get();
    if (!requestDoc.exists) {
      return NextResponse.json({ error: "Request not found." }, { status: 404 });
    }

    const requestData = requestDoc.data()!;

    if (action === "accept") {
      // Update request status
      await db.collection("requests").doc(requestId).update({
        status: "accepted",
        acceptedAt: new Date().toISOString()
      });

      // Create a session between the two users
      await db.collection("sessions").add({
        participants: [requestData.senderEmail, requestData.receiverEmail],
        senderName: requestData.senderName,
        receiverName: requestData.receiverName,
        skill: requestData.skillWanted,
        title: `${requestData.skillWanted} Swap Session`,
        partnerName: requestData.senderName,
        status: "upcoming",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: "3:00 PM",
        duration: "1h",
        type: "learned",
        credits: 2,
        createdAt: new Date().toISOString()
      });

      return NextResponse.json({ success: true, message: "Request accepted! Session created." });

    } else if (action === "decline") {
      await db.collection("requests").doc(requestId).update({
        status: "declined",
        declinedAt: new Date().toISOString()
      });

      return NextResponse.json({ success: true, message: "Request declined." });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });

  } catch (error: any) {
    console.error("Error updating request:", error);
    return NextResponse.json({ error: "Failed to update request." }, { status: 500 });
  }
}
