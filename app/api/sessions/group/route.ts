import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const snapshot = await db.collection("group_sessions")
      .orderBy("date", "asc")
      .limit(10)
      .get();

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error fetching group sessions:", error);
    return NextResponse.json({ error: "Failed to fetch group sessions." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, topic, date, time, description, hostEmail, hostName } = body;

    if (!title || !date || !time || !hostEmail) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const newSession = {
      title,
      topic,
      date,
      time,
      description,
      hostEmail,
      hostName,
      participants: [],
      maxParticipants: 10,
      createdAt: new Date().toISOString(),
      status: "upcoming"
    };

    const docRef = await db.collection("group_sessions").add(newSession);

    return NextResponse.json({ 
      success: true, 
      message: "Group session created!", 
      data: { id: docRef.id, ...newSession } 
    });
  } catch (error: any) {
    console.error("Error creating group session:", error);
    return NextResponse.json({ error: "Failed to create group session." }, { status: 500 });
  }
}
