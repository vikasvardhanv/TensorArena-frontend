"use client";

import React from 'react';
import { Activity } from 'lucide-react';

interface TrainingMetricsProps {
    lossHistory: number[];
    throughput: number; // Tokens/sec
    step: number;
    maxSteps: number;
}

export default function TrainingMetrics({ lossHistory, throughput, step, maxSteps }: TrainingMetricsProps) {
    // Simple SVG path generation for loss curve
    const width = 100;
    const height = 50;

    // Normalize loss to fit in SVG
    // Normalize loss to fit in SVG
    Math.max(...lossHistory, 0.1); // Avoid div by 0
    const points = lossHistory.map((loss, idx) => {
        const x = (idx / (maxSteps || 1)) * width;
        const y = height - ((loss / 3.0) * height); // Assumes max initial loss usually around 2.5-3
        return `${x},${Math.max(0, Math.min(height, y))}`;
    }).join(' ');

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-bold">Metrics</h2>
                </div>
                <div className="text-sm font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
                    Step {step} / {maxSteps}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Loss Chart */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider">Training Loss</div>
                    <div className="h-32 flex items-end relative border-l border-b border-gray-700">
                        {lossHistory.length > 1 && (
                            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 ${width} ${height}`}>
                                <polyline
                                    fill="none"
                                    stroke="#A855F7"
                                    strokeWidth="2"
                                    points={points}
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>
                        )}
                        {/* Current Value Tooltip-ish */}
                        <div className="absolute top-2 right-2 text-2xl font-bold text-white">
                            {lossHistory.length > 0 ? lossHistory[lossHistory.length - 1].toFixed(4) : '---'}
                        </div>
                    </div>
                </div>

                {/* Throughput */}
                <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col justify-between">
                    <div className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider">Throughput</div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-white">{throughput.toLocaleString()}</span>
                        <span className="text-gray-500">tokens/sec</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
                        <div
                            className="bg-blue-500 h-full transition-all duration-300"
                            style={{ width: `${(step / maxSteps) * 100}%` }}
                        />
                    </div>
                    <div className="text-right text-xs text-gray-500 mt-1">
                        {((step / maxSteps) * 100).toFixed(1)}% Complete
                    </div>
                </div>
            </div>
        </div>
    );
}
