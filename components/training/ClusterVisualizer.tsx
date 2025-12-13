"use client";

import React from 'react';
import { Server } from 'lucide-react';

interface ClusterVisualizerProps {
    gpuCount: number;
    utilization: number[]; // Array of utilization percentages (0-100)
    memoryUsage: number[]; // Array of memory usage in GB
    totalMemory: number;   // Total memory per GPU in GB (e.g. 80)
    error?: string | null;
}

export default function ClusterVisualizer({ gpuCount, utilization, memoryUsage, totalMemory, error }: ClusterVisualizerProps) {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-green-400" />
                    <h2 className="text-xl font-bold">Cluster Status</h2>
                </div>
                <div className="text-sm text-gray-400">
                    {gpuCount} x NVIDIA A100 ({totalMemory}GB)
                </div>
            </div>

            {error ? (
                <div className="h-64 flex items-center justify-center bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="text-center text-red-400">
                        <div className="text-3xl font-bold mb-2">CRITICAL FAILURE</div>
                        <div>{error}</div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {Array.from({ length: gpuCount }).map((_, idx) => {
                        const util = utilization[idx] || 0;
                        const mem = memoryUsage[idx] || 0;
                        const memPercent = (mem / totalMemory) * 100;

                        return (
                            <div key={idx} className="bg-gray-800 border border-gray-700 rounded-lg p-3 relative overflow-hidden group">
                                <div className="absolute top-1 right-2 text-[10px] text-gray-500 font-mono">GPU-{idx}</div>

                                <div className="mt-4 space-y-3">
                                    {/* Compute Util */}
                                    <div>
                                        <div className="flex justify-between text-[10px] mb-1">
                                            <span className="text-gray-400">Compute</span>
                                            <span className={`${util > 90 ? 'text-red-400' : 'text-green-400'}`}>{util.toFixed(0)}%</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${util > 90 ? 'bg-red-500' : 'bg-green-500'}`}
                                                style={{ width: `${util}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Memory Util */}
                                    <div>
                                        <div className="flex justify-between text-[10px] mb-1">
                                            <span className="text-gray-400">VRAM</span>
                                            <span className={`${memPercent > 95 ? 'text-red-400' : 'text-blue-400'}`}>
                                                {mem.toFixed(1)}GB
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${memPercent > 95 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                style={{ width: `${memPercent}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Active State Glow */}
                                {util > 0 && (
                                    <div className="absolute inset-0 bg-green-500/5 pointer-events-none animate-pulse" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
