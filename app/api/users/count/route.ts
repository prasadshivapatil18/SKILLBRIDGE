import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const snapshot = await db.collection("users").get();
    const count = snapshot.size;

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error("Error fetching user count:", error);
    return NextResponse.json({ success: true, count: 0 });
  }
}
