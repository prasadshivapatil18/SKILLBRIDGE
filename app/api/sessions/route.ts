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
