"use client";

import Link from "next/link";
import { ArrowRight, Brain, Code2, Sparkles, GraduationCap, Network, ArrowDown, UserCheck } from "lucide-react";
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
                                Start Learning
                                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-8 py-4 rounded-full font-bold text-lg border border-gray-800 hover:bg-gray-900 transition-colors flex items-center gap-2"
                            >
                                Explore Features
                                <ArrowDown className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div id="features" className="container mx-auto px-6 py-24 border-t border-gray-900">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Learning Path</h2>
                    <p className="text-gray-400 text-lg">Select a feature below to start your AI engineering journey</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Network, // System Design needs a network-like icon
                            title: "System Design for AI",
                            desc: "Architect scalable LLM systems, RAG pipelines, and inference clusters. Learn the infrastructure behind the models.",
                            link: "/system-design", // Updated link
                            delay: "0ms"
                        },
                        {
                            icon: Code2,
                            title: "Adaptive Coding Arena",
                            desc: "From Python basics to advanced GenAI agents, we generate the perfect challenge for your skill level.",
                            link: "/arena",
                            delay: "100ms"
                        },
                        {
                            icon: Brain,
                            title: "Adaptive AI Mentor",
                            desc: "Your personal AI tutor that analyzes your code in real-time, pointing out logic gaps and suggesting optimizations.",
                            link: "/mentor",
                            delay: "200ms"
                        },
                        {
                            icon: GraduationCap,
                            title: "Role-Based Learning Tracks",
                            desc: "Scenario-based questions tailored to your role. Multiple choice, fill-in-the-blank, and output selection challenges for ML Engineers, Data Scientists, and more.",
                            link: "/tracks",
                            delay: "350ms"
                        },
                        {
                            icon: Sparkles, // Use Sparkles or similar for "Novel/Research"
                            title: "Paper Implementations",
                            desc: "Don't just read papers—implement them. Build Transformers, Diffusion models, and MoE from scratch.",
                            link: "/papers", // Updated link
                            delay: "450ms"
                        },
                        {
                            icon: UserCheck,
                            title: "Mock Interview Studio",
                            desc: "Full-scale simulations of coding, behavioral, and system design interviews with AI grading.",
                            link: "/mock-interview",
                            delay: "500ms"
                        }
                    ].map((feature, i) => (
                        <Link
                            key={i}
                            href={feature.link}
                            className="p-8 rounded-2xl bg-gray-900/20 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-900/20 group animate-fade-in-up"
                            style={{ animationDelay: feature.delay }}
                        >
                            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{feature.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}
