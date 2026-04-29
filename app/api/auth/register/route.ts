import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    // Check if user already exists
    const userDoc = await db.collection("auth").doc(email).get();
    if (userDoc.exists) {
      return NextResponse.json({ error: "User already exists. Please login instead." }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store auth info in 'auth' collection
    await db.collection("auth").doc(email).set({
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: "Account created successfully! Please complete your profile.",
      userId: email
    });

  } catch (error: any) {
    console.error("Registration error details:", error);
    return NextResponse.json({ error: "Failed to register: " + error.message }, { status: 500 });
  }
}
