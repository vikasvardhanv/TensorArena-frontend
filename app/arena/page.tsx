"use client";

import React, { useState, useEffect } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { QuestionDisplay } from "@/components/QuestionDisplay";
import { api, Question } from "@/lib/api";
import { Loader2, Play, RefreshCw, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ArenaPage() {
    const [question, setQuestion] = useState<Question | null>(null);
    const [code, setCode] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState("Python Basics");
    const [difficulty, setDifficulty] = useState("Basic");

    const generateNewQuestion = async () => {
        setLoading(true);
        try {
            const newQuestion = await api.generateQuestion(topic, difficulty);
            setQuestion(newQuestion);
            setCode(newQuestion.solution_template);
        } catch (error) {
            console.error("Failed to generate question:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateNewQuestion();
    }, []);

    return (
        <div className="h-screen w-full bg-black text-white flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        AI LeetCode Arena
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option>Python Basics</option>
                        <option>Data Structures</option>
                        <option>Algorithms</option>
                        <option>Machine Learning</option>
                        <option>Neural Networks</option>
                    </select>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option>Basic</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                    <button
                        onClick={generateNewQuestion}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4" />
                        )}
                        <span>New Question</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Panel: Question */}
                <div className="w-1/2 h-full p-4 border-r border-gray-800 overflow-hidden">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            <div className="flex flex-col items-center space-y-4">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                <p>Generating AI Question...</p>
                            </div>
                        </div>
                    ) : question ? (
                        <QuestionDisplay
                            title={question.title}
                            description={question.description}
                            difficulty={question.difficulty}
                            topic={question.topic}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            No question loaded.
                        </div>
                    )}
                </div>

                {/* Right Panel: Editor */}
                <div className="w-1/2 h-full flex flex-col">
                    <div className="flex-1 p-4 pb-0">
                        <CodeEditor code={code} onChange={(val) => setCode(val || "")} />
                    </div>

                    {/* Action Bar */}
                    <div className="h-16 border-t border-gray-800 flex items-center justify-end px-6 space-x-4 bg-gray-900/30">
                        <button className="flex items-center space-x-2 px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors">
                            <Play className="w-4 h-4" />
                            <span>Run Code</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white font-medium transition-colors shadow-lg shadow-green-900/20">
                            <Send className="w-4 h-4" />
                            <span>Submit</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
