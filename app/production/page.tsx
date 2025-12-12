"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Code2, Terminal, AlertTriangle, Play } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ProductionPage() {
    const router = useRouter();
    const { data: session, status } = useSession();

    const handleStart = () => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/production");
            return;
        }
        router.push("/arena?mode=production");
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
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
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 text-indigo-400">
                            <Code2 className="w-10 h-10" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                            Production Engineering
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Beyond algorithms: Debug production outages, optimize inference latency, and fix bad deployments in a simulated environment.
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <div className="p-8 rounded-2xl bg-gray-900/20 border border-gray-800">
                            <Terminal className="w-8 h-8 text-yellow-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Live Debugging</h3>
                            <p className="text-gray-400">Fix broken pipelines and resolve production incidents under time pressure. The logs are your only clue.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-gray-900/20 border border-gray-800">
                            <AlertTriangle className="w-8 h-8 text-red-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Incident Response</h3>
                            <p className="text-gray-400">Handle simulated outages and security breaches. Restore service health while minimizing downtime.</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <button
                            onClick={handleStart}
                            className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 mx-auto flex items-center gap-3"
                        >
                            <span>Start Production Sim</span>
                            <Play className="w-5 h-5 fill-current" />
                            <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
