"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, UserCheck, Video, CheckCircle, Play } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MockInterviewPage() {
    const router = useRouter();
    const { status } = useSession();

    const handleStart = () => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/mock-interview");
        } else {
            router.push("/mock-interview/session");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
            <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-gray-800">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Hub</span>
                    </Link>
                </div>
            </header>

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <div className="w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 text-orange-400">
                            <UserCheck className="w-10 h-10" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                            Mock Interview Studio
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Full-scale simulations of coding, behavioral, and system design interviews with AI grading. Prepare for FAANG+ interviews.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <div className="p-8 rounded-2xl bg-gray-900/20 border border-gray-800">
                            <Video className="w-8 h-8 text-red-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Real-time Simulation</h3>
                            <p className="text-gray-400">Experience the pressure of a real interview. Solve problems while an AI interviewer observes and questions you.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-gray-900/20 border border-gray-800">
                            <CheckCircle className="w-8 h-8 text-green-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Instant Feedback</h3>
                            <p className="text-gray-400">Receive detailed feedback on your communication, problem-solving approach, and code efficiency.</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <button
                            onClick={handleStart}
                            className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 mx-auto flex items-center gap-3"
                        >
                            <span>Start Mock Interview</span>
                            <Play className="w-5 h-5 fill-current" />
                            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                        </button>
                        <p className="mt-4 text-sm text-gray-500">
                            *Requires login to access the arena
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
