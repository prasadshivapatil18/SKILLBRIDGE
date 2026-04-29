import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Get current user to see their interests
    const userDoc = await db.collection("users").doc(email).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const userData = userDoc.data()!;
    const interests = userData.interests || [];

    // Fetch ALL users from the database
    const snapshot = await db.collection("users").get();
    
    // Filter out the current user and map with their doc ID (email)
    let mentors = snapshot.docs
      .filter(doc => doc.id !== email)
      .map(doc => ({
        id: doc.id,
        email: doc.id,
        ...doc.data()
      }));

    // Sort by skill match relevance: users whose expertise matches current user's interests come first
    if (interests.length > 0) {
      mentors = mentors.sort((a: any, b: any) => {
        const aMatches = a.expertise?.filter((s: string) => interests.includes(s)).length || 0;
        const bMatches = b.expertise?.filter((s: string) => interests.includes(s)).length || 0;
        return bMatches - aMatches;
      });
    }

    return NextResponse.json({ success: true, data: mentors });

  } catch (error: any) {
    console.error("Error in discovery:", error);
    return NextResponse.json({ error: "Failed to discover mentors." }, { status: 500 });
  }
}
