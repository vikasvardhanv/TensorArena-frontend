"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TrainingConfig, { models } from '@/components/training/TrainingConfig';
import ClusterVisualizer from '@/components/training/ClusterVisualizer';
import TrainingMetrics from '@/components/training/TrainingMetrics';
import { incrementQuestionUsage } from "@/app/actions/questions";
import { PaymentModal } from "@/components/PaymentModal";

export default function TrainingSimulatorPage() {
    // ---- State ----
    const [config, setConfig] = useState({
        modelId: 'llama-3-8b',
        gpuCount: 8,
        batchSize: 32,
        precision: 'fp16',
        strategy: 'ddp',
    });

    const [isTraining, setIsTraining] = useState(false);
    const [step, setStep] = useState(0);
    const [loss, setLoss] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        utilization: [] as number[],
        memoryUsage: [] as number[],
        throughput: 0,
    });

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // ---- Constants ----
    const TOTAL_MEMORY_GB = 80; // A100

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [usageStats, setUsageStats] = useState({ used: 0, subscribed: false });

    // ---- Simulation Logic ----
    useEffect(() => {
        // Recalculate static stats when config changes
        calculateStaticStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config, isTraining]);

    const calculateStaticStats = () => {
        const model = models.find(m => m.id === config.modelId);
        if (!model) return;

        // VRAM Calc Logic
        let bytesPerPhone = 2; // fp16
        if (config.precision === 'fp32') bytesPerPhone = 4;
        if (config.precision === 'int8') bytesPerPhone = 1;

        const modelSizeGB = (model.params * bytesPerPhone);

        // Distribution Logic
        let memoryPerGPU = 0;
        if (config.strategy === 'ddp') {
            // DDP: Full model on each GPU
            memoryPerGPU = modelSizeGB;
        } else if (config.strategy === 'fsdp_full') {
            // FSDP: Sharded model
            memoryPerGPU = modelSizeGB / config.gpuCount;
        } else {
            memoryPerGPU = modelSizeGB / config.gpuCount; // pipeline simplified
        }

        // Activations overhead
        const actOverhead = (config.batchSize * model.hidden * model.layers * bytesPerPhone) / (1024 * 1024 * 1024 * 0.1);
        // Rough heuristic: Act ~ Batch * Hidden * Layers

        const totalVRAM = memoryPerGPU + (actOverhead / config.gpuCount); // Distributed activations too usually

        // Update preview state
        setStats(prev => ({
            ...prev,
            memoryUsage: Array(config.gpuCount).fill(totalVRAM).map(v => v * (0.9 + Math.random() * 0.2)), // Adding variance
            utilization: Array(config.gpuCount).fill(0),
        }));

        if (totalVRAM > TOTAL_MEMORY_GB) {
            setError(`OOM: Needs ${totalVRAM.toFixed(1)}GB VRAM per GPU, but only ${TOTAL_MEMORY_GB}GB available.`);
        } else {
            setError(null);
        }
    };

    const startTraining = async () => {
        if (error) return;

        // Check Limit
        const result = await incrementQuestionUsage();
        if (!result.success) {
            if (result.requiresPayment) {
                setShowPaymentModal(true);
                setUsageStats({ used: 5, subscribed: false });
            }
            return;
        }

        setIsTraining(true);
        setStep(0);
        setLoss([]);

        let currentStep = 0;
        const maxSteps = 100;
        let currentLoss = 2.5;

        intervalRef.current = setInterval(() => {
            currentStep++;
            setStep(currentStep);

            // Simons Loss Curve
            currentLoss = currentLoss * 0.98 + (Math.random() * 0.05);
            setLoss(prev => [...prev, currentLoss].slice(-50)); // Keep last 50

            // Simulate GPU Fluctuation
            setStats(prev => ({
                ...prev,
                utilization: prev.utilization.map(() => 85 + Math.random() * 15), // High utilization
                throughput: (config.gpuCount * config.batchSize * 15) // simple throughput logic
            }));

            if (currentStep >= maxSteps) {
                stopTraining();
            }
        }, 500); // Fast simulation
    };

    const stopTraining = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsTraining(false);
        setStats(prev => ({ ...prev, utilization: prev.utilization.map(() => 0) }));
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-gray-800">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/system-design" className="text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            TensorHub Training Studio
                        </h1>
                    </div>
                    {isTraining && (
                        <div className="flex items-center gap-2 text-green-400 animate-pulse text-sm font-bold">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            TRAINING ACTIVE
                        </div>
                    )}
                </div>
            </header>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                questionsUsed={usageStats.used}
            />

            <main className="pt-24 px-6 pb-12 container mx-auto">
                <div className="grid lg:grid-cols-12 gap-6">
                    {/* Left Sidebar: Config */}
                    <div className="lg:col-span-3">
                        <TrainingConfig
                            config={config}
                            setConfig={setConfig}
                            isTraining={isTraining}
                            onStart={startTraining}
                        />
                    </div>

                    {/* Right Main: Visualization */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Metrics Panel */}
                        <TrainingMetrics
                            lossHistory={loss}
                            throughput={stats.throughput}
                            step={step}
                            maxSteps={100}
                        />

                        {/* Cluster Visualizer */}
                        <ClusterVisualizer
                            gpuCount={config.gpuCount}
                            utilization={stats.utilization}
                            memoryUsage={stats.memoryUsage}
                            totalMemory={TOTAL_MEMORY_GB}
                            error={error}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
