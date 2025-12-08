"use client";

import React, { useState, useEffect } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { QuestionDisplay } from "@/components/QuestionDisplay";
import { PaymentModal } from "@/components/PaymentModal";
import { api, Question } from "@/lib/api";
import { incrementQuestionUsage, checkQuestionLimit } from "@/app/actions/questions";
import { saveQuestion, getUnseenQuestion, submitSolution, markQuestionAsSeen } from "@/app/actions/questionPersistence";
import { Loader2, Play, RefreshCw, Send, ArrowLeft, Sparkles, LogOut, Code2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function ArenaPage() {
    const { data: session } = useSession();
    const [question, setQuestion] = useState<Question | null>(null);
    const [code, setCode] = useState<string>(`# Welcome to AI LeetCode Arena!
# 
# Instructions:
# 1. Select your difficulty and topic from the dropdowns above
# 2. Click "Start" to generate a question
# 3. Write your solution below
# 4. Click "Run Code" to test
# 5. Click "Submit" when ready
#
# Your code will appear here once a question is loaded...
`);
    const [loading, setLoading] = useState(false);
    const [topic, setTopic] = useState("Python");
    const [difficulty, setDifficulty] = useState("Basic");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<string>("");
    const [questionStats, setQuestionStats] = useState({
        questionsUsed: 0,
        questionsRemaining: 5,
        isSubscribed: false,
    });

    const loadQuestionStats = async () => {
        const stats = await checkQuestionLimit();
        if (stats.canGenerate !== undefined) {
            setQuestionStats({
                questionsUsed: stats.questionsUsed || 0,
                questionsRemaining: stats.questionsRemaining || 0,
                isSubscribed: stats.isSubscribed || false,
            });
        }
    };

    const generateNewQuestion = async () => {
        setLoading(true);
        setSubmitMessage("");
        try {
            // Check and increment usage
            const result = await incrementQuestionUsage();

            if (!result.success) {
                if (result.requiresPayment) {
                    setShowPaymentModal(true);
                }
                setLoading(false);
                return;
            }

            // Update stats
            await loadQuestionStats();

            // First, try to get an unseen question from database
            const unseenResult = await getUnseenQuestion(topic, difficulty);

            if (unseenResult.success && unseenResult.question) {
                // Use existing question from database
                setQuestion(unseenResult.question as Question);
                setCode(unseenResult.question.solution_template);
                setCurrentQuestionId(unseenResult.question.id);

                // Mark as seen immediately so it won't appear again
                await markQuestionAsSeen(unseenResult.question.id);
            } else {
                // Generate new question from AI
                const newQuestion = await api.generateQuestion(topic, difficulty);
                setQuestion(newQuestion);
                setCode(newQuestion.solution_template);

                // Save to database
                const saveResult = await saveQuestion(newQuestion);
                if (saveResult.success && saveResult.questionId) {
                    setCurrentQuestionId(saveResult.questionId);
                    // Mark as seen immediately
                    await markQuestionAsSeen(saveResult.questionId);
                } else {
                    setCurrentQuestionId(null);
                }
            }
        } catch (error) {
            console.error("Failed to generate question:", error);
        } finally {
            setLoading(false);
        }
    };

    const [output, setOutput] = useState<string>("");
    const [executing, setExecuting] = useState(false);

    const runCode = async () => {
        setExecuting(true);
        setOutput("");
        setSubmitMessage("");
        try {
            const message = "Code execution is disabled in this build.";
            setOutput(message);
            setSubmitMessage(message);
        } finally {
            setExecuting(false);
        }
    };

    const handleSubmit = async () => {
        if (!currentQuestionId) {
            setSubmitMessage("No question loaded");
            return;
        }

        setSubmitting(true);
        setSubmitMessage("");
        try {
            const executionMessage = "Code execution is disabled in this build. Submission saved without running.";

            const submitResult = await submitSolution(currentQuestionId, code, executionMessage);

            if (submitResult.success) {
                setSubmitMessage("✅ " + (submitResult.message || "Solution submitted successfully!"));
                setOutput(executionMessage);
            } else {
                setSubmitMessage("❌ " + (submitResult.error || "Submission failed"));
            }
        } catch (error) {
            console.error("Submission failed:", error);
            setSubmitMessage("❌ Error submitting solution");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        loadQuestionStats();
        // Don't auto-generate on mount - wait for user to click
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
                    {/* User Info */}
                    {session?.user?.email && (
                        <div className="flex items-center space-x-3 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
                            <span className="text-sm text-gray-400">{session.user.email}</span>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}

                    {/* Question Counter */}
                    <div className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                        {questionStats.isSubscribed ? (
                            <div className="flex items-center space-x-2">
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm font-medium text-yellow-500">Premium</span>
                            </div>
                        ) : (
                            <div className="text-sm">
                                <span className="text-gray-400">Questions: </span>
                                <span className="font-bold text-blue-500">
                                    {questionStats.questionsRemaining} / 5
                                </span>
                                <span className="text-gray-500 ml-1">free</span>
                            </div>
                        )}
                    </div>

                    <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option>Python</option>
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
                        <span>{question ? "Next Question" : "Start"}</span>
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
                                <p>Generating {difficulty} level {topic} question...</p>
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
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center space-y-6 max-w-md">
                                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-500">
                                    <Code2 className="w-10 h-10" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">Ready to Code?</h2>
                                    <p className="text-gray-400">
                                        Click &quot;Start&quot; to generate a <span className="text-blue-400 font-medium">{difficulty}</span> level <span className="text-blue-400 font-medium">{topic}</span> challenge.
                                    </p>
                                </div>
                                <button
                                    onClick={generateNewQuestion}
                                    disabled={loading}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Generating..." : "Start Coding"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Editor */}
                <div className="w-1/2 h-full flex flex-col">
                    <div className="flex-1 p-4 pb-0 flex flex-col min-h-0">
                        <div className="flex-1 min-h-0">
                            <CodeEditor code={code} onChange={(val) => setCode(val || "")} />
                        </div>
                        {output && (
                            <div className="h-1/3 mt-4 bg-gray-900 border-t border-gray-800 p-4 font-mono text-sm overflow-auto">
                                <div className="text-gray-500 mb-2 text-xs uppercase tracking-wider">Output</div>
                                <pre className="whitespace-pre-wrap">{output}</pre>
                            </div>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="h-16 border-t border-gray-800 flex items-center justify-between px-6 bg-gray-900/30">
                        {submitMessage && (
                            <div className="text-sm font-medium">
                                {submitMessage}
                            </div>
                        )}
                        <div className="flex items-center space-x-4 ml-auto">
                            <button
                                onClick={runCode}
                                disabled={executing}
                                className="flex items-center space-x-2 px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors disabled:opacity-50"
                            >
                                {executing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                <span>Run Code</span>
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !currentQuestionId}
                                className="flex items-center space-x-2 px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white font-medium transition-colors shadow-lg shadow-green-900/20 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                <span>Submit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                questionsUsed={questionStats.questionsUsed}
            />
        </div>
    );
}
