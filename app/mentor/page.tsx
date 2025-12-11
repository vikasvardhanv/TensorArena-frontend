"use client";

import React from "react";
import { Brain, Sparkles, Zap, ArrowRight, Home, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function MentorPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white transition-all mb-6"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <Brain className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Adaptive AI Mentor
                        </h1>
                    </div>

                    <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
                        Your personal AI tutor that analyzes your code in real-time. It doesn&apos;t just grade you—it teaches you by pointing out logic gaps, suggesting optimizations, and explaining complex concepts.
                    </p>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <div className="p-8 rounded-2xl bg-gray-900/30 border border-gray-800">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-yellow-500" />
                            Smart Analysis
                        </h2>
                        <ul className="space-y-4">
                            {[
                                "Real-time complexity analysis (Big O)",
                                "Pattern recognition for common algorithms",
                                "Memory usage optimization tips",
                                "Code style and best practices review"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start text-gray-400">
                                    <CheckCircle2 className="w-5 h-5 mr-3 text-blue-500 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-8 rounded-2xl bg-gray-900/30 border border-gray-800">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Zap className="w-6 h-6 text-purple-500" />
                            Adaptive Learning
                        </h2>
                        <ul className="space-y-4">
                            {[
                                "Customized problem difficulty based on performance",
                                "Concept reinforcement for weak areas",
                                "Progress tracking across different topics",
                                "Personalized learning path generation"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start text-gray-400">
                                    <CheckCircle2 className="w-5 h-5 mr-3 text-purple-500 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col items-center justify-center py-12 border-t border-gray-900">
                    <h2 className="text-3xl font-bold mb-6 text-center">Ready to level up your coding skills?</h2>

                    <Link
                        href="/arena"
                        className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        Start Arena Practice
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="mt-4 text-gray-500 text-sm">
                        Free tier available • No credit card required to start
                    </p>
                </div>
            </div>
        </div>
    );
}
