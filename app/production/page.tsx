"use client";

import React, { useState, useEffect } from "react";
import { Activity, Home } from "lucide-react";
import Link from "next/link";

const logs = [
    { time: "10:42:01", level: "INFO", msg: "Model serving initialized (v2.4.1)" },
    { time: "10:42:05", level: "WARN", msg: "GPU memory utilization > 85%" },
    { time: "10:42:12", level: "ERROR", msg: "Inference latency spike detected (p99 > 500ms)" },
    { time: "10:42:15", level: "INFO", msg: "Auto-scaling group triggered (+2 instances)" },
];

const scenarios = [
    {
        title: "Incident: Latency Spike",
        desc: "Users are reporting timeouts. Analyze the metrics, identify the bottleneck, and restore service health.",
        severity: "Critical",
        type: "Debugging"
    },
    {
        title: "Safe Deployment",
        desc: "Roll out a new 7B parameter model to production using a canary deployment strategy without downtime.",
        severity: "High",
        type: "DevOps"
    },
    {
        title: "Memory Leak",
        desc: "The inference service crashes every 4 hours. Debug the Python garbage collection and CUDA memory management.",
        severity: "Medium",
        type: "Optimization"
    }
];

export default function ProductionPage() {
    const [activeLogIndex, setActiveLogIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveLogIndex(prev => (prev + 1) % logs.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#0d1117] text-white font-mono selection:bg-green-500/30">
            {/* Simple Top Bar */}
            <div className="container mx-auto px-6 py-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <Home className="w-4 h-4" />
                    <span className="text-sm">Return to Hub</span>
                </Link>
            </div>

            <div className="container mx-auto px-6 py-12">

                {/* Dashboard Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-4 tracking-tight">Mission Control</h1>
                    <p className="text-gray-400 max-w-2xl">
                        Simulate real-world ML engineering challenges. <br />
                        Monitor benchmarks, debug outages, and manage deployments.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Col: Scenarios */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4">Active Incidents & Tasks</h2>
                        {scenarios.map((scenario, i) => (
                            <div key={i} className="group relative pl-6 p-6 rounded-lg bg-[#161b22] border border-gray-800 hover:border-green-500/50 transition-all cursor-pointer">
                                {/* Severity Indicator */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${scenario.severity === 'Critical' ? 'bg-red-500' :
                                    scenario.severity === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
                                    }`} />

                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold group-hover:text-green-400 transition-colors">
                                        {scenario.title}
                                    </h3>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded bg-gray-800 ${scenario.severity === 'Critical' ? 'text-red-400' :
                                        scenario.severity === 'High' ? 'text-orange-400' : 'text-yellow-400'
                                        }`}>
                                        {scenario.severity}
                                    </span>
                                </div>
                                <span className="text-gray-400 text-sm leading-relaxed mb-4">
                                    {scenario.desc}
                                </span>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="bg-gray-800 px-2 py-1 rounded border border-gray-700">Type: {scenario.type}</span>
                                    <Link href="/role-arena?source=production" className="group-hover:translate-x-1 transition-transform text-green-500 font-bold flex items-center gap-1">
                                        Initialize Environment &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Col: Live Metrics & Logs */}
                    <div className="space-y-6">
                        {/* Metrics */}
                        <div className="p-6 rounded-lg bg-[#161b22] border border-gray-800">
                            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-6 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Live Metrics
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Request Latency (p99)</span>
                                        <span className="text-red-400 font-bold">524ms</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 w-[85%]" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">GPU Utilization</span>
                                        <span className="text-yellow-400 font-bold">88%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500 w-[88%]" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Error Rate</span>
                                        <span className="text-green-400 font-bold">0.01%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[2%]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terminal Logs */}
                        <div className="p-4 rounded-lg bg-black border border-gray-800 font-mono text-xs h-64 overflow-hidden relative">
                            <div className="absolute top-0 left-0 right-0 p-2 bg-gray-900 border-b border-gray-800 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="ml-2 text-gray-500">server_logs.txt</span>
                            </div>
                            <div className="mt-8 space-y-2">
                                {logs.map((log, i) => (
                                    <div key={i} className={`flex gap-2 ${activeLogIndex === i ? 'opacity-100' : 'opacity-40'}`}>
                                        <span className="text-gray-600">[{log.time}]</span>
                                        <span className={`${log.level === 'ERROR' ? 'text-red-500' :
                                            log.level === 'WARN' ? 'text-yellow-500' : 'text-blue-500'
                                            }`}>{log.level}</span>
                                        <span className="text-gray-300">{log.msg}</span>
                                    </div>
                                ))}
                                <div className="animate-pulse">_</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
