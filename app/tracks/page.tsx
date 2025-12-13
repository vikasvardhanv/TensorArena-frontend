"use client";

import React from "react";
import { Briefcase, FlaskConical, LineChart, CheckCircle2, Building2, Trophy, Home, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

// Company tags for FAANG/MAANG


interface Track {
    title: string;
    icon: typeof Briefcase;
    description: string;
    color: string;
    bg: string;
    border: string;
    levels: {
        basic: {
            topics: string[];
            companies: string[];
        };
        intermediate: {
            topics: string[];
            companies: string[];
        };
        advanced: {
            topics: string[];
            companies: string[];
        };
    };
}

const tracks: Track[] = [
    {
        title: "ML Engineer Track",
        icon: Briefcase,
        description: "Production ML systems, deployment, and MLOps expertise",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20",
        levels: {
            basic: {
                topics: [
                    "Python fundamentals for ML",
                    "Basic ML algorithms (Linear/Logistic Regression)",
                    "Data preprocessing and feature engineering",
                    "Model evaluation metrics",
                    "Introduction to scikit-learn"
                ],
                companies: ["Amazon", "Microsoft"]
            },
            intermediate: {
                topics: [
                    "Deep Learning with PyTorch/TensorFlow",
                    "Model optimization and hyperparameter tuning",
                    "ML pipeline design and orchestration",
                    "A/B testing and experimentation",
                    "Docker and containerization basics"
                ],
                companies: ["Google", "Meta", "Apple"]
            },
            advanced: {
                topics: [
                    "Large-scale distributed training",
                    "Model serving and inference optimization",
                    "MLOps: CI/CD for ML pipelines",
                    "Kubernetes for ML workloads",
                    "Real-time ML systems and streaming"
                ],
                companies: ["Netflix", "OpenAI", "DeepMind", "NVIDIA"]
            }
        }
    },
    {
        title: "Data Scientist Track",
        icon: LineChart,
        description: "Statistical analysis, experimentation, and business intelligence",
        color: "text-green-400",
        bg: "bg-green-400/10",
        border: "border-green-400/20",
        levels: {
            basic: {
                topics: [
                    "Statistics fundamentals and probability",
                    "Data visualization (Matplotlib, Seaborn)",
                    "SQL and database querying",
                    "Exploratory Data Analysis (EDA)",
                    "Basic hypothesis testing"
                ],
                companies: ["Amazon", "Microsoft"]
            },
            intermediate: {
                topics: [
                    "Advanced statistical modeling",
                    "Causal inference and experimentation",
                    "Time series analysis and forecasting",
                    "Feature selection and dimensionality reduction",
                    "Business metrics and KPI design"
                ],
                companies: ["Google", "Meta", "Apple"]
            },
            advanced: {
                topics: [
                    "Bayesian statistics and probabilistic programming",
                    "Multi-armed bandits and reinforcement learning",
                    "Large-scale data processing (Spark, Dask)",
                    "Advanced A/B testing methodologies",
                    "Recommendation systems at scale"
                ],
                companies: ["Netflix", "Anthropic", "Tesla"]
            }
        }
    },
    {
        title: "Research Scientist Track",
        icon: FlaskConical,
        description: "Novel architectures, paper implementation, and cutting-edge research",
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        border: "border-purple-400/20",
        levels: {
            basic: {
                topics: [
                    "Linear algebra and calculus for ML",
                    "Neural network fundamentals",
                    "Backpropagation and optimization",
                    "Reading and understanding research papers",
                    "Implementing papers from scratch"
                ],
                companies: ["Microsoft", "Apple"]
            },
            intermediate: {
                topics: [
                    "Advanced neural architectures (Transformers, GANs)",
                    "Attention mechanisms and self-attention",
                    "Transfer learning and fine-tuning",
                    "Research methodology and experimentation",
                    "Writing technical papers and documentation"
                ],
                companies: ["Google", "Meta", "NVIDIA"]
            },
            advanced: {
                topics: [
                    "Novel architecture design and innovation",
                    "State-of-the-art NLP (LLMs, RAG, Agents)",
                    "Computer Vision (Diffusion models, ViTs)",
                    "Multi-modal learning and foundation models",
                    "Publishing in top-tier conferences (NeurIPS, ICML)"
                ],
                companies: ["OpenAI", "DeepMind", "Anthropic", "Meta AI"]
            }
        }
    }
];

const DifficultyBadge = ({ level, companyType }: { level: string; companyType: string }) => {
    const colors = {
        basic: "bg-green-500/10 text-green-400 border-green-500/20",
        intermediate: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        advanced: "bg-red-500/10 text-red-400 border-red-500/20"
    };

    const companyColors = {
        faang: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        others: "bg-purple-500/10 text-purple-400 border-purple-500/20"
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[level as keyof typeof colors]}`}>
                {level.toUpperCase()}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${companyColors[companyType as keyof typeof companyColors]}`}>
                {companyType === 'faang' ? 'FAANG/MAANG' : 'Top AI Labs'}
            </span>
        </div>
    );
};

export default function TracksPage() {
    const { status } = useSession();

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    // Auth Guard Removed to show content

    const handleStart = () => {
        if (status === "unauthenticated") {
            signIn(undefined, { callbackUrl: "/role-arena" });
        } else {
            // Navigate via Next Link or Router, but Link component is below so we might need router
            // However, the button in original code was wrapped in Link. 
            // We need to change Link to button to handle click.
            window.location.href = "/role-arena";
        }
    };

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
                        Return to Hub
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                        Learning Tracks
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl">
                        Specialized paths tailored for different AI/ML roles with company-specific preparation for FAANG/MAANG and top AI labs.
                    </p>
                </div>

                {/* Tracks */}
                <div className="space-y-16">
                    {tracks.map((track, trackIndex) => (
                        <div key={trackIndex} className="space-y-6">
                            {/* Track Header */}
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg ${track.bg} flex items-center justify-center ${track.color}`}>
                                    <track.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{track.title}</h2>
                                    <p className="text-gray-400">{track.description}</p>
                                </div>
                            </div>

                            {/* Difficulty Levels */}
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Basic */}
                                <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 transition-all">
                                    <div className="mb-4">
                                        <DifficultyBadge level="basic" companyType="faang" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-4">Basic Level</h3>
                                    <ul className="space-y-2 mb-4">
                                        {track.levels.basic.topics.map((topic, i) => (
                                            <li key={i} className="flex items-start text-gray-400 text-sm">
                                                <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-green-500 shrink-0" />
                                                {topic}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-4 border-t border-gray-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Building2 className="w-4 h-4 text-gray-500" />
                                            <span className="text-xs text-gray-500 font-medium">Target Companies:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {track.levels.basic.companies.map((company, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-800/50 rounded text-xs text-gray-300">
                                                    {company}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Intermediate */}
                                <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 transition-all">
                                    <div className="mb-4">
                                        <DifficultyBadge level="intermediate" companyType="faang" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-4">Intermediate Level</h3>
                                    <ul className="space-y-2 mb-4">
                                        {track.levels.intermediate.topics.map((topic, i) => (
                                            <li key={i} className="flex items-start text-gray-400 text-sm">
                                                <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-yellow-500 shrink-0" />
                                                {topic}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-4 border-t border-gray-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Building2 className="w-4 h-4 text-gray-500" />
                                            <span className="text-xs text-gray-500 font-medium">Target Companies:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {track.levels.intermediate.companies.map((company, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-800/50 rounded text-xs text-gray-300">
                                                    {company}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Advanced */}
                                <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 transition-all">
                                    <div className="mb-4">
                                        <DifficultyBadge level="advanced" companyType="others" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-4">Advanced Level</h3>
                                    <ul className="space-y-2 mb-4">
                                        {track.levels.advanced.topics.map((topic, i) => (
                                            <li key={i} className="flex items-start text-gray-400 text-sm">
                                                <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-red-500 shrink-0" />
                                                {topic}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-4 border-t border-gray-800">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Trophy className="w-4 h-4 text-gray-500" />
                                            <span className="text-xs text-gray-500 font-medium">Target Companies:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {track.levels.advanced.companies.map((company, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-800/50 rounded text-xs text-gray-300">
                                                    {company}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-20 text-center">
                    <h2 className="text-2xl font-bold mb-6">Ready to start your specialized track?</h2>
                    <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                        Practice with realistic production scenarios tailored to specific AI/ML roles.
                        Test your decision-making skills with multiple-choice questions, code output predictions,
                        and fill-in-the-blank challenges based on real-world incidents.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300">
                            Machine Learning Engineer
                        </span>
                        <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300">
                            Data Scientist
                        </span>
                        <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300">
                            Computer Vision Engineer
                        </span>
                        <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300">
                            NLP Engineer
                        </span>
                        <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300">
                            LLM Specialist
                        </span>
                        <span className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300">
                            AI Product Manager
                        </span>
                    </div>
                    <button
                        onClick={handleStart}
                        className="inline-flex items-center px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105"
                    >
                        <Zap className="w-5 h-5 mr-2" />
                        Start Practicing Now
                    </button>
                    <p className="mt-4 text-sm text-gray-500">
                        *Requires login to access the arena
                    </p>
                </div>
            </div>
        </div>
    );
}
