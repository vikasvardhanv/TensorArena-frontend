"use client";

import React from "react";
import { ArrowLeft, Database, Server, Globe, Shield, Zap, Cpu, Home } from "lucide-react";
import Link from "next/link";

const challenges = [
    {
        title: "Scale RAG to 1B Documents",
        description: "Design a retrieval system that handles 1 billion vectors with <50ms latency. Choose the right index type, sharding strategy, and re-ranking pipeline.",
        difficulty: "Hard",
        tags: ["Vector DB", "Distributed Systems", "Latency"],
        icon: Database,
    },
    {
        title: "Multi-Modal Inference at Edge",
        description: "Architect an inference pipeline for a vision-language model running on mobile devices with limited compute and thermal constraints.",
        difficulty: "Medium",
        tags: ["Edge AI", "Model Quantization", "Mobile"],
        icon: Cpu,
    },
    {
        title: "Real-Time Fraud Detection",
        description: "Build a streaming pipeline that processes credit card transactions and scores them with an ML model in under 200ms.",
        difficulty: "Hard",
        tags: ["Streaming", "Kafka", "Low Latency"],
        icon: Zap,
    },
    {
        title: "LLM Training Infrastructure",
        description: "Design the cluster configuration, checkpointing strategy, and networking for training a 70B parameter model on 1000 GPUs.",
        difficulty: "Expert",
        tags: ["HPC", "GPU Clusters", "Checkpointing"],
        icon: Server,
    }
];

export default function SystemDesignPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 font-mono">
            {/* Background Grid */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="container mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <div className="mb-16">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/80 border border-gray-800 hover:border-cyan-500/50 text-gray-400 hover:text-cyan-400 transition-all mb-8 group"
                    >
                        <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm">Return to Hub</span>
                    </Link>

                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                            SYSTEM DESIGN
                        </span>
                        <br />
                        ARCHITECTURE LAB
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl leading-relaxed border-l-4 border-cyan-500 pl-6">
                        Architect scalable AI infrastructure. From distributed training clusters to low-latency inference pipelines.
                    </p>
                </div>

                {/* Interactive diagram placeholder / Aesthetic element */}
                <div className="w-full h-64 mb-16 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm relative overflow-hidden flex items-center justify-center p-8 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 to-blue-900/10" />

                    {/* Simplified Node Graph Visualization */}
                    <div className="flex items-center gap-8 md:gap-16 opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center relative">
                                <Globe className="w-8 h-8 text-cyan-400" />
                                <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            </div>
                            <span className="text-xs text-gray-500">Client</span>
                        </div>

                        {/* Connection Line */}
                        <div className="h-0.5 w-16 md:w-32 bg-gray-700 relative overflow-hidden">
                            <div className="absolute inset-0 bg-cyan-500/50 w-full h-full -translate-x-full animate-[shimmer_2s_infinite]" />
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                                <Shield className="w-8 h-8 text-purple-400" />
                            </div>
                            <span className="text-xs text-gray-500">Load Balancer</span>
                        </div>

                        {/* Connection Line */}
                        <div className="h-0.5 w-16 md:w-32 bg-gray-700 relative overflow-hidden">
                            <div className="absolute inset-0 bg-purple-500/50 w-full h-full -translate-x-full animate-[shimmer_2s_infinite_0.5s]" />
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className="w-16 h-16 rounded-xl bg-blue-900/20 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                <Database className="w-8 h-8 text-blue-400" />
                            </div>
                            <span className="text-xs text-blue-400 font-bold">Vector DB</span>
                        </div>
                    </div>
                </div>

                {/* Challenges Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {challenges.map((challenge, i) => (
                        <div key={i} className="group relative p-8 rounded-2xl bg-gray-900/30 border border-gray-800 hover:border-cyan-500/30 transition-all hover:bg-gray-900/50 cursor-pointer overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <challenge.icon className="w-24 h-24 rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1 text-xs font-bold rounded uppercase tracking-wider ${challenge.difficulty === 'Expert' ? 'bg-red-900/30 text-red-400 border border-red-900/50' :
                                        challenge.difficulty === 'Hard' ? 'bg-orange-900/30 text-orange-400 border border-orange-900/50' :
                                            'bg-blue-900/30 text-blue-400 border border-blue-900/50'
                                        }`}>
                                        {challenge.difficulty}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">
                                    {challenge.title}
                                </h3>
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    {challenge.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {challenge.tags.map(tag => (
                                        <span key={tag} className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-500">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <Link href="/arena?mode=system-design" className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all">
                                    Start Design Session <ArrowLeft className="w-4 h-4 rotate-180" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
