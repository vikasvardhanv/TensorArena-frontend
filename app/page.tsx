"use client";

import Link from "next/link";
import { ArrowRight, Brain, Code2, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleStartCoding = () => {
        if (session) {
            router.push("/arena");
        } else {
            router.push("/login");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900/0 to-gray-900/0" />

                <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium animate-fade-in">
                            <Sparkles className="w-4 h-4" />
                            <span>The Future of AI Learning</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                            Master AI Engineering <br />
                            <span className="text-blue-500">One Prompt at a Time</span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            An adaptive learning platform powered by state-of-the-art LLMs.
                            From Python basics to advanced GenAI agents, we generate the perfect
                            challenge for your skill level.
                        </p>

                        <div className="flex items-center justify-center space-x-4 pt-8">
                            <button
                                onClick={handleStartCoding}
                                className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
                            >
                                Start Coding
                                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                            </button>
                            <Link
                                href="/curriculum"
                                className="px-8 py-4 rounded-full font-bold text-lg border border-gray-800 hover:bg-gray-900 transition-colors"
                            >
                                View Curriculum
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="container mx-auto px-6 py-24 border-t border-gray-900">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Brain,
                            title: "Adaptive AI",
                            desc: "Our backend model analyzes your solutions and generates questions that perfectly match your current skill level."
                        },
                        {
                            icon: Code2,
                            title: "Real-world Scenarios",
                            desc: "Practice with problems derived from actual AI/ML engineering challenges, not just abstract algorithms."
                        },
                        {
                            icon: Sparkles,
                            title: "Instant Feedback",
                            desc: "Get immediate, detailed feedback on your code logic, efficiency, and style from our AI tutor."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-gray-900/20 border border-gray-800 hover:border-gray-700 transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
