"use client";

import React from "react";
import { Code2, Home, Star } from "lucide-react";
import Link from "next/link";

const papers = [
    {
        title: "Attention Is All You Need",
        authors: "Vaswani et al., 2017",
        desc: "The foundational paper for the Transformer architecture. Implement the Multi-Head Attention mechanism and Positional Encoding from scratch.",
        difficulty: "Basic",
        stars: 5,
        year: 2017
    },
    {
        title: "Denoising Diffusion Probabilistic Models",
        authors: "Ho et al., 2020",
        desc: "The generative backbone of modern image generation. Implement the forward and reverse diffusion processes.",
        difficulty: "Advanced",
        stars: 4,
        year: 2020
    },
    {
        title: "LoRA: Low-Rank Adaptation of Large Language Models",
        authors: "Hu et al., 2021",
        desc: "Efficiently fine-tune massive models. Implement the low-rank matrix decomposition injection into linear layers.",
        difficulty: "Intermediate",
        stars: 5,
        year: 2021
    },
    {
        title: "FlashAttention: Fast and Memory-Efficient Exact Attention",
        authors: "Dao et al., 2022",
        desc: "Optimize attention with IO-awareness. Implement tiling to reduce memory access overhead.",
        difficulty: "Expert",
        stars: 5,
        year: 2022
    }
];

export default function PapersPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 font-sans">
            {/* Background Grid */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Simple Top Bar */}
            <div className="container mx-auto px-6 py-6 border-b border-gray-800">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <Home className="w-4 h-4" />
                    <span className="text-sm">Return to Hub</span>
                </Link>
            </div>

            <div className="container mx-auto px-6 py-16 relative z-10">

                <div className="max-w-4xl mx-auto text-center mb-20">
                    <div className="inline-block px-3 py-1 mb-6 border border-cyan-500/30 bg-cyan-500/10 rounded-full text-xs font-bold uppercase tracking-widest text-cyan-400">
                        Paper Implementation Lab
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
                        Don&apos;t just read research. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Build it from scratch.</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Deep dive into seminal AI research papers. We provide the abstract and the blank IDE. You implement the core algorithms.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {papers.map((paper, i) => (
                        <div key={i} className="group bg-gray-900/40 border border-gray-800 hover:border-cyan-500/50 p-8 rounded-2xl transition-all duration-300 relative overflow-hidden hover:bg-gray-900/60 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)]">
                            <div className="absolute top-0 right-0 bg-gray-800 px-4 py-2 border-b border-l border-gray-700 rounded-bl-xl text-xs font-mono font-bold text-gray-400 group-hover:text-cyan-400 transition-colors">
                                {paper.year}
                            </div>

                            <div className="mb-4">
                                <div className="flex gap-1 mb-3">
                                    {[...Array(paper.stars)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-cyan-600 fill-cyan-900 group-hover:text-cyan-400 group-hover:fill-cyan-500/20 transition-all" />
                                    ))}
                                </div>
                                <h2 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors leading-tight">
                                    {paper.title}
                                </h2>
                                <p className="text-sm text-gray-500 italic font-mono">
                                    {paper.authors}
                                </p>
                            </div>

                            <p className="text-gray-400 leading-relaxed mb-8 text-sm">
                                {paper.desc}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${paper.difficulty === 'Basic' ? 'bg-green-900/20 text-green-400 border-green-800' :
                                    paper.difficulty === 'Intermediate' ? 'bg-blue-900/20 text-blue-400 border-blue-800' :
                                        'bg-purple-900/20 text-purple-400 border-purple-800'
                                    }`}>
                                    {paper.difficulty}
                                </span>

                                <Link href="/arena?mode=papers" className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all hover:text-cyan-400">
                                    <Code2 className="w-4 h-4" />
                                    Implement Paper &rarr;
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
