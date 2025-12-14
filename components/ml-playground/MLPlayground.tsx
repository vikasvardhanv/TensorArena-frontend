"use client";

import React, { useState } from "react";
import {
    Play, Settings, Upload, Database,
    BarChart, LogOut,
    Loader2
} from "lucide-react";
import Link from 'next/link';

import { DataCanvas } from "./DataCanvas";

import { api, CSVMetadata, MLTrainingResult } from "@/lib/api";
import { incrementQuestionUsage } from "@/app/actions/questions";
import { PaymentModal } from "@/components/PaymentModal";

export default function MLPlayground() {

    // Interactive State


    // Hyperparameters


    // CSV State
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [fileId, setFileId] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<CSVMetadata | null>(null);
    const [targetCol, setTargetCol] = useState<string>("");
    const [csvModel, setCsvModel] = useState<string>("random_forest");
    const [csvTraining, setCsvTraining] = useState(false);
    const [csvResults, setCsvResults] = useState<MLTrainingResult | null>(null);

    const [showPaymentModal, setShowPaymentModal] = useState(false);





    // --- CSV Functions ---
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCsvFile(file);
            setUploading(true);
            try {
                const res = await api.uploadCSV(file);
                setFileId(res.file_id);
                setMetadata(res.metadata);
                // Default target to last column usually
                if (res.metadata.columns.length > 0) {
                    setTargetCol(res.metadata.columns[res.metadata.columns.length - 1]);
                }
            } catch (err) {
                console.error(err);
                alert("Upload failed");
            } finally {
                setUploading(false);
            }
        }
    };

    const handleTrainCSV = async () => {
        if (!fileId || !targetCol) return;
        setCsvTraining(true);
        setCsvResults(null);


        try {
            // Check usage limit
            const limitResult = await incrementQuestionUsage();
            if (!limitResult.success) {
                if (limitResult.requiresPayment) {
                    setShowPaymentModal(true);
                }
                setCsvTraining(false);
                return;
            }

            const res = await api.trainMLModel(fileId, targetCol, csvModel);
            setCsvResults(res);


        } catch (err) {
            console.error(err);
            alert("Training failed");
        } finally {
            setCsvTraining(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)]">


            {/* Layout Container */}
            <div className="flex flex-1 gap-6 px-6 pb-6 min-h-0">
                {/* Left Sidebar: Controls */}


                {/* Main Content Area */}
                <div className="flex flex-col h-full bg-black text-white p-6 gap-6 relative flex-1 border border-gray-800 rounded-2xl bg-gray-900/20">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                ML Model Arena
                            </h1>
                            <p className="text-gray-400 text-sm">
                                Advanced Interactive Machine Learning Playground
                            </p>
                        </div>
                        <Link href="/" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <LogOut className="w-5 h-5 text-gray-400" />
                        </Link>
                    </div>

                    {/* Main Content - No Tabs, just CSV Mode */}
                    <div className="flex-1 flex gap-6 overflow-hidden">
                        {/* Left Control Panel */}
                        <div className="w-80 flex flex-col gap-6 shrink-0 overflow-y-auto pr-2">

                            {/* 1. Data Selection */}
                            <div className="space-y-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-2 text-blue-400 mb-2">
                                    <Database className="w-5 h-5" />
                                    <h3 className="font-bold">1. Select Data</h3>
                                </div>

                                <div className="relative group">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        id="csv-upload" // Added id for label association
                                    />
                                    <label htmlFor="csv-upload" className="flex items-center gap-3 p-3 bg-black border border-gray-700 rounded-lg group-hover:border-blue-500 transition-colors cursor-pointer">
                                        <Upload className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm text-gray-300 truncate">
                                            {csvFile ? csvFile.name : "Upload CSV File..."}
                                        </span>
                                    </label>
                                </div>

                                {uploading && (
                                    <div className="flex items-center gap-2 text-xs text-blue-400">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Uploading & analyzing...
                                    </div>
                                )}

                                {metadata && (
                                    <div className="text-xs text-gray-500 space-y-1 bg-black/40 p-2 rounded">
                                        <p>Rows: {metadata.shape[0]}</p>
                                        <p>Columns: {metadata.shape[1]}</p>
                                        <p className="truncate" title={metadata.columns.join(', ')}>
                                            Cols: {metadata.columns.slice(0, 3).join(', ')}...
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* 2. Model Config */}
                            <div className="space-y-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-2 text-purple-400 mb-2">
                                    <Settings className="w-5 h-5" />
                                    <h3 className="font-bold">2. Configure Model</h3>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-400">Target Column (y)</label>
                                        <select
                                            value={targetCol}
                                            onChange={(e) => setTargetCol(e.target.value)}
                                            disabled={!metadata}
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                        >
                                            {!targetCol && <option value="" disabled>Select target...</option>}
                                            {metadata?.columns.map(col => (
                                                <option key={col} value={col}>{col}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-400">Algorithm</label>
                                        <select
                                            value={csvModel}
                                            onChange={(e) => setCsvModel(e.target.value)}
                                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <optgroup label="Classification (Categorical)">
                                                <option value="logistic_regression">Logistic Regression</option>
                                                <option value="random_forest">Random Forest Classifier</option>
                                                <option value="svm">Support Vector Machine (SVM)</option>
                                                <option value="gradient_boosting">Gradient Boosting (XGB-like)</option>
                                                <option value="knn">K-Nearest Neighbors</option>
                                                <option value="decision_tree">Decision Tree</option>
                                                <option value="naive_bayes">Naive Bayes</option>
                                                <option value="adaboost">AdaBoost Classifier</option>
                                            </optgroup>
                                            <optgroup label="Regression (Continuous)">
                                                <option value="linear_regression">Linear Regression</option>
                                                <option value="ridge">Ridge Regression</option>
                                                <option value="lasso">Lasso Regression</option>
                                                <option value="random_forest_regressor">Random Forest Regressor</option>
                                                <option value="gradient_boosting_regressor">Gradient Boosting Regressor</option>
                                                <option value="svr">Support Vector Regressor (SVR)</option>
                                            </optgroup>
                                            <optgroup label="Deep Learning">
                                                <option value="mlp_classifier">Neural Network (MLP Classifier)</option>
                                                <option value="mlp_regressor">Neural Network (MLP Regressor)</option>
                                            </optgroup>
                                            <optgroup label="Unsupervised">
                                                <option value="kmeans">K-Means Clustering</option>
                                            </optgroup>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleTrainCSV}
                                disabled={!fileId || !targetCol || csvTraining}
                                className="w-full py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {csvTraining ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Training Model...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5 mr-2" />
                                        Train & Analyze
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Results Panel */}
                        <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
                            {csvResults ? (
                                <div className="flex-1 bg-gray-900/50 rounded-2xl border border-gray-800 p-8 overflow-y-auto animate-fade-in">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl font-bold text-white">Training Results</h2>
                                        {csvResults.metrics?.accuracy && (
                                            <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 font-mono font-bold text-xl">
                                                Accuracy: {(csvResults.metrics.accuracy * 100).toFixed(2)}%
                                            </div>
                                        )}
                                    </div>

                                    {csvResults.error ? (
                                        <div className="p-4 bg-red-900/20 border border-red-800 text-red-300 rounded-lg">
                                            Error: {csvResults.error}
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {/* 1. Interactive Visualization */}
                                            {csvResults.visualization && csvResults.visualization.data.length > 0 && (
                                                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 relative">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                                                            <BarChart className="w-5 h-5" />
                                                            Feature Space Visualization
                                                        </h3>
                                                        <div className="text-xs text-gray-500">
                                                            Plotting {csvResults.visualization.features[0]} (x) vs {csvResults.visualization.features[1]} (y)
                                                        </div>
                                                    </div>
                                                    <div className="h-64 w-full bg-black/40 rounded-lg overflow-hidden relative border border-gray-700">
                                                        {/* We need to normalize the CSV data to 0-100 for the DataCanvas */}
                                                        <DataCanvas
                                                            mode="view"
                                                            setPoints={() => { }}
                                                            points={(() => {
                                                                const data = csvResults.visualization.data;
                                                                // Find min/max for normalization
                                                                let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                                                                data.forEach(d => {
                                                                    if (d.x < minX) minX = d.x;
                                                                    if (d.x > maxX) maxX = d.x;
                                                                    if (d.y < minY) minY = d.y;
                                                                    if (d.y > maxY) maxY = d.y;
                                                                });

                                                                // Add 5% padding
                                                                const padX = (maxX - minX) * 0.05 || 1;
                                                                const padY = (maxY - minY) * 0.05 || 1;

                                                                return data.map(d => ({
                                                                    x: ((d.x - (minX - padX)) / ((maxX + padX) - (minX - padX))) * 100,
                                                                    y: 100 - ((d.y - (minY - padY)) / ((maxY + padY) - (minY - padY))) * 100, // Flip Y for canvas coords
                                                                    label: typeof d.label === 'string' ? (d.label === '1' || d.label === 'Yes' ? 1 : 0) : d.label as number
                                                                }));
                                                            })()}
                                                        />
                                                    </div>
                                                    <div className="mt-4 bg-gray-800/50 rounded-lg p-3 text-sm text-gray-400">
                                                        <details className="cursor-pointer group">
                                                            <summary className="font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                                                                <div className="w-4 h-4 rounded-full border border-gray-500 flex items-center justify-center text-[10px]">?</div>
                                                                How to read this plot?
                                                            </summary>
                                                            <div className="mt-2 pl-6 space-y-2 text-xs leading-relaxed">
                                                                <p>
                                                                    <strong className="text-gray-300">Axes:</strong> The X and Y axes represent the two most important features (variables) that the model found in your data.
                                                                </p>
                                                                <p>
                                                                    <strong className="text-gray-300">Colors:</strong> Points are colored by their <em>true</em> class (e.g., Red vs Blue).
                                                                </p>
                                                                <p>
                                                                    <strong className="text-gray-300">Goal:</strong> You want to see distinct clusters of colors. If the red and blue points are well-separated, the model can easily distinguish them using these two features. If they are mixed together (&quot;soup&quot;), these features alone are not enough, or the problem is difficult (non-linear).
                                                                </p>
                                                            </div>
                                                        </details>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Feature Importance */}
                                            {csvResults.feature_importance && (
                                                <div className="bg-gray-800/20 border border-gray-700/50 rounded-xl p-6">
                                                    <h3 className="text-lg font-bold text-gray-300 mb-3">Feature Importance</h3>
                                                    <div className="space-y-2">
                                                        {Object.entries(csvResults.feature_importance).map(([k, v]) => (
                                                            <div key={k} className="bg-black/40 rounded p-3 flex justify-between items-center group hover:bg-black/60 transition-colors">
                                                                <span className="text-sm font-mono text-gray-400 group-hover:text-white truncate max-w-[150px]" title={k}>{k}</span>
                                                                <div className="flex items-center gap-2 flex-1 justify-end ml-2">
                                                                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden max-w-[100px]">
                                                                        <div className="h-full bg-blue-500" style={{ width: `${Math.min(Math.abs(v as number) * 100, 100)}%` }}></div>
                                                                    </div>
                                                                    <span className="text-xs text-blue-400 w-12 text-right">{(v as number).toFixed(3)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Model Education Card */}
                                            <div className="bg-gray-800/20 border border-gray-700/50 rounded-xl p-6">
                                                <h3 className="text-lg font-bold text-gray-300 mb-3">Model Architecture: {csvModel.replace('_', ' ')}</h3>
                                                <p className="text-sm text-gray-400 leading-relaxed">
                                                    {csvModel === 'logistic_regression' && "Logistic Regression is a fundamental classification algorithm that models the probability of a specific class or event existing. Ideally used for binary classification tasks."}
                                                    {csvModel === 'random_forest' && "Random Forest is an ensemble method that operates by constructing a multitude of decision trees at training time. It is robust to overfitting and works well with non-linear comparisons."}
                                                    {csvModel === 'svm' && "Support Vector Machines (SVM) find a hyperplane in an N-dimensional space that distinctly classifies the data points. Effective in high dimensional spaces."}
                                                    {csvModel === 'gradient_boosting' && "Gradient Boosting produces a prediction model in the form of an ensemble of weak prediction models, typically decision trees. It builds keys sequentially to minimize errors."}
                                                    {csvModel === 'decision_tree' && "A Decision Tree determines the output by tracing the path from the root node to a leaf node using if-this-then-that logic learned from data features."}
                                                    {csvModel === 'naive_bayes' && "Naive Bayes classifiers are a family of simple probabilistic classifiers based on applying Bayes&apos; theorem with strong independence assumptions between the features."}
                                                    {csvModel === 'kmeans' && "K-Means is an unsupervised learning algorithm that partitions data into K distinct clusters based on feature similarity."}
                                                </p>
                                            </div>
                                        </div>



                                    )}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 space-y-4 border-2 border-dashed border-gray-800 rounded-2xl">
                                    <Database className="w-16 h-16 text-gray-700" />
                                    <p>Upload data and train a model to see results here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} questionsUsed={5} />
            </div>
        </div>
    );
}
