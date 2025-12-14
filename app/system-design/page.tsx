"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Brain, Database, Play, Binary } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function SystemDesignPage() {
    const router = useRouter();
    const { status } = useSession();

    const handleStart = () => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/system-design/session");
        } else {
            router.push("/system-design/session");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
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
                        <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 text-blue-400">
                            <Brain className="w-10 h-10" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-white to-blue-400 bg-clip-text text-transparent">
                            ML Model Arena
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Interactive Algorithm Playground. Visualize and master core machine learning algorithms like Logistic Regression, K-Means, and KNN on real-time data.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <Link href="/system-design/session" onClick={handleStart} className="p-8 rounded-2xl bg-gray-900/20 border border-gray-800 hover:border-blue-500/50 transition-all cursor-pointer group">
                            <Binary className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">Interactive Visualization</h3>
                            <p className="text-gray-400">Watch decision boundaries form in real-time. Generate synthetic datasets and train models directly in your browser.</p>
                        </Link>
                        <div className="p-8 rounded-2xl bg-gray-900/20 border border-gray-800">
                            <Database className="w-8 h-8 text-green-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Algorithm Deep Dive</h3>
                            <p className="text-gray-400">Experiment with hyperparameters like Learning Rate, Epochs, and K-values to understand their impact on model performance.</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <button
                            onClick={handleStart}
                            className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 mx-auto flex items-center gap-3"
                        >
                            <span>Start Experimenting</span>
                            <Play className="w-5 h-5 fill-current" />
                            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                        </button>
                        <p className="mt-4 text-sm text-gray-500">
                            *Requires login to save progress
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
