import Navbar from "./components/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 overflow-hidden pt-24 pb-12">
        {/* Hero Section */}
        <section className="relative px-6 pt-16 pb-32 md:pt-24 md:pb-40 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Background shapes */}
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float delay-200"></div>

          <div className="flex-1 z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-semibold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
              Join 10,000+ students swapping skills
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 text-slate-900">
              Master New Skills,<br />
              <span className="gradient-text">No Money Needed.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed font-[family-name:var(--font-lexend)]">
              The campus economy where knowledge is the currency. Teach what you love, learn what you need, and build your portfolio through peer-to-peer exchanges.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                href="/auth"
                className="w-full sm:w-auto px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                Start Swapping
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link 
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-lg border border-slate-200 shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                See How It Works
              </Link>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-slate-500 font-medium">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                    <span className="material-symbols-outlined text-slate-400 text-xl">person</span>
                  </div>
                ))}
              </div>
              <p>Trusted by students at 50+ universities</p>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-lg z-10 animate-scale-in delay-300">
            {/* Mockup Card */}
            <div className="card-level-3 p-6 bg-white border border-slate-100 relative">
              {/* Floating element 1 */}
              <div className="absolute -left-12 top-10 glass p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-float delay-200">
                <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Skill Match!</p>
                  <p className="text-xs text-slate-500">Python for UX Design</p>
                </div>
              </div>
              
              {/* Floating element 2 */}
              <div className="absolute -right-8 bottom-20 glass p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float delay-500">
                <div className="w-10 h-10 rounded-full bg-tertiary-100 flex items-center justify-center text-tertiary-600">
                  <span className="material-symbols-outlined">stars</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">+5 Credits</p>
                  <p className="text-xs text-slate-500">Earned today</p>
                </div>
              </div>

              {/* Main mockup content */}
              <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-100 h-[400px] flex flex-col">
                <div className="h-12 bg-white border-b border-slate-100 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  </div>
                </div>
                <div className="flex-1 p-6 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary-100 shrink-0"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-100 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="h-24 bg-slate-200 rounded-xl mt-4"></div>
                  <div className="flex gap-2 mt-auto">
                    <div className="h-10 bg-primary-500 rounded-lg w-full opacity-80"></div>
                    <div className="h-10 bg-slate-200 rounded-lg w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-10"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">
                Engineered for <span className="text-secondary-400">Learning</span>
              </h2>
              <p className="text-lg text-slate-300 font-[family-name:var(--font-lexend)]">
                Everything you need to trade expertise seamlessly, built into one platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "psychology",
                  color: "primary",
                  title: "AI-Powered Matching",
                  desc: "Our algorithm analyzes your syllabus and interests to find the perfect peer mentor. No more endless scrolling."
                },
                {
                  icon: "videocam",
                  color: "secondary",
                  title: "Integrated Video",
                  desc: "Built-in high-def calls with screen sharing, collaborative whiteboards, and code editors."
                },
                {
                  icon: "account_balance_wallet",
                  color: "tertiary",
                  title: "Credit Economy",
                  desc: "Earn credits by teaching and spend them on any skill you want to learn. Fair and transparent."
                },
                {
                  icon: "workspace_premium",
                  color: "slate",
                  title: "Portfolio Builder",
                  desc: "Every successful swap generates a verifiable badge for your LinkedIn and resume."
                }
              ].map((feature, i) => (
                <div key={i} className="glass-dark p-8 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-colors">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 
                    ${feature.color === 'primary' ? 'bg-primary-500/20 text-primary-400' : 
                      feature.color === 'secondary' ? 'bg-secondary-500/20 text-secondary-400' : 
                      feature.color === 'tertiary' ? 'bg-tertiary-500/20 text-tertiary-400' : 
                      'bg-slate-500/20 text-slate-300'}`}>
                    <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-slate-900">
              How <span className="text-primary-500">SkillSwap</span> Works
            </h2>
            <p className="text-lg text-slate-600 font-[family-name:var(--font-lexend)]">
              Three simple steps to unlock a world of knowledge without opening your wallet.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-100 via-secondary-200 to-tertiary-100 -translate-y-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {[
                {
                  num: "1",
                  title: "List Your Talents",
                  desc: "Tell us what you're good at. Whether it's Calculus, French, or Adobe Premiere, someone needs your expertise."
                },
                {
                  num: "2",
                  title: "Match & Swap",
                  desc: "Our AI connects you with someone who has the skill you need. Agree on a time and jump into our secure workspace."
                },
                {
                  num: "3",
                  title: "Trade & Grow",
                  desc: "Complete the session and earn Skill Credits. Use them to book your next lesson in any category."
                }
              ].map((step, i) => (
                <div key={i} className="text-center relative group">
                  <div className="w-16 h-16 mx-auto bg-white border-4 border-surface-50 shadow-xl rounded-full flex items-center justify-center text-2xl font-extrabold text-primary-600 mb-6 group-hover:scale-110 group-hover:border-primary-100 transition-all">
                    {step.num}
                  </div>
                  <div className="card-level-1 p-8 h-full bg-white relative z-10">
                    <h3 className="text-xl font-bold mb-4 text-slate-800">{step.title}</h3>
                    <p className="text-slate-600 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-secondary-400 opacity-20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                Ready to join the 10,000+ students swapping skills?
              </h2>
              <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
                Sign up with your .edu email and get 5 free credits to start your first learning journey today.
              </p>
              <Link 
                href="/auth"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 hover:bg-slate-50 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Create Free Account
                <span className="material-symbols-outlined">school</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-500">swap_horiz</span>
            <span className="font-bold text-slate-800 font-[family-name:var(--font-jakarta)]">SkillSwap</span>
            <span className="text-slate-500 text-sm ml-2">(c) 2024. Built for students, by students.</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <Link href="#" className="hover:text-primary-500 transition-colors">Community Guidelines</Link>
            <Link href="#" className="hover:text-primary-500 transition-colors">Safety Center</Link>
            <Link href="#" className="hover:text-primary-500 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary-500 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
