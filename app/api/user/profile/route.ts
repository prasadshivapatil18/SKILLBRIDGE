import { NextResponse } from "next/server";
import { db, admin } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, bio, expertise, interests, masteredSkills, credits, action } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Handle credit increments
    if (action === "increment_credits" && credits) {
      await db.collection("users").doc(email).update({
        credits: admin.firestore.FieldValue.increment(credits),
        updatedAt: new Date().toISOString()
      });
      return NextResponse.json({ success: true, message: "Credits updated successfully!" });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };
    
    if (fullName !== undefined) updateData.fullName = fullName;
    if (bio !== undefined) updateData.bio = bio;
    if (expertise !== undefined) updateData.expertise = expertise;
    if (interests !== undefined) updateData.interests = interests;
    if (masteredSkills !== undefined) updateData.masteredSkills = masteredSkills;

    // Check if user exists to handle credits/onboardedAt
    const userDoc = await db.collection("users").doc(email).get();
    if (!userDoc.exists) {
      updateData.credits = 50;
      updateData.onboardedAt = new Date().toISOString();
      updateData.email = email;
    }

    // Save/Update user profile to Firestore
    await db.collection("users").doc(email).set(updateData, { merge: true });

    return NextResponse.json({ 
      success: true, 
      message: userDoc.exists ? "Profile updated successfully!" : "Profile created successfully!" 
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
