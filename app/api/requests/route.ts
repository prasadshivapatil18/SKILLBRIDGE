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

    let query = db.collection("requests");

    if (type === "incoming") {
      query = query.where("receiverEmail", "==", email);
    } else if (type === "outgoing") {
      query = query.where("senderEmail", "==", email);
    } else {
      // Get all where user is either sender or receiver
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

    const snapshot = await query.get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ error: "Failed to fetch requests." }, { status: 500 });
  }
}
