"use client";

import React from 'react';
import { Settings, Cpu, HardDrive } from 'lucide-react';

export interface TrainingConfigState {
    modelId: string;
    gpuCount: number;
    batchSize: number;
    precision: string;
    strategy: string;
}

interface TrainingConfigProps {
    config: TrainingConfigState;
    setConfig: (config: TrainingConfigState) => void;
    isTraining: boolean;
    onStart: () => void;
}

export const models = [
    { id: 'llama-3-8b', name: 'Llama 3 8B', params: 8, layers: 32, hidden: 4096 },
    { id: 'bert-large', name: 'BERT Large', params: 0.34, layers: 24, hidden: 1024 },
    { id: 'gpt-2-xl', name: 'GPT-2 XL', params: 1.5, layers: 48, hidden: 1600 },
    { id: 'custom-moe', name: 'Mixture of Experts (Sim)', params: 45, layers: 32, hidden: 4096 },
];

export const strategies = [
    { id: 'ddp', name: 'DDP (Data Parallel)', desc: 'Replicates model on every GPU' },
    { id: 'fsdp_full', name: 'FSDP (Fully Sharded)', desc: 'Shards parameters, gradients, and optimizer' },
    { id: 'pipeline', name: 'Pipeline Parallel', desc: 'Splits layers across GPUs' },
];

export default function TrainingConfig({ config, setConfig, isTraining, onStart }: TrainingConfigProps) {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-8">
            <div className="flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold">Configuration</h2>
            </div>

            {/* Model Selection */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400">Target Model</label>
                <select
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-blue-500 focus:border-blue-500"
                    value={config.modelId}
                    onChange={(e) => setConfig({ ...config, modelId: e.target.value })}
                    disabled={isTraining}
                >
                    {models.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.params}B params)</option>
                    ))}
                </select>
            </div>

            {/* Hardware Config */}
            <div className="space-y-4">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> Compute Resources
                </label>

                <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>GPUs (A100 80GB)</span>
                        <span className="text-white">{config.gpuCount}</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="64"
                        step="1"
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        value={config.gpuCount}
                        onChange={(e) => setConfig({ ...config, gpuCount: parseInt(e.target.value) })}
                        disabled={isTraining}
                    />
                </div>
            </div>

            {/* Training Params */}
            <div className="space-y-4">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <HardDrive className="w-4 h-4" /> Training Parameters
                </label>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-xs text-gray-500 block mb-1">Batch Size</span>
                        <input
                            type="number"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                            value={config.batchSize}
                            onChange={(e) => setConfig({ ...config, batchSize: parseInt(e.target.value) })}
                            disabled={isTraining}
                        />
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 block mb-1">Precision</span>
                        <select
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white"
                            value={config.precision}
                            onChange={(e) => setConfig({ ...config, precision: e.target.value })}
                            disabled={isTraining}
                        >
                            <option value="fp32">FP32 (4 bytes)</option>
                            <option value="fp16">FP16 (2 bytes)</option>
                            <option value="bf16">BF16 (2 bytes)</option>
                            <option value="int8">INT8 (1 byte)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Strategy */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400">Distribution Strategy</label>
                <div className="space-y-2">
                    {strategies.map(s => (
                        <div
                            key={s.id}
                            onClick={() => !isTraining && setConfig({ ...config, strategy: s.id })}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${config.strategy === s.id
                                ? 'bg-blue-500/20 border-blue-500'
                                : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                                } ${isTraining ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="text-sm font-bold text-white">{s.name}</div>
                            <div className="text-xs text-gray-400">{s.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={onStart}
                disabled={isTraining}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/20"
            >
                {isTraining ? 'Training in Progress...' : 'Start Fine-Tuning Job'}
            </button>
        </div>
    );
}
