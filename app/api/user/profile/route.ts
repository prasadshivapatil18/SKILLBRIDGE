import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { email, fullName, bio, expertise, interests } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Save user profile to Firestore
    await db.collection("users").doc(email).set({
      email,
      fullName,
      bio,
      expertise,
      interests,
      credits: 50, // Give 50 free credits to new users
      onboardedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: "Profile created successfully!" 
    });

  } catch (error: any) {
    console.error("Error saving profile details:", error);
    return NextResponse.json({ error: "Failed to save profile: " + error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const userDoc = await db.collection("users").doc(email).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: userDoc.data() 
    });

  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
  }
}
