# SkillSwap: Peer-to-Peer Learning Platform

SkillSwap is a modern, student-centric web application designed to facilitate skill bartering within university communities. It allows students to exchange knowledge, host group sessions, and grow their expertise through a credit-based economy.

## 🚀 Key Features

- **Dynamic Discovery**: Find and connect with students who possess the skills you want to learn. Filter by expertise, department, or specific interest.
- **Skill Vault**: Manage your "Teaching" expertise and "Learning" goals. Track your mastery progress and showcase your achievements in the Hall of Fame.
- **Group Sessions**: Host or join community-based learning sessions. Collaborate with multiple students simultaneously on topics ranging from coding to UI design.
- **Credit Economy**: A fair exchange system where students earn credits by sharing their knowledge and spend them to learn new skills.
- **Real-time Notifications**: Stay updated with instant alerts for swap requests, session approvals, and upcoming class reminders.
- **Secure Authentication**: Student-verified login system ensuring a safe and trusted environment for campus communities.

## 🛠️ Technology Stack

- **Frontend**: [Next.js 14+](https://nextjs.org/) (App Router), React, Tailwind CSS.
- **Backend**: Next.js API Routes, [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup).
- **Database**: [Google Cloud Firestore](https://firebase.google.com/docs/firestore).
- **Authentication**: Custom Email/Password and OTP-based verification.
- **Icons & UI**: Material Symbols, Lexend & Jakarta Sans typography.

## 📂 Project Structure

- `/app`: Next.js App Router pages and API routes.
- `/components`: Reusable UI components (Sidebar, NotificationCenter, etc.).
- `/lib`: Configuration files for Firebase and utility functions.
- `/public`: Static assets and media.

## ⚙️ Getting Started

### Prerequisites
- Node.js 18.x or higher
- A Firebase project with Firestore enabled

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd webswap
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Firebase credentials:
   ```env
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY="your-private-key"
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛡️ Authentication & Security
The platform uses `firebase-admin` for server-side validation and secure database operations. Ensure your Service Account keys are kept private and never committed to version control.

## 📝 License
This project is for educational and community-driven development.
