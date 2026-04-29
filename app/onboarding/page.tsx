"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<"profile" | "expertise" | "interests">("profile");
  
  // Profile state
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  
  // Expertise state
  const [expertiseInput, setExpertiseInput] = useState("");
  const [expertiseList, setExpertiseList] = useState<string[]>([]);
  
  // Interests state
  const [interestInput, setInterestInput] = useState("");
  const [interestList, setInterestList] = useState<string[]>([]);

  const handleAddExpertise = () => {
    if (expertiseInput.trim() && !expertiseList.includes(expertiseInput.trim())) {
      setExpertiseList([...expertiseList, expertiseInput.trim()]);
      setExpertiseInput("");
    }
  };

  const handleRemoveExpertise = (skill: string) => {
    setExpertiseList(expertiseList.filter(s => s !== skill));
  };

  const handleAddInterest = () => {
    if (interestInput.trim() && !interestList.includes(interestInput.trim())) {
      setInterestList([...interestList, interestInput.trim()]);
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (skill: string) => {
    setInterestList(interestList.filter(s => s !== skill));
  };

  const finishOnboarding = () => {
    // Here you would typically save this data to your backend
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
      <div className="max-w-3xl w-full flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm">swap_horiz</span>
            </div>
            <span className="text-lg font-bold font-[family-name:var(--font-jakarta)] text-slate-800">SkillSwap</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className={`w-3 h-3 rounded-full ${step === 'profile' ? 'bg-primary-500' : 'bg-primary-200'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step === 'expertise' ? 'bg-primary-500' : 'bg-primary-200'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step === 'interests' ? 'bg-primary-500' : 'bg-primary-200'}`}></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 md:p-16">
          {step === "profile" && (
            <div className="animate-fade-in-up max-w-lg mx-auto">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-8 mx-auto">
                <span className="material-symbols-outlined text-3xl text-primary-600">person</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-2">Create Your Profile</h1>
              <p className="text-slate-500 text-center mb-10 text-sm">
                Let's start with the basics. This is how other students will see you.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="A short intro about yourself..."
                    rows={4}
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white resize-none"
                  ></textarea>
                </div>

                <button 
                  onClick={() => setStep("expertise")}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg mt-8 ${
                    fullName ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30' : 'bg-primary-400 cursor-not-allowed shadow-none'
                  }`}
                  disabled={!fullName}
                >
                  Continue to Expertise
                </button>
              </div>
            </div>
          )}

          {step === "expertise" && (
            <div className="animate-fade-in-up max-w-lg mx-auto">
              <div className="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center mb-8 mx-auto">
                <span className="material-symbols-outlined text-3xl text-secondary-600">psychology</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-2">What can you teach?</h1>
              <p className="text-slate-500 text-center mb-10 text-sm">
                Add the skills, subjects, or expertise you are confident in sharing with others.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Add a skill</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddExpertise();
                      }}
                      placeholder="e.g. Graphic Design, Calculus..."
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-200 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
                    />
                    <button 
                      onClick={handleAddExpertise}
                      className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 rounded-xl font-bold transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-slate-50 rounded-xl border border-slate-100">
                  {expertiseList.length === 0 ? (
                    <p className="text-slate-400 text-sm w-full text-center my-auto italic">No skills added yet.</p>
                  ) : (
                    expertiseList.map((skill) => (
                      <div key={skill} className="flex items-center gap-2 bg-secondary-100 text-secondary-800 px-4 py-2 rounded-full font-medium text-sm">
                        {skill}
                        <button onClick={() => handleRemoveExpertise(skill)} className="hover:text-secondary-600 focus:outline-none">
                          <span className="material-symbols-outlined text-sm flex items-center">close</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setStep("profile")}
                    className="w-1/3 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep("interests")}
                    className={`w-2/3 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                      expertiseList.length > 0 ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30' : 'bg-primary-400 cursor-not-allowed shadow-none'
                    }`}
                    disabled={expertiseList.length === 0}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "interests" && (
            <div className="animate-fade-in-up max-w-lg mx-auto">
              <div className="w-16 h-16 bg-tertiary-50 rounded-2xl flex items-center justify-center mb-8 mx-auto">
                <span className="material-symbols-outlined text-3xl text-tertiary-600">lightbulb</span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-2">What do you want to learn?</h1>
              <p className="text-slate-500 text-center mb-10 text-sm">
                Add skills you're looking to acquire. We'll use this to match you with the right peers.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Add an interest</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddInterest();
                      }}
                      placeholder="e.g. Python, Piano, Spanish..."
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:border-tertiary-500 focus:ring-2 focus:ring-tertiary-200 outline-none transition-all text-slate-700 bg-slate-50 focus:bg-white"
                    />
                    <button 
                      onClick={handleAddInterest}
                      className="bg-tertiary-600 hover:bg-tertiary-700 text-white px-6 rounded-xl font-bold transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-slate-50 rounded-xl border border-slate-100">
                  {interestList.length === 0 ? (
                    <p className="text-slate-400 text-sm w-full text-center my-auto italic">No interests added yet.</p>
                  ) : (
                    interestList.map((skill) => (
                      <div key={skill} className="flex items-center gap-2 bg-tertiary-100 text-tertiary-800 px-4 py-2 rounded-full font-medium text-sm">
                        {skill}
                        <button onClick={() => handleRemoveInterest(skill)} className="hover:text-tertiary-600 focus:outline-none">
                          <span className="material-symbols-outlined text-sm flex items-center">close</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setStep("expertise")}
                    className="w-1/3 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={finishOnboarding}
                    className={`w-2/3 py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                      interestList.length > 0 ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30' : 'bg-primary-400 cursor-not-allowed shadow-none'
                    }`}
                    disabled={interestList.length === 0}
                  >
                    Complete Profile
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
