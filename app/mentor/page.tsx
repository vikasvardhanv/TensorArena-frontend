"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bot, Sparkles, BookOpen, Play } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function MentorPage() {
    const router = useRouter();
    const { status } = useSession();

    const handleStart = () => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/mentor/session");
        } else {
            router.push("/mentor/session");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
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
                        <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 text-purple-400">
                            <Bot className="w-10 h-10" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                            Adaptive AI Mentor
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Your personalized coding coach. Get real-time feedback, hints, and explanations while you solve problems.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <div className="p-8 rounded-2xl bg-gray-900/20 border border-gray-800">
                            <Sparkles className="w-8 h-8 text-yellow-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Smart Hints</h3>
                            <p className="text-gray-400">Stuck? The AI analyzes your personalized code and provides contextual hints without giving away the answer.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-gray-900/20 border border-gray-800">
                            <BookOpen className="w-8 h-8 text-blue-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Concept Explanations</h3>
                            <p className="text-gray-400">Don&apos;t understand a topic? Ask the mentor to explain algorithms and data structures in simple terms.</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <button
                            onClick={handleStart}
                            className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 mx-auto flex items-center gap-3"
                        >
                            <span>Start Mentoring Session</span>
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
