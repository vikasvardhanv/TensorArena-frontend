"use client";

import React, { useState } from "react";
import { DataCanvas } from "./DataCanvas";
import { Point, trainLogisticRegression, runKNN, runKMeans, TrainingResult, ModelType } from "./algorithms";
import { Play, RotateCcw, Trash2, Brain, Database, Upload, FileText, BarChart } from "lucide-react";
import { api, CSVMetadata, MLTrainingResult } from "@/lib/api";

type PlayMode = "interactive" | "csv";

export default function MLPlayground() {
    const [modeScreen, setModeScreen] = useState<PlayMode>("interactive");

    // Interactive State
    const [points, setPoints] = useState<Point[]>([]);
    const [modelType, setModelType] = useState<ModelType>('logistic');
    const [trainingResult, setTrainingResult] = useState<TrainingResult | null>(null);
    const [isTraining, setIsTraining] = useState(false);
    const [addMode, setAddMode] = useState<'add_0' | 'add_1'>('add_0');

    // Hyperparameters
    const [k, setK] = useState(3);
    const [lr, setLr] = useState(0.1);
    const [epochs, setEpochs] = useState(500);

    // CSV State
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [fileId, setFileId] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<CSVMetadata | null>(null);
    const [targetCol, setTargetCol] = useState<string>("");
    const [csvModel, setCsvModel] = useState<string>("random_forest");
    const [csvTraining, setCsvTraining] = useState(false);
    const [csvResults, setCsvResults] = useState<MLTrainingResult | null>(null);
    const [insight, setInsight] = useState<string>("");
    const [loadingInsight, setLoadingInsight] = useState(false);

    // --- Interactive Functions ---
    const generateData = () => {
        const newPoints: Point[] = [];
        for (let i = 0; i < 40; i++) {
            newPoints.push({ x: 20 + Math.random() * 30, y: 20 + Math.random() * 30, label: 0 });
            newPoints.push({ x: 50 + Math.random() * 30, y: 50 + Math.random() * 30, label: 1 });
        }
        setPoints(newPoints);
        setTrainingResult(null);
    };

    const clearData = () => {
        setPoints([]);
        setTrainingResult(null);
    };

    const runModel = async () => {
        if (points.length === 0) return;
        setIsTraining(true);
        setTrainingResult(null);
        await new Promise(r => setTimeout(r, 500));
        let result: TrainingResult;
        switch (modelType) {
            case 'logistic': result = await trainLogisticRegression(points, lr, epochs); break;
            case 'knn': result = await runKNN(points, k); break;
            case 'kmeans': result = await runKMeans(points, k); break;
        }
        // Force result to align with type if needed, but here it matches
        setTrainingResult(result as TrainingResult);
        setIsTraining(false);
    };

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

    const trainCSVModel = async () => {
        if (!fileId || !targetCol) return;
        setCsvTraining(true);
        setCsvResults(null);
        setInsight("");
        try {
            const res = await api.trainMLModel(fileId, targetCol, csvModel);
            setCsvResults(res);

            // Auto generate insight
            if (!res.error) {
                setLoadingInsight(true);
                const ins = await api.getMLInsight(res, csvModel);
                setInsight(ins.insight);
                setLoadingInsight(false);
            }
        } catch (err) {
            console.error(err);
            alert("Training failed");
        } finally {
            setCsvTraining(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)]">
            {/* Top Toolbar for Mode Switching */}
            <div className="flex items-center space-x-4 px-6 pb-2 border-b border-gray-800 mb-4">
                <button
                    onClick={() => setModeScreen("interactive")}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${modeScreen === "interactive"
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-gray-400 hover:text-white"
                        }`}
                >
                    Interactive 2D Playground
                </button>
                <button
                    onClick={() => setModeScreen("csv")}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors flex items-center gap-2 ${modeScreen === "csv"
                        ? "border-green-500 text-green-400"
                        : "border-transparent text-gray-400 hover:text-white"
                        }`}
                >
                    <Upload className="w-4 h-4" />
                    Advanced CSV Analysis
                </button>
            </div>

            {modeScreen === "interactive" ? (
                // --- INTERACTIVE MODE ---
                <div className="flex flex-1 gap-6 px-6 pb-6 min-h-0">
                    {/* Left Sidebar: Controls */}
                    <div className="w-80 flex flex-col gap-6 bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur overflow-y-auto">
                        <div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                                <Database className="w-5 h-5 text-blue-400" />
                                Synthetic Data
                            </h2>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <button onClick={() => generateData()} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors text-left">Generate Blobs</button>
                                <button onClick={clearData} className="p-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded text-sm transition-colors flex items-center gap-2">
                                    <Trash2 className="w-4 h-4" /> Clear
                                </button>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider">Click to add points</div>
                                <div className="flex bg-gray-800 p-1 rounded-lg">
                                    <button
                                        onClick={() => setAddMode('add_0')}
                                        className={`flex-1 py-1.5 text-sm rounded ${addMode === 'add_0' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Class 0
                                    </button>
                                    <button
                                        onClick={() => setAddMode('add_1')}
                                        className={`flex-1 py-1.5 text-sm rounded ${addMode === 'add_1' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Class 1
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-px bg-gray-800" />
                        <div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent flex items-center gap-2">
                                <Brain className="w-5 h-5 text-green-400" />
                                Algorithm
                            </h2>
                            <div className="mt-4 space-y-4">
                                <select
                                    value={modelType}
                                    onChange={(e) => { setModelType(e.target.value as ModelType); setTrainingResult(null); }}
                                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="logistic">Logistic Regression</option>
                                    <option value="knn">K-Nearest Neighbors</option>
                                    <option value="kmeans">K-Means Clustering</option>
                                </select>
                                {modelType === 'logistic' && (
                                    <div className="space-y-4 animate-fade-in">
                                        <label className="text-xs text-gray-500 flex justify-between">Learning Rate: {lr}<input type="range" min="0.001" max="1.0" step="0.001" value={lr} onChange={(e) => setLr(parseFloat(e.target.value))} className="w-full mt-1 accent-blue-500" /></label>
                                        <label className="text-xs text-gray-500 flex justify-between">Epochs: {epochs}<input type="range" min="10" max="2000" step="10" value={epochs} onChange={(e) => setEpochs(parseInt(e.target.value))} className="w-full mt-1 accent-blue-500" /></label>
                                    </div>
                                )}
                                {(modelType === 'knn' || modelType === 'kmeans') && (
                                    <div className="animate-fade-in">
                                        <label className="text-xs text-gray-500 flex justify-between">K: {k}<input type="range" min="1" max="10" step="1" value={k} onChange={(e) => setK(parseInt(e.target.value))} className="w-full mt-1 accent-green-500" /></label>
                                    </div>
                                )}
                                <button onClick={runModel} disabled={isTraining || points.length === 0} className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isTraining ? 'bg-gray-700' : 'bg-blue-600 hover:bg-blue-500'}`}>{isTraining ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}{isTraining ? 'Training...' : 'Train Model'}</button>
                            </div>
                        </div>
                        {trainingResult && (
                            <div className="mt-auto bg-black rounded p-3 text-xs font-mono text-gray-300 h-32 overflow-y-auto border border-gray-800">
                                <div className="text-gray-500 mb-1 border-b border-gray-800 pb-1">Logs:</div>
                                {trainingResult.logs.map((log, i) => <div key={i} className="mb-1">{`> ${log}`}</div>)}
                            </div>
                        )}
                    </div>
                    {/* Right: Visualization */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex-1 bg-gray-900 rounded-2xl border border-gray-800 p-4 relative shadow-2xl">
                            <DataCanvas points={trainingResult?.modelType === 'kmeans' && trainingResult.clusters ? trainingResult.clusters : points} setPoints={setPoints} decisionBoundary={trainingResult?.decisionBoundary} centroids={trainingResult?.centroids} mode={addMode} />
                        </div>
                    </div>
                </div>
            ) : (
                // --- CSV MODE ---
                <div className="flex flex-1 gap-6 px-6 pb-6 min-h-0 overflow-y-auto">
                    {/* CSV Config Panel */}
                    <div className="w-1/3 flex flex-col gap-6">
                        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                            <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                1. Upload Data
                            </h2>
                            <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-green-500/50 transition-colors bg-black/20">
                                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                                <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                                    {uploading ? <RotateCcw className="w-8 h-8 animate-spin text-green-500 mb-2" /> : <Upload className="w-8 h-8 text-gray-400 mb-2" />}
                                    <span className="text-gray-300 font-medium">{csvFile ? csvFile.name : "Click to upload CSV"}</span>
                                    <span className="text-xs text-gray-500 mt-1">Maximum 5MB</span>
                                </label>
                            </div>
                            {metadata && (
                                <div className="mt-4 space-y-2 animate-fade-in">
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>Rows: {metadata.shape[0]}</span>
                                        <span>Cols: {metadata.shape[1]}</span>
                                    </div>
                                    <div className="bg-black rounded p-2 text-xs font-mono text-gray-500 max-h-32 overflow-y-auto">
                                        {metadata.columns.join(", ")}
                                    </div>
                                </div>
                            )}
                        </div>

                        {metadata && (
                            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 animate-fade-in-up">
                                <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                                    <Brain className="w-5 h-5" />
                                    2. Configure Model
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Target Column (y)</label>
                                        <select value={targetCol} onChange={e => setTargetCol(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white">
                                            {metadata.columns.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400 block mb-1">Model Architecture</label>
                                        <select value={csvModel} onChange={e => setCsvModel(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white">
                                            <option value="logistic_regression">Logistic Regression</option>
                                            <option value="random_forest">Random Forest (Ensemble)</option>
                                            <option value="svm">Support Vector Machine</option>
                                            <option value="gradient_boosting">Gradient Boosting (XGB-style)</option>
                                            <option value="decision_tree">Decision Tree</option>
                                            <option value="naive_bayes">Naive Bayes</option>
                                            <option value="kmeans">K-Means (Unsupervised)</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={trainCSVModel}
                                        disabled={csvTraining}
                                        className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
                                    >
                                        {csvTraining ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                                        {csvTraining ? "Training on Backend..." : "Train & Analyze"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Results Panel */}
                    <div className="flex-1 flex flex-col gap-6">
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
                                                <p className="text-sm text-gray-500 mt-2 italic">
                                                    Showing a sample of test data. Points are colored by their true class.
                                                </p>
                                            </div>
                                        )}

                                        {/* 2. AI Insight */}
                                        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6 relative">
                                            <div className="flex items-center gap-2 mb-4 text-blue-300">
                                                <Brain className="w-5 h-5" />
                                                <h3 className="font-bold">AI Analysis</h3>
                                            </div>
                                            {loadingInsight ? (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <RotateCcw className="w-4 h-4 animate-spin" />
                                                    <span>TensorArena is analyzing your model...</span>
                                                </div>
                                            ) : (
                                                <div className="prose prose-invert prose-sm max-w-none">
                                                    <div className="whitespace-pre-wrap">{insight || "No insight available."}</div>
                                                </div>
                                            )}
                                        </div>

                                        {/* 3. Feature Importance & educational features */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {csvResults.feature_importance && (
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-300 mb-2 flex items-center gap-2">
                                                        <BarChart className="w-5 h-5" />
                                                        Feature Importance
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mb-4">
                                                        These weights indicate how significantly each input variable influences the model's prediction. Higher absolute values mean the feature is more critical for the decision boundary.
                                                    </p>
                                                    <div className="space-y-2">
                                                        {Object.entries(csvResults.feature_importance)
                                                            .sort(([, a], [, b]) => (b as number) - (a as number))
                                                            .slice(0, 8)
                                                            .map(([k, v]) => (
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

                                        {/* Raw Details */}
                                        <div className="mt-8 border-t border-gray-800 pt-4">
                                            <details className="cursor-pointer group">
                                                <summary className="text-gray-500 text-sm hover:text-white transition-colors">View Raw JSON Report</summary>
                                                <pre className="mt-4 p-4 bg-black rounded-lg text-xs font-mono text-gray-500 overflow-x-auto max-h-64">
                                                    {JSON.stringify(csvResults, null, 2)}
                                                </pre>
                                            </details>
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
            )}
        </div>
    );
}
