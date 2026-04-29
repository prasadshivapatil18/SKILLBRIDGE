import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Get the user from 'auth' collection
    const userDoc = await db.collection("auth").doc(email).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found. Please register first." }, { status: 401 });
    }

    const { password: hashedPassword } = userDoc.data()!;

    // Check password
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    // Check if profile exists in 'users' collection
    const profileDoc = await db.collection("users").doc(email).get();
    const needsOnboarding = !profileDoc.exists;

    return NextResponse.json({ 
      success: true, 
      needsOnboarding,
      message: "Login successful!",
      userId: email
    });

  } catch (error: any) {
    console.error("Login error details:", error);
    return NextResponse.json({ error: "Failed to login: " + error.message }, { status: 500 });
  }
}
