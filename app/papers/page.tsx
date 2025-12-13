"use client";

import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Users, FileText, MessageSquare, PenTool } from "lucide-react";
import Link from "next/link";
import { incrementQuestionUsage } from "@/app/actions/questions";
import { PaymentModal } from "@/components/PaymentModal";
import { useSession, signIn } from "next-auth/react";

interface Paper {
    id: string;
    title: string;
    authors: string;
    year: number;
    contributors: number;
    summary: string;
    content: string;
}


// Mock Data
const TRENDING_PAPERS = [
    {
        id: "attention-is-all-you-need",
        title: "Attention Is All You Need",
        authors: "Vaswani et al.",
        year: 2017,
        contributors: 1243,
        summary: "The landmark paper introducing the Transformer architecture, replacing RNNs with self-attention mechanisms.",
        content: `
            # Attention Is All You Need
            
            **Core Innovation**: The Transformer model, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.
            
            **Key Components**:
            - **Multi-Head Attention**: Allows the model to jointly attend to information from different representation subspaces at different positions.
            - **Positional Encoding**: Injects information about the relative or absolute position of the tokens in the sequence.
            - **Feed-Forward Networks**: Applied to each position separately and identically.
            
            **Impact**: Foundation for BERT, GPT, and modern NLP.
        `
    },
    {
        id: "diffusion-models",
        title: "Denoising Diffusion Probabilistic Models",
        authors: "Ho et al.",
        year: 2020,
        contributors: 856,
        summary: "High-quality image synthesis using diffusion probabilistic models.",
        content: `
            # Denoising Diffusion Probabilistic Models (DDPM)
            
            **Core Innovation**: A parameterized Markov chain trained using variational inference to produce samples matching the data after finite time.
            
            **Process**:
            1. **Forward Process**: Gradually adds Gaussian noise to the data (fixed schedule).
            2. **Reverse Process**: Learns to reverse this noise addition (denoising).
            
            **Impact**: State-of-the-art in image generation (Stable Diffusion, DALL-E 2).
        `
    },
    {
        id: "lora",
        title: "LoRA: Low-Rank Adaptation of Large Language Models",
        authors: "Hu et al.",
        year: 2021,
        contributors: 2400,
        summary: "Efficient fine-tuning of LLMs by injecting trainable rank decomposition matrices.",
        content: `
            # LoRA: Low-Rank Adaptation
            
            **Core Innovation**: Freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture.
            
            **Benefit**:
            - Drastically reduces the number of trainable parameters.
            - Maintains model quality comparable to full fine-tuning.
            - No additional inference latency.
        `
    }
];

export default function PapersPage() {
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [usageStats, setUsageStats] = useState({ used: 0, subscribed: false });

    const { status } = useSession();

    const handleSelectPaper = async (paper: Paper) => {
        if (status === "unauthenticated") {
            signIn(undefined, { callbackUrl: "/papers" });
            return;
        }

        // Check Limit
        const result = await incrementQuestionUsage();
        if (!result.success) {
            if (result.requiresPayment) {
                setShowPaymentModal(true);
                setUsageStats({ used: 5, subscribed: false });
            }
            return;
        }

        setSelectedPaper(paper);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-gray-800">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Hub</span>
                        </Link>
                        {selectedPaper && (
                            <span className="text-gray-600">/ {selectedPaper.title}</span>
                        )}
                    </div>
                </div>
            </header>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                questionsUsed={usageStats.used}
            />

            <main className="pt-24 pb-24 px-6 container mx-auto">
                {!selectedPaper ? (
                    /* LIST VIEW */
                    <div className="max-w-6xl mx-auto animate-fade-in">
                        <div className="text-center mb-16">
                            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-br from-blue-400 to-white bg-clip-text text-transparent">
                                Research Implementation Hub
                            </h1>
                            <p className="text-xl text-gray-400 mb-4">
                                Contribute to trending research. Read, implement, and discuss.
                            </p>
                            <p className="text-sm text-gray-500">
                                *Requires login to implement papers
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {TRENDING_PAPERS.map((paper) => (
                                <div
                                    key={paper.id}
                                    onClick={() => handleSelectPaper(paper)}
                                    className="group p-8 rounded-2xl bg-gray-900/40 border border-gray-800 hover:border-blue-500/50 hover:bg-gray-900/60 transition-all cursor-pointer flex flex-col md:flex-row gap-6 items-start md:items-center"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2 text-sm text-blue-400 font-mono">
                                            <span>{paper.year}</span>
                                            <span>•</span>
                                            <span>{paper.authors}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                                            {paper.title}
                                        </h3>
                                        <p className="text-gray-400 mb-4 md:mb-0">
                                            {paper.summary}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 text-gray-500">
                                        <div className="flex items-center gap-2" title="Contributors">
                                            <Users className="w-5 h-5" />
                                            <span className="font-mono">{paper.contributors}</span>
                                        </div>
                                        <BookOpen className="w-6 h-6 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* DETAIL VIEW */
                    <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-120px)] animate-fade-in-up">
                        {/* Left: Research Material */}
                        <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-8 overflow-y-auto">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-800">
                                <FileText className="w-6 h-6 text-blue-400" />
                                <h2 className="text-2xl font-bold">Research Material</h2>
                            </div>
                            <div className="prose prose-invert max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed">
                                    {selectedPaper.content}
                                </pre>
                            </div>
                        </div>

                        {/* Right: Discussion & Writing */}
                        <div className="flex flex-col gap-6">
                            {/* Write / Implement Area */}
                            <div className="flex-1 bg-gray-900/30 border border-gray-800 rounded-2xl p-6 flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <PenTool className="w-5 h-5 text-green-400" />
                                        <h3 className="font-bold">Implementation Notes</h3>
                                    </div>
                                    <button className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full hover:bg-green-500/20">
                                        Save Draft
                                    </button>
                                </div>
                                <textarea
                                    className="flex-1 bg-black/50 border border-gray-700 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-green-500 font-mono text-sm resize-none"
                                    placeholder="// Start drafting your implementation logic or notes here..."
                                />
                            </div>

                            {/* Discussion Area */}
                            <div className="h-1/3 bg-gray-900/30 border border-gray-800 rounded-2xl p-6 flex flex-col">
                                <div className="flex items-center gap-2 mb-4">
                                    <MessageSquare className="w-5 h-5 text-purple-400" />
                                    <h3 className="font-bold">Community Discussion</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                                    {/* Mock Comments */}
                                    <div className="text-sm">
                                        <span className="text-blue-400 font-bold">alex_ml:</span> <span className="text-gray-400">Has anyone tried replacing the layernorm with RMSNorm in section 3?</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-purple-400 font-bold">sarah_k:</span> <span className="text-gray-400">Yes, convergence is faster but check the epsilon value.</span>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    className="bg-black/50 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500"
                                    placeholder="Join the discussion..."
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
