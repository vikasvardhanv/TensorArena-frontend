"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Brain, ArrowRight, CheckCircle2, AlertTriangle, Lightbulb, Play, ArrowLeft, Code } from "lucide-react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { api, RoleBasedQuestion } from "@/lib/api";
import {
    saveRoleBasedQuestion,
    getUnseenRoleBasedQuestions,
    submitRoleBasedAnswer
} from "@/app/actions/questionPersistence";
import { incrementQuestionUsage } from "@/app/actions/questions";
import { PaymentModal } from "@/components/PaymentModal";

const roles = [
    "Machine Learning Engineer",
    "Data Scientist",
    "Computer Vision Engineer",
    "NLP Engineer",
    "LLM Specialist",
    "AI Product Manager"
];

function RoleArenaContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get("source");
    const isProductionMode = mode === "production";

    const [role, setRole] = useState(isProductionMode ? "Machine Learning Engineer" : roles[0]);
    const [sessionState, setSessionState] = useState<'intro' | 'active' | 'summary'>('intro');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<(number | string)[]>([]);
    const [questions, setQuestions] = useState<RoleBasedQuestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [hintVisible, setHintVisible] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [usageStats, setUsageStats] = useState({ used: 0, subscribed: false });

    const startSession = async () => {
        setLoading(true);
        try {
            // Check usage limit
            const usageResult = await incrementQuestionUsage();
            if (!usageResult.success) {
                if (usageResult.requiresPayment) {
                    setShowPaymentModal(true);
                    setUsageStats({ used: 5, subscribed: false }); // Assume max used if limit hit
                }
                setLoading(false);
                return;
            }

            // First, try to get unseen questions from database
            const unseenResult = await getUnseenRoleBasedQuestions(role, 3);

            if (unseenResult.success && unseenResult.questions && unseenResult.questions.length >= 3) {
                // Use existing questions - convert null to undefined for type compatibility
                const normalizedQuestions = unseenResult.questions.map(q => ({
                    ...q,
                    explanation: q.explanation ?? undefined
                }));
                setQuestions(normalizedQuestions);
                setSessionState('active');
                setCurrentQuestionIndex(0);
                setUserAnswers(new Array(unseenResult.questions.length).fill(-1));
            } else {
                // Generate new questions from LLM
                const newQuestions = await api.generateRoleBasedQuestions(role, 3);

                // Save to database
                for (const q of newQuestions) {
                    await saveRoleBasedQuestion({
                        title: q.title,
                        scenario: q.scenario,
                        type: q.type,
                        role: q.role,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation,
                        codeSnippet: q.codeSnippet,
                        expectedOutput: q.expectedOutput,
                    });
                }

                setQuestions(newQuestions);
                setSessionState('active');
                setCurrentQuestionIndex(0);
                setUserAnswers(new Array(newQuestions.length).fill(-1));
            }
        } catch (error) {
            console.error("Failed to start session:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            alert(
                "Failed to generate questions. This may be due to a temporary backend issue.\n\n" +
                "Error: " + errorMessage + "\n\n" +
                "Please try again or contact support if the issue persists."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (answer: number | string) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answer;
        setUserAnswers(newAnswers);
    };

    const nextQuestion = async () => {
        const currentQ = questions[currentQuestionIndex];

        // Submit answer to database
        if (currentQ.id) {
            await submitRoleBasedAnswer(currentQ.id, userAnswers[currentQuestionIndex]);
        }

        setHintVisible(false);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setSessionState('summary');
        }
    };

    const isCorrectAnswer = (questionIndex: number) => {
        const q = questions[questionIndex];
        const userAns = userAnswers[questionIndex];

        if (q.type === "multiple-choice") {
            return userAns === q.correctAnswer;
        } else if (q.type === "fill-in-blank") {
            // For fill-in-blank, we do case-insensitive comparison
            return String(userAns).toLowerCase().trim() === String(q.correctAnswer).toLowerCase().trim();
        } else if (q.type === "output-selection") {
            return userAns === q.correctAnswer;
        }
        return false;
    };

    if (sessionState === 'intro') {
        return (
            <div className="max-w-2xl mx-auto text-center pt-20">
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    questionsUsed={usageStats.used}
                />

                <div className="mb-8 flex justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Brain className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h1 className="text-4xl font-bold mb-6">
                    {isProductionMode ? "Production Incident Simulator" : "Role-Based Scenarios"}
                </h1>
                <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                    Test your expertise with AI-generated scenarios tailored to your role.
                    Solve real-world problems, debug incidents, and make architectural decisions.
                </p>

                {!isProductionMode && (
                    <div className="mb-10 text-left bg-gray-900 border border-gray-800 p-6 rounded-xl">
                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Select Your Role</label>
                        <div className="grid grid-cols-2 gap-3">
                            {roles.map(r => (
                                <button
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={`p-3 rounded-lg text-sm font-medium transition-all text-left ${role === r ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <button
                    onClick={startSession}
                    disabled={loading}
                    className="w-full py-4 bg-white text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                    {loading ? "Generating Questions..." : "Start Challenge Session"}
                </button>
            </div>
        );
    }

    if (sessionState === 'summary') {
        const correctCount = questions.filter((_, i) => isCorrectAnswer(i)).length;

        return (
            <div className="max-w-3xl mx-auto pt-12 pb-20">
                <h2 className="text-3xl font-bold mb-8 text-center">Session Summary</h2>

                <div className="text-center mb-12">
                    <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 mb-2">
                        {correctCount} / {questions.length}
                    </div>
                    <p className="text-gray-500 uppercase tracking-widest text-sm font-bold">Score</p>
                </div>

                <div className="space-y-8">
                    {questions.map((q, i) => (
                        <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <span className="text-xs px-2 py-1 rounded bg-purple-900/30 text-purple-400 border border-purple-800/50 uppercase tracking-wider font-bold">
                                    {q.type.replace('-', ' ')}
                                </span>
                                <h3 className="text-lg font-bold flex-1">{q.title}</h3>
                            </div>
                            <p className="text-gray-300 mb-6">{q.scenario}</p>

                            {q.codeSnippet && (
                                <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 mb-6 font-mono text-sm">
                                    <pre className="whitespace-pre-wrap text-green-400">{q.codeSnippet}</pre>
                                </div>
                            )}

                            {q.type === "multiple-choice" && q.options && (
                                <div className="space-y-3 mb-6">
                                    {q.options.map((opt: string, optIdx: number) => (
                                        <div key={optIdx} className={`p-3 rounded border flex items-center justify-between ${optIdx === q.correctAnswer ? 'bg-green-900/20 border-green-500/50 text-green-400' :
                                            optIdx === userAnswers[i] ? 'bg-red-900/20 border-red-500/50 text-red-400' :
                                                'bg-gray-800/50 border-gray-800 text-gray-500'
                                            }`}>
                                            <span>{opt}</span>
                                            {optIdx === q.correctAnswer && <CheckCircle2 className="w-5 h-5" />}
                                            {optIdx === userAnswers[i] && optIdx !== q.correctAnswer && <AlertTriangle className="w-5 h-5" />}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {q.type === "fill-in-blank" && (
                                <div className="mb-6">
                                    <div className="text-sm text-gray-500 mb-2">Your answer:</div>
                                    <div className={`p-3 rounded border ${isCorrectAnswer(i) ? 'bg-green-900/20 border-green-500/50 text-green-400' :
                                        'bg-red-900/20 border-red-500/50 text-red-400'
                                        }`}>
                                        {String(userAnswers[i])}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-2">Correct answer:</div>
                                    <div className="p-3 rounded border bg-green-900/20 border-green-500/50 text-green-400">
                                        {String(q.correctAnswer)}
                                    </div>
                                </div>
                            )}

                            {q.type === "output-selection" && q.options && (
                                <div className="space-y-3 mb-6">
                                    {q.options.map((opt: string, optIdx: number) => (
                                        <div key={optIdx} className={`p-3 rounded border flex items-center justify-between ${optIdx === q.correctAnswer ? 'bg-green-900/20 border-green-500/50 text-green-400' :
                                            optIdx === userAnswers[i] ? 'bg-red-900/20 border-red-500/50 text-red-400' :
                                                'bg-gray-800/50 border-gray-800 text-gray-500'
                                            }`}>
                                            <code className="text-sm">{opt}</code>
                                            {optIdx === q.correctAnswer && <CheckCircle2 className="w-5 h-5" />}
                                            {optIdx === userAnswers[i] && optIdx !== q.correctAnswer && <AlertTriangle className="w-5 h-5" />}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {q.explanation && (
                                <div className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-lg">
                                    <h4 className="text-sm font-bold text-blue-400 mb-1 flex items-center gap-2">
                                        <Lightbulb className="w-4 h-4" /> Explanation
                                    </h4>
                                    <p className="text-sm text-gray-300 leading-relaxed">{q.explanation}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={() => setSessionState('intro')}
                        className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors border border-gray-700"
                    >
                        Start New Session
                    </button>
                </div>
            </div>
        );
    }

    // Active Question View
    const currentQ = questions[currentQuestionIndex];
    const hasAnswered = userAnswers[currentQuestionIndex] !== -1 && userAnswers[currentQuestionIndex] !== "";

    return (
        <div className="max-w-3xl mx-auto pt-12 h-full flex flex-col">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                    <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <span className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-purple-900/30 text-purple-400 border border-purple-800/50">
                            {currentQ.type.replace('-', ' ')}
                        </span>
                        {role} Scenario
                    </span>
                </div>
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500 ease-out"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="flex-1">
                <h2 className="text-2xl font-bold mb-6">{currentQ.title}</h2>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl mb-8 text-lg leading-relaxed text-gray-300 shadow-inner">
                    {currentQ.scenario}
                </div>

                {/* Code Snippet if present */}
                {currentQ.codeSnippet && (
                    <div className="mb-8 bg-gray-950 border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Code className="w-4 h-4 text-gray-500" />
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Code</span>
                        </div>
                        <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">{currentQ.codeSnippet}</pre>
                    </div>
                )}

                {/* Question Type Specific Rendering */}
                {currentQ.type === "multiple-choice" && currentQ.options && (
                    <div className="space-y-4 mb-8">
                        {currentQ.options.map((opt: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswerSelect(idx)}
                                className={`w-full p-4 text-left rounded-xl border transition-all ${userAnswers[currentQuestionIndex] === idx
                                    ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500'
                                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-500'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${userAnswers[currentQuestionIndex] === idx ? 'border-blue-400 bg-blue-500 text-white' : 'border-gray-600'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    {opt}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {currentQ.type === "fill-in-blank" && (
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-400 mb-3">Your Answer</label>
                        <input
                            type="text"
                            value={String(userAnswers[currentQuestionIndex] === -1 ? "" : userAnswers[currentQuestionIndex])}
                            onChange={(e) => handleAnswerSelect(e.target.value)}
                            placeholder="Type your answer here..."
                            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                )}

                {currentQ.type === "output-selection" && currentQ.options && (
                    <div className="mb-8">
                        <div className="text-sm font-bold text-gray-400 mb-3">What is the expected output?</div>
                        <div className="space-y-3">
                            {currentQ.options.map((opt: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswerSelect(idx)}
                                    className={`w-full p-4 text-left rounded-xl border transition-all font-mono text-sm ${userAnswers[currentQuestionIndex] === idx
                                        ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500'
                                        : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-500'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${userAnswers[currentQuestionIndex] === idx ? 'border-blue-400 bg-blue-500 text-white' : 'border-gray-600'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <code className="whitespace-pre-wrap flex-1">{opt}</code>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hint */}
                <div className="mb-8">
                    {hintVisible ? (
                        <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg text-sm text-yellow-200">
                            <span className="font-bold">Hint:</span> Think about the role-specific best practices and production scenarios.
                        </div>
                    ) : (
                        <button
                            onClick={() => setHintVisible(true)}
                            className="text-sm text-gray-500 hover:text-yellow-500 flex items-center gap-2 transition-colors"
                        >
                            <Lightbulb className="w-4 h-4" /> Need a hint?
                        </button>
                    )}
                </div>
            </div>

            <div className="py-6 border-t border-gray-800 flex justify-end">
                <button
                    onClick={nextQuestion}
                    disabled={!hasAnswered}
                    className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    {currentQuestionIndex === questions.length - 1 ? 'Finish Session' : 'Next Question'}
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default function RoleArenaPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
            <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Hub</span>
                    </Link>
                    <div className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Role-Based<span className="text-white font-light ml-1">Arena</span>
                    </div>
                    <div className="w-16"></div>
                </div>
            </div>

            <div className="container mx-auto px-6 pb-12">
                <Suspense fallback={<div className="text-center pt-20">Loading...</div>}>
                    <RoleArenaContent />
                </Suspense>
            </div>
        </div>
    );
}
